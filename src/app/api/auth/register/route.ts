import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; password?: string };
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? '';

    if (!name || !email || password.length < 6) {
      return NextResponse.json({ error: 'Enter your name, a valid email, and a password with at least 6 characters.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, passwordHash } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'We could not create your account. Please try again.' }, { status: 500 });
  }
}
