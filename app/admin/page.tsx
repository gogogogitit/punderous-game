import { sql } from '@vercel/postgres';

// Force dynamic rendering and disable cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EmailSubmission {
  id: number;
  email: string;
  comment: string | null;
  timestamp: Date;
}

interface DatabaseError {
  message: string;
  code?: string;
}

async function getEmailSubmissions(): Promise<EmailSubmission[]> {
  try {
    console.log('Attempting to fetch email submissions...');
    
    const { rows } = await sql<EmailSubmission>`
      SELECT id, email, comment, 
             COALESCE(timestamp, created_at) as timestamp
      FROM email_submissions
      ORDER BY COALESCE(timestamp, created_at) DESC;
    `;
    
    console.log('Fetched submissions:', rows);
    return rows;
  } catch (error) {
    console.error('Error fetching email submissions:', error);
    throw error as DatabaseError;
  }
}

export default async function AdminPage() {
  let submissions: EmailSubmission[] = [];
  let error: DatabaseError | null = null;

  try {
    submissions = await getEmailSubmissions();
  } catch (e) {
    error = e as DatabaseError;
    console.error('Error in AdminPage:', e);
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Email Submissions</h1>
        
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading submissions. Please try again later.</p>
            <p className="text-red-400 text-sm mt-1">{error.message}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission: EmailSubmission) => (
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
                    {new Date(submission.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}