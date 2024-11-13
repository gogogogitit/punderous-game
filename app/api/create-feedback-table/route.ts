import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({ message: 'Feedback table created successfully' });
  } catch (error) {
    console.error('Error creating feedback table:', error);
    return NextResponse.json({ error: 'Error creating feedback table' }, { status: 500 });
  }
}