import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const { email, comment } = await request.json();

  if (!email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO email_submissions (email, comment, timestamp)
      VALUES (${email}, ${comment || ''}, ${new Date().toISOString()})
    `;

    return NextResponse.json({ success: true, message: 'Submission successful' });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ success: false, error: 'Error storing data' }, { status: 500 });
  }
}