import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, comment } = await request.json();
    console.log('Received submission:', { email, comment });

    if (!email) {
      console.log('Email is required');
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO email_submissions (email, comment)
      VALUES (${email}, ${comment || null})
      RETURNING id, email, comment;
    `;
    console.log('Inserted data:', result.rows[0]);

    return NextResponse.json({ success: true, message: 'Submission successful', data: result.rows[0] });
  } catch (error) {
    console.error('Error in POST /api/submit-email:', error);
    return NextResponse.json({ success: false, error: 'Error processing request' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Email submission API is running' });
}