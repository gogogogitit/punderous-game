import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      result 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500 
    });
  } finally {
    await prisma.$disconnect();
  }
}