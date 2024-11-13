import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('Starting submission process...');

  try {
    const { email, comment } = await request.json();

    if (!email) {
      console.log('Email missing from submission');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Processing submission for:', email);

    const submission = await prisma.emailSubmission.create({
      data: {
        email,
        comment: comment || '',
      },
    });

    console.log('Submission stored successfully:', submission);

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your interest! We\'ll keep you updated.',
      id: submission.id
    });

  } catch (error) {
    console.error('Error in submission process:', error);
    
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = `Submission error: ${error.message}`;
    } else {
      errorMessage = 'An unknown error occurred';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}