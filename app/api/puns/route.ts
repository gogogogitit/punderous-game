import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  console.log('Puns API: Starting request');
  try {
    if (!process.env.DATABASE_URL) {
      console.error('Puns API: DATABASE_URL is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Database configuration error' 
      }, { status: 500 });
    }

    console.log('Puns API: Connecting to database...');
    const puns = await prisma.pun.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        difficulty: true,
        upVotes: true,
        downVotes: true,
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`Puns API: Retrieved ${puns.length} puns from database`);

    return new NextResponse(JSON.stringify({ 
      success: true, 
      puns 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Puns API: Error occurred:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to retrieve puns',
      error: error instanceof Error ? error.message : 'Unknown error'
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