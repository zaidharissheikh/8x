import sys
import json
import os
import re

def clean_content(content):
    # Remove <thought>...</thought>
    content = re.sub(r'<thought>.*?</thought>', '', content, flags=re.DOTALL)
    
    # Remove native Antigravity thought blocks (starts with some exotic char + 'thought\n' and ends with some exotic char)
    # Using a robust regex to find 'thought' at the beginning of the string preceded by non-alphanumeric, ending with non-alphanumeric
    content = re.sub(r'^([^\w\s])?thought\n.*?\n([^\w\s])?\n?', '', content, flags=re.DOTALL)
    
    # Also handle tool calls
    content = re.sub(r'[^\w\s]?call:\w+\{.*?\}[^\w\s]?', '', content, flags=re.DOTALL)
    
    # Clean up any leftover tool call artifacts just in case
    content = re.sub(r'[\uE000-\uF8FF]', '', content)
    
    return content.strip()

def extract_log(input_data):
    conversation_id = input_data.get("conversationId", "unknown-session")
    transcript_path = input_data.get("transcriptPath")
    model_name = "Gemini 3.1 Pro (High)"
    tool_name = "Antigravity IDE"
    author = "amaan"
    project = "8x"
    
    workspace_paths = input_data.get("workspacePaths", [])
    if not workspace_paths:
        return
        
    workspace_root = workspace_paths[0]
    logs_dir = os.path.join(workspace_root, ".agent-logs")
    os.makedirs(logs_dir, exist_ok=True)
    
    if not transcript_path:
        return
        
    full_transcript_path = transcript_path.replace("transcript.jsonl", "transcript_full.jsonl")
    if not os.path.exists(full_transcript_path):
        return
        
    steps = []
    with open(full_transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                steps.append(json.loads(line))
                
    exchanges = []
    current_exchange = None
    
    for step in steps:
        if step.get("type") == "USER_INPUT":
            # If we have an ongoing exchange, finalize it
            if current_exchange:
                # Get the final response text
                final_response = ""
                if current_exchange["responses"]:
                    final_response = current_exchange["responses"][-1]
                current_exchange["final_response"] = final_response
                exchanges.append(current_exchange)
            
            content = step.get("content", "")
            # Clean up user request tags if any
            content = re.sub(r'<USER_REQUEST>\n?', '', content)
            content = re.sub(r'\n?</USER_REQUEST>', '', content)
            content = re.sub(r'<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>', '', content, flags=re.DOTALL)
            content = re.sub(r'<USER_SETTINGS_CHANGE>.*?</USER_SETTINGS_CHANGE>', '', content, flags=re.DOTALL)
            
            current_exchange = {
                "prompt": content.strip(),
                "prompt_time": step.get("created_at", ""),
                "responses": [],
                "response_time": ""
            }
        elif step.get("type") == "PLANNER_RESPONSE" and current_exchange is not None:
            content = step.get("content", "")
            cleaned = clean_content(content)
            if cleaned:
                # If a response has text, we append it. The last one will be the final response.
                current_exchange["responses"].append(cleaned)
                current_exchange["response_time"] = step.get("created_at", "")
                
    if current_exchange:
        final_response = ""
        if current_exchange["responses"]:
            final_response = current_exchange["responses"][-1]
        current_exchange["final_response"] = final_response
        exchanges.append(current_exchange)
        
    if not exchanges:
        return
        
    first_prompt_time = exchanges[0]["prompt_time"]
    last_prompt_time = exchanges[-1]["prompt_time"]
    total_exchanges = len(exchanges)
    
    # Format date and time for filename
    try:
        date_part = first_prompt_time.split("T")[0]
        time_part = first_prompt_time.split("T")[1].replace("Z", "").replace(":", "-").split(".")[0]
        filename = f"{date_part}_{time_part}_{conversation_id[:8]}.md"
    except:
        filename = f"log_{conversation_id[:8]}.md"
        date_part = "unknown"
        
    filepath = os.path.join(logs_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f"---\n")
        f.write(f"session_id: {conversation_id}\n")
        f.write(f"date: {date_part}\n")
        f.write(f"author: {author}\n")
        f.write(f"model: {model_name}\n")
        f.write(f"tool: {tool_name}\n")
        f.write(f"project: {project}\n")
        f.write(f"total_exchanges: {total_exchanges}\n")
        f.write(f"first_prompt_time: {first_prompt_time}\n")
        f.write(f"last_prompt_time: {last_prompt_time}\n")
        f.write(f"---\n\n")
        f.write(f"# Session Log - {date_part}\n\n")
        f.write(f"Session: `{conversation_id[:8]}` | Project: `{project}` | Author: `{author}`\n\n")
        f.write(f"---\n\n")
        
        for i, ex in enumerate(exchanges, 1):
            f.write(f"[LOG_ENTRY type=PROMPT num={i} session={conversation_id[:8]}]\n")
            f.write(f"timestamp: {ex['prompt_time']}\n")
            f.write(f"model: {model_name}\n\n")
            f.write(f"{ex['prompt']}\n\n\n")
            
            f.write(f"[LOG_ENTRY type=RESPONSE num={i} session={conversation_id[:8]}]\n")
            f.write(f"timestamp: {ex['response_time']}\n")
            f.write(f"model: {model_name}\n\n")
            f.write(f"{ex['final_response']}\n\n\n")

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        extract_log(input_data)
        print(json.dumps({"decision": "continue"}))
    except Exception as e:
        print(json.dumps({"decision": "continue", "reason": str(e)}))
