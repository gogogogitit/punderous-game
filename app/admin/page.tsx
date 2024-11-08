import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const { rows } = await sql`SELECT * FROM submissions ORDER BY timestamp DESC`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Feedback Submissions</h1>
        {rows.length === 0 ? (
          <p className="text-center text-gray-500">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((submission) => (
              <div key={submission.id} className="bg-white shadow rounded-lg p-6">
                <p><strong>Email:</strong> {submission.email}</p>
                {submission.comment && <p><strong>Comment:</strong> {submission.comment}</p>}
                <p className="text-sm text-gray-500">
                  <strong>Submitted:</strong> {new Date(submission.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}