import { sql } from '@vercel/postgres';

export default async function AdminPage() {
  const { rows } = await sql`SELECT * FROM email_submissions ORDER BY timestamp DESC`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Email Submissions</h1>
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <p><strong>Email:</strong> {row.email}</p>
            {row.comment && <p><strong>Comment:</strong> {row.comment}</p>}
            <p><strong>Submitted:</strong> {new Date(row.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}