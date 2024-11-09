import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      CREATE TABLE IF NOT EXISTS admin_password (
        id SERIAL PRIMARY KEY,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO admin_password (password_hash)
      VALUES (${hashedPassword})
      ON CONFLICT (id) DO UPDATE SET password_hash = ${hashedPassword}, created_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true, message: 'Admin password set successfully' });
  } catch (error) {
    console.error('Error setting admin password:', error);
    return NextResponse.json({ success: false, error: 'Error setting admin password' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`SELECT password_hash FROM admin_password LIMIT 1`;
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'No admin password set' }, { status: 404 });
    }
    return NextResponse.json({ success: true, hasPassword: true });
  } catch (error) {
    console.error('Error checking admin password:', error);
    return NextResponse.json({ success: false, error: 'Error checking admin password' }, { status: 500 });
  }
}