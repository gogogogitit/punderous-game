import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { punId, voteType } = await request.json();

    const updatedPun = await prisma.pun.update({
      where: { id: punId },
      data: {
        [voteType === 'up' ? 'upVotes' : 'downVotes']: {
          increment: 1
        }
      }
    });

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
  }
}