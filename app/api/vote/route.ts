import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('Vote API called');
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ success: false, message: 'Database configuration error' }, { status: 500 });
    }

    // Parse the request body
    const { punId, voteType } = await request.json();
    console.log('Received vote:', { punId, voteType });

    // Validate input
    if (typeof punId !== 'number' || !['up', 'down'].includes(voteType)) {
      console.log('Invalid input data');
      return NextResponse.json(
        { success: false, message: 'Invalid input data.' },
        { status: 400 }
      );
    }

    console.log('Updating pun with ID:', punId);
    
    // Update the pun in the database
    const updatedPun = await prisma.pun.update({
      where: { id: punId },
      data: {
        [voteType === 'up' ? 'upVotes' : 'downVotes']: {
          increment: 1
        }
      }
    });

    console.log('Vote recorded successfully:', updatedPun);

    return NextResponse.json({ 
      success: true, 
      upVotes: updatedPun.upVotes, 
      downVotes: updatedPun.downVotes 
    });
  } catch (error) {
    console.error('Error in vote API:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target: string[] } };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'A vote for this pun already exists.' },
          { status: 409 }
        );
      }
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { success: false, message: 'Pun not found.' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your vote.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}