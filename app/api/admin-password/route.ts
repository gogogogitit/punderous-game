import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { password, action, token } = await request.json();
    
    if (action === 'set') {
      if (!password) {
        return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await sql`
        CREATE TABLE IF NOT EXISTS admin_password (
          id SERIAL PRIMARY KEY,
          password_hash TEXT NOT NULL,
          reset_token TEXT,
          reset_token_expires TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        INSERT INTO admin_password (password_hash)
        VALUES (${hashedPassword})
        ON CONFLICT (id) DO UPDATE SET password_hash = ${hashedPassword}, created_at = CURRENT_TIMESTAMP
      `;

      return NextResponse.json({ success: true, message: 'Admin password set successfully' });
    } else if (action === 'login') {
      if (!password) {
        return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
      }
      const result = await sql`SELECT password_hash FROM admin_password LIMIT 1`;
      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'No admin password set' }, { status: 404 });
      }

      const storedHash = result.rows[0].password_hash;
      const isMatch = await bcrypt.compare(password, storedHash);

      if (isMatch) {
        return NextResponse.json({ success: true, message: 'Login successful' });
      } else {
        return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
      }
    } else if (action === 'generate_reset_token') {
      const token = crypto.randomBytes(20).toString('hex');
      const expiresDate = new Date(Date.now() + 3600000); // 1 hour from now

      await sql`
        UPDATE admin_password
        SET reset_token = ${token}, reset_token_expires = ${expiresDate.toISOString()}
        WHERE id = 1
      `;

      const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin?reset_token=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Reset Your Admin Password',
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
      });

      return NextResponse.json({ success: true, message: 'Reset email sent' });
    } else if (action === 'reset_password') {
      if (!password || !token) {
        return NextResponse.json({ success: false, error: 'Password and token are required' }, { status: 400 });
      }

      const result = await sql`
        SELECT * FROM admin_password
        WHERE reset_token = ${token} AND reset_token_expires > NOW()
        LIMIT 1
      `;

      if (result.rows.length === 0) {
        return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await sql`
        UPDATE admin_password
        SET password_hash = ${hashedPassword}, reset_token = NULL, reset_token_expires = NULL
        WHERE id = 1
      `;

      return NextResponse.json({ success: true, message: 'Password reset successfully' });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing admin password request:', error);
    return NextResponse.json({ success: false, error: 'Error processing request' }, { status: 500 });
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