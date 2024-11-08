import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EmailSubmission {
  id: number;
  email: string;
  comment: string | null;
  created_at: string;
}

async function getEmailSubmissions(): Promise<EmailSubmission[]> {
  try {
    const { rows } = await sql<EmailSubmission>`
      SELECT id, email, comment, created_at
      FROM email_submissions
      ORDER BY created_at DESC;
    `;
    console.log('Fetched submissions:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching email submissions:', error);
    return [];
  }
}

export default async function AdminPage() {
  const submissions = await getEmailSubmissions();

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Email Submissions</h1>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500 text-center">No submissions yet.</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div 
                key={submission.id} 
                className="bg-white rounded-lg shadow p-6 space-y-3"
              >
                <div>
                  <span className="font-semibold text-gray-700">Email: </span>
                  <span className="text-gray-900">{submission.email}</span>
                </div>
                {submission.comment && (
                  <div>
                    <span className="font-semibold text-gray-700">Comment: </span>
                    <span className="text-gray-900">{submission.comment}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700">Submitted: </span>
                  <span className="text-gray-900">
                    {new Date(submission.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}