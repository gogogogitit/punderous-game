import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the database connection first
    await sql`SELECT 1`;
    
    const result = await sql`
      SELECT 
        id,
        email,
        comment,
        created_at as timestamp
      FROM email_submissions
      ORDER BY created_at DESC;
    `;
    
    // Log the result for debugging
    console.log('Submissions query result:', result);
    
    return NextResponse.json({
      submissions: result.rows,
      count: result.rows.length
    });
    
  } catch (error) {
    // Log the full error for debugging
    console.error('Database error:', error);
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
    
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

    // Test the database connection first
    await sql`SELECT 1`;

    const result = await sql`
      INSERT INTO email_submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING id, email, comment, created_at as timestamp;
    `;

    return NextResponse.json({
      success: true,
      submission: result.rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    
    // Check if it's a connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit email' },
      { status: 500 }
    );
  }
}