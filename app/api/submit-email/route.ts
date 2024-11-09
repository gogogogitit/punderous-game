import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  console.log('Starting email submission process...')
  
  // Get environment variables
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
  
  // Validate environment variables
  if (!ADMIN_EMAIL || !EMAIL_PASSWORD) {
    console.error('Missing email credentials in environment variables')
    return NextResponse.json(
      { error: 'Server configuration error - missing credentials' },
      { status: 500 }
    )
  }

  try {
    // Parse request body
    const { email, comment } = await request.json()
    console.log('Received submission from:', email)

    // Create transport with explicit authentication
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Using Gmail service instead of manual SMTP configuration
      auth: {
        user: ADMIN_EMAIL,
        pass: EMAIL_PASSWORD,
      }
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
      `
    }

    // Verify connection before sending
    await transporter.verify()
    console.log('Email transport verified successfully')

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId
    })

  } catch (error) {
    console.error('Error in email submission:', error)
    
    const errorMessage = error instanceof Error 
      ? `Email error: ${error.message}`
      : 'An unknown error occurred'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}