import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('Submit Email API called');
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    const { email, comment } = await request.json();
    console.log('Received submission:', { email, comment });

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid email format' 
      }, { status: 400 });
    }

    const submission = await prisma.emailSubmission.create({
      data: {
        email,
        comment: comment || ''
      }
    });

    console.log('Email submission saved:', submission);

    return NextResponse.json({ 
      success: true, 
      message: 'Email submitted successfully' 
    });
  } catch (error) {
    console.error('Error in submit email API:', error);
    
    // Check for Prisma-specific errors
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target: string[] } };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'This email has already been submitted.' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit email' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}