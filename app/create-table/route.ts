import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    console.log('Attempting to create table...');
    const result = await sql`
      CREATE TABLE IF NOT EXISTS email_submissions (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        comment TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Table creation result:', result);
    return NextResponse.json({ message: 'Table created successfully', result });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating table:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create table', 
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}