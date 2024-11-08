'use server'

import { sql } from '@vercel/postgres';

export async function submitFeedback(email: string, comment: string) {
  try {
    const result = await sql`
      INSERT INTO submissions (email, comment)
      VALUES (${email}, ${comment})
      RETURNING *
    `;

    console.log('Submission inserted:', result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: 'Failed to submit feedback' };
  }
}