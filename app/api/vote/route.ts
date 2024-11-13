import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { punId, voteType } = await request.json();

    if (!punId || !voteType) {
      return NextResponse.json({ error: 'Missing punId or voteType' }, { status: 400 });
    }

    const pun = await prisma.pun.findUnique({
      where: { id: punId }
    });

    if (!pun) {
      return NextResponse.json({ error: 'Pun not found' }, { status: 404 });
    }

    const updatedPun = await prisma.pun.update({
      where: { id: punId },
      data: {
        upVotes: voteType === 'up' ? { increment: 1 } : undefined,
        downVotes: voteType === 'down' ? { increment: 1 } : undefined,
      }
    });

    return NextResponse.json(updatedPun);
  } catch (error) {
    console.error('Error updating pun votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Vote API is working' });
}