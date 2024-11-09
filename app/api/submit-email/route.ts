import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM email_submissions
      ORDER BY created_at DESC;
    `;
    
    return NextResponse.json({ submissions: result.rows });
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, comment } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO email_submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING *;
    `;

    return NextResponse.json({ success: true, submission: result.rows[0] });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to submit email' },
      { status: 500 }
    );
  }
}