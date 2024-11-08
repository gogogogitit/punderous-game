import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, comment } = await request.json()

  console.log('Starting submission process...');

  try {
    // First, let's verify our table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'submissions'
      );
    `;
    console.log('Table check result:', tableCheck.rows[0]);

    // If table doesn't exist, create it
    if (!tableCheck.rows[0].exists) {
      console.log('Table does not exist, creating...');
      await sql`
        CREATE TABLE IF NOT EXISTS submissions (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          comment TEXT,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('Table created successfully');
    }

    // Insert the submission
    console.log('Inserting submission:', { email, comment });
    const result = await sql`
      INSERT INTO submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING *;
    `;
    console.log('Insert result:', result.rows[0]);

    // Verify the data was inserted by selecting it back
    const verification = await sql`
      SELECT * FROM submissions 
      ORDER BY timestamp DESC 
      LIMIT 5;
    `;
    console.log('Recent submissions:', verification.rows);

    return NextResponse.json({ 
      message: 'Submission successful',
      data: result.rows[0]
    }, { status: 200 })
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ 
      error: 'Error storing submission',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}