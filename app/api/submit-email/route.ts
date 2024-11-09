import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // First test the connection
    await sql`SELECT 1`;
    
    // Then perform the actual query
    const result = await sql`
      SELECT id, email, comment, created_at 
      FROM email_submissions 
      ORDER BY created_at DESC;
    `;
    
    // Log for debugging
    console.log('Database query result:', {
      rowCount: result.rows.length,
      firstRow: result.rows[0]
    });
    
    // Return a proper JSON response
    return new NextResponse(
      JSON.stringify(result.rows),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    // Log the full error
    console.error('Database error:', error);
    
    // Return a proper error response
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch submissions',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
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
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Test connection before insert
    await sql`SELECT 1`;

    const result = await sql`
      INSERT INTO email_submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING id, email, comment, created_at;
    `;

    return new NextResponse(
      JSON.stringify(result.rows[0]),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Database error:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to submit email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}