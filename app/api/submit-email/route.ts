import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import nodemailer from 'nodemailer'

export const runtime = 'edge'

export async function POST(request: Request) {
  console.log('Starting submission process...')

  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const TO_EMAIL = 'michaeljkatz.email@gmail.com'

  if (!SMTP_USER || !SMTP_PASS) {
    console.error('Missing SMTP credentials')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  try {
    const { email, comment } = await request.json()
    console.log('Received submission from:', email)

    // Store in database
    await sql`
      INSERT INTO submissions (email, comment)
      VALUES (${email}, ${comment})
    `

    // Send email
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: SMTP_USER,
      to: TO_EMAIL,
      subject: 'New Punderful Submission',
      text: `
New submission received:

Email: ${email}
Comment: ${comment || 'No comment provided'}
Time: ${new Date().toLocaleString()}
      `,
      html: `
        <h2>New submission received</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Comment:</strong> ${comment || 'No comment provided'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    })

    console.log('Submission stored and email sent successfully')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in submission process:', error)
    
    const errorMessage = error instanceof Error 
      ? `Submission error: ${error.message}`
      : 'An unknown error occurred'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}