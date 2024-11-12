-- Drop the admin_password table if it exists
DROP TABLE IF EXISTS admin_password;

-- Create the Pun table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Pun" (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  "upVotes" INTEGER NOT NULL DEFAULT 0,
  "downVotes" INTEGER NOT NULL DEFAULT 0
);

-- Ensure the EmailSubmission table exists and has the correct structure
CREATE TABLE IF NOT EXISTS "EmailSubmission" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  comment TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure the Submission table exists and has the correct structure
CREATE TABLE IF NOT EXISTS "Submission" (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  comment TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);