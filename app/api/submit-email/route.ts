import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await sql`
      SELECT id, email, comment, created_at 
      FROM email_submissions 
      ORDER BY created_at DESC
    `;
    
    console.log('Query successful, rows:', result.rows.length);
    
    return NextResponse.json(result.rows);
    
  } catch (error) {
    console.error('Database error:', error);
    
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch submissions' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, comment } = await request.json();
    
    if (!email) {
      return new NextResponse(
        JSON.stringify({ error: 'Email is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await sql`
      INSERT INTO email_submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING id, email, comment, created_at
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to submit email' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}