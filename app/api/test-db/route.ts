import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 + 1 as result`;
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}