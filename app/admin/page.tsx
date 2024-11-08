import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EmailSubmission {
  id: number;
  email: string;
  comment: string | null;
  timestamp: string;
}

async function getEmailSubmissions(): Promise<EmailSubmission[]> {
  try {
    const { rows } = await sql<EmailSubmission>`
      SELECT id, email, comment, timestamp
      FROM email_submissions
      ORDER BY timestamp DESC;
    `;
    console.log('Fetched submissions:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching email submissions:', error);
    throw error;
  }
}

export default async function AdminPage() {
  let submissions: EmailSubmission[] = [];
  let error: Error | null = null;

  try {
    submissions = await getEmailSubmissions();
  } catch (e) {
    error = e as Error;
    console.error('Error in AdminPage:', e);
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Email Submissions</h1>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>An error occurred while fetching submissions. Please try again later.</p>
            <p className="text-sm">{error.message}</p>
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-gray-500 text-center">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white shadow rounded-lg p-6">
                <p><strong>Email:</strong> {sub.email}</p>
                <p><strong>Comment:</strong> {sub.comment || 'No comment'}</p>
                <p><strong>Submitted:</strong> {new Date(sub.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}