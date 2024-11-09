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
  console.log('POST request received to /api/admin-password');
  try {
    const { password, action, token } = await request.json();
    console.log(`Received action: ${action}`);
    
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

      console.log('Password set successfully');
      return NextResponse.json({ success: true, message: 'Admin password set successfully' });
    } else if (action === 'login') {
      if (!password) {
        return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
      }
      const result = await sql`SELECT password_hash FROM admin_password LIMIT 1`;
      if (result.rows.length === 0) {
        console.log('No admin password set');
        return NextResponse.json({ success: false, error: 'No admin password set' }, { status: 404 });
      }

      const storedHash = result.rows[0].password_hash;
      const isMatch = await bcrypt.compare(password, storedHash);

      if (isMatch) {
        console.log('Login successful');
        return NextResponse.json({ success: true, message: 'Login successful' });
      } else {
        console.log('Incorrect password');
        return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
      }
    } else if (action === 'generate_reset_token') {
      const token = crypto.randomBytes(20).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hour from now

      await sql`
        UPDATE admin_password
        SET reset_token = ${token}, reset_token_expires = ${expires.toISOString()}
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

      console.log('Reset email sent');
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
        console.log('Invalid or expired reset token');
        return NextResponse.json({ success: false, error: 'Invalid or expired reset token' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await sql`
        UPDATE admin_password
        SET password_hash = ${hashedPassword}, reset_token = NULL, reset_token_expires = NULL
        WHERE id = 1
      `;

      console.log('Password reset successfully');
      return NextResponse.json({ success: true, message: 'Password reset successfully' });
    } else {
      console.log('Invalid action');
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing admin password request:', error);
    return NextResponse.json({ success: false, error: 'Error processing request' }, { status: 500 });
  }
}

export async function GET() {
  console.log('GET request received to /api/admin-password');
  try {
    const result = await sql`SELECT password_hash FROM admin_password LIMIT 1`;
    if (result.rows.length === 0) {
      console.log('No admin password set');
      return NextResponse.json({ success: true, hasPassword: false });
    }
    console.log('Admin password is set');
    return NextResponse.json({ success: true, hasPassword: true });
  } catch (error) {
    console.error('Error checking admin password:', error);
    return NextResponse.json({ success: false, error: 'Error checking admin password' }, { status: 500 });
  }
}