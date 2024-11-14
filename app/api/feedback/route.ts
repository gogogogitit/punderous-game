import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('Feedback API called');
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    const { email, comment } = await request.json();
    console.log('Received feedback:', { email, comment });

    // Validate input
    if (!email || !comment) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email and comment are required' 
      }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        email,
        comment
      }
    });

    console.log('Feedback saved:', feedback);

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback submitted successfully' 
    });
  } catch (error) {
    console.error('Error in feedback API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to submit feedback' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}