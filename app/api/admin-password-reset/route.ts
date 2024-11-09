import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// This should be replaced with a secure method of storing the token
let resetToken: string | null = null;

export async function POST(request: Request) {
  try {
    const { action } = await request.json();

    if (action === 'generate_reset_token') {
      // Generate a reset token
      resetToken = crypto.randomBytes(32).toString('hex');

      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      // Send email
      await transporter.sendMail({
        from: `"Punderful Admin" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'Password Reset for Punderful Admin',
        text: `Your password reset token is: ${resetToken}`,
        html: `<p>Your password reset token is: <strong>${resetToken}</strong></p>`
      });

      return NextResponse.json({ success: true, message: 'Reset email sent' });
    } else if (action === 'reset_password') {
      const { token, newPassword } = await request.json();

      if (token !== resetToken) {
        return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 });
      }

      // Here you would update the password in your database
      // For this example, we'll just clear the token
      resetToken = null;

      return NextResponse.json({ success: true, message: 'Password reset successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ success: false, error: 'Password reset failed' }, { status: 500 });
  }
}