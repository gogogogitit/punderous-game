import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('Vote API called');
  try {
    const { punId, voteType } = await request.json();
    console.log('Received vote:', { punId, voteType });

    if (typeof punId !== 'number' || !['up', 'down'].includes(voteType)) {
      console.log('Invalid input data');
      return NextResponse.json(
        { success: false, message: 'Invalid input data.' },
        { status: 400 }
      );
    }

    console.log('Updating pun with ID:', punId);
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
    return NextResponse.json(
      { success: false, message: 'An error occurred while processing your vote.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}