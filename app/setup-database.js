import { sql } from '@vercel/postgres';

async function setupDatabase() {
  try {
    // Check if the submissions table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'submissions'
      );
    `;

    if (!tableExists.rows[0].exists) {
      console.log('Creating submissions table...');
      await sql`
        CREATE TABLE submissions (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          comment TEXT,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('Submissions table created successfully.');
    } else {
      console.log('Submissions table already exists.');
    }

    // Verify the table structure
    const tableInfo = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'submissions';
    `;
    console.log('Table structure:');
    console.table(tableInfo.rows);

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();