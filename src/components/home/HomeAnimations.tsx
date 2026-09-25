"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function FadeReveal({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const el = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(el.current, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        delay,
        ease: 'power3.out', 
        scrollTrigger: { 
          trigger: el.current, 
          start: 'top 85%' 
        } 
      }
    );
  }, { scope: el });
  
  return <div ref={el} className={className}>{children}</div>;
}

export function ParallaxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.to(image.current, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: container.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className={cn("relative overflow-hidden bg-concrete", className)}>
      <img
        ref={image}
        src={src}
        alt={alt}
        className="absolute inset-0 h-[115%] w-full object-cover scale-105"
      />
    </div>
  );
}

export function ScrubRevealText({ text, className }: { text: string, className?: string }) {
  const el = useRef<HTMLHeadingElement>(null);
  
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const words = el.current?.querySelectorAll('.word');
    if (words) {
      gsap.fromTo(words, 
        { opacity: 0.2 },
        { 
          opacity: 1, 
          stagger: 0.1, 
          scrollTrigger: { 
            trigger: el.current, 
            start: 'top 80%', 
            end: 'bottom 50%', 
            scrub: true 
          } 
        }
      );
    }
  }, { scope: el, dependencies: [text] });

  return (
    <h2 ref={el} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word inline-block mr-[0.2em]">{word}</span>
      ))}
    </h2>
  );
}
