import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

export async function POST(request: Request) {
  console.log('Starting submission process...')

  try {
    // Validate request body
    const body = await request.json()
    
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const { email, comment } = body
    console.log('Received submission from:', email)

    // Store in database
    await sql`
      INSERT INTO submissions (email, comment)
      VALUES (${email}, ${comment || ''})
    `

    console.log('Submission stored successfully')
    return NextResponse.json({ 
      success: true,
      message: 'Submission stored successfully'
    })

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