import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

export async function POST(request: Request) {
  console.log('Starting submission process...')

  try {
    // Parse and validate request body
    const body = await request.json()
    
    if (!body.email) {
      console.log('Email missing from submission')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const { email, comment } = body
    console.log('Processing submission for:', email)

    // Attempt database insertion
    try {
      const result = await sql`
        INSERT INTO submissions (email, comment)
        VALUES (${email}, ${comment || ''})
        RETURNING id;
      `
      console.log('Submission stored successfully with ID:', result.rows[0].id)
      
      return NextResponse.json({ 
        success: true,
        message: 'Submission stored successfully',
        id: result.rows[0].id
      })
    } catch (error: unknown) {
      console.error('Database error:', error)
      if (error instanceof Error) {
        throw new Error(`Database error: ${error.message}`)
      } else {
        throw new Error('An unknown database error occurred')
      }
    }

  } catch (error: unknown) {
    console.error('Error in submission process:', error)
    
    let errorMessage: string
    if (error instanceof Error) {
      errorMessage = `Submission error: ${error.message}`
    } else {
      errorMessage = 'An unknown error occurred'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}