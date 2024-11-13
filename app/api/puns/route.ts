import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const pun = await prisma.pun.findUnique({
        where: { id: parseInt(id) }
      });
      if (!pun) {
        return NextResponse.json({ error: 'Pun not found' }, { status: 404 });
      }
      return NextResponse.json(pun);
    } else {
      const puns = await prisma.pun.findMany();
      return NextResponse.json({ puns });
    }
  } catch (error) {
    console.error('Error fetching puns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, answer, difficulty } = await request.json();

    if (!question || !answer || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    return NextResponse.json(newPun, { status: 201 });
  } catch (error) {
    console.error('Error creating new pun:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}