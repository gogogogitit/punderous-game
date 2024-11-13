import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  console.log('Puns API called');
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    const puns = await prisma.pun.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`Retrieved ${puns.length} puns from the database`);

    return NextResponse.json({ 
      success: true, 
      puns 
    });
  } catch (error) {
    console.error('Error in puns API:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to retrieve puns' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  console.log('Puns API POST called');
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    const { question, answer, difficulty } = await request.json();
    console.log('Received new pun:', { question, answer, difficulty });

    // Validate input
    if (!question || !answer || typeof difficulty !== 'number') {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid pun data' 
      }, { status: 400 });
    }

    const newPun = await prisma.pun.create({
      data: {
        question,
        answer,
        difficulty,
        upVotes: 0,
        downVotes: 0
      }
    });

    console.log('New pun created:', newPun);

    return NextResponse.json({ 
      success: true, 
      pun: newPun 
    });
  } catch (error) {
    console.error('Error in puns API POST:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create new pun' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}