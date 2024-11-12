'use server'

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

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

export async function votePun(question: string, voteType: 'up' | 'down') {
  try {
    // Use a conditional update based on vote type
    if (voteType === 'up') {
      await sql`
        UPDATE "Pun"
        SET "upVotes" = "upVotes" + 1
        WHERE question = ${question}
      `;
    } else {
      await sql`
        UPDATE "Pun"
        SET "downVotes" = "downVotes" + 1
        WHERE question = ${question}
      `;
    }

    // Fetch the updated record
    const result = await sql`
      SELECT * FROM "Pun"
      WHERE question = ${question}
    `;

    if (result.rows.length === 0) {
      throw new Error('Pun not found');
    }

    // Revalidate the page to reflect the changes
    revalidatePath('/');

    return { 
      success: true, 
      data: {
        upVotes: result.rows[0].upVotes,
        downVotes: result.rows[0].downVotes
      }
    };
  } catch (error) {
    console.error('Error recording vote:', error);
    return { success: false, error: 'Failed to record vote' };
  }
}