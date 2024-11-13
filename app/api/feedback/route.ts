import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, comment } = body;

    if (!email || !comment) {
      return NextResponse.json({ success: false, message: 'Email and comment are required' }, { status: 400 });
    }

    // Save feedback to PostgreSQL database
    await sql`
      INSERT INTO feedback (email, comment)
      VALUES (${email}, ${comment})
    `;

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return NextResponse.json({ success: false, message: 'Error submitting feedback' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Feedback API is working' });
}