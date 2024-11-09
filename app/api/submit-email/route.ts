import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465')

export async function POST(request: Request) {
  try {
    const { email, comment } = await request.json()

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: {
        user: ADMIN_EMAIL,
        pass: EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: ADMIN_EMAIL,
      to: ADMIN_EMAIL,
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
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    )
  }
}