/*
  # Survey Application Database Schema

  1. New Tables
    - `survey_participants`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `age` (integer)
      - `field_of_study` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `survey_submissions`
      - `id` (uuid, primary key)
      - `participant_id` (uuid, foreign key)
      - `survey_version` (text)
      - `completion_status` (text)
      - `submitted_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `survey_responses`
      - `id` (uuid, primary key)
      - `submission_id` (uuid, foreign key)
      - `role_title` (text)
      - `assigned_icon` (text)
      - `response_order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for service role to access all data

  3. Indexes
    - Add indexes for frequently queried columns
    - Optimize for participant lookup and submission retrieval
*/

-- Create survey_participants table
CREATE TABLE IF NOT EXISTS survey_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 100),
  field_of_study text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create survey_submissions table
CREATE TABLE IF NOT EXISTS survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES survey_participants(id) ON DELETE CASCADE,
  survey_version text NOT NULL DEFAULT '1.0',
  completion_status text NOT NULL DEFAULT 'incomplete' CHECK (completion_status IN ('incomplete', 'completed')),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  role_title text NOT NULL,
  assigned_icon text NOT NULL,
  response_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE survey_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for survey_participants
CREATE POLICY "Users can read own participant data"
  ON survey_participants
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own participant data"
  ON survey_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own participant data"
  ON survey_participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for survey_submissions
CREATE POLICY "Users can read own submissions"
  ON survey_submissions
  FOR SELECT
  TO authenticated
  USING (participant_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own submissions"
  ON survey_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (participant_id::text = auth.uid()::text);

CREATE POLICY "Users can update own submissions"
  ON survey_submissions
  FOR UPDATE
  TO authenticated
  USING (participant_id::text = auth.uid()::text);

-- Create policies for survey_responses
CREATE POLICY "Users can read own responses"
  ON survey_responses
  FOR SELECT
  TO authenticated
  USING (
    submission_id IN (
      SELECT id FROM survey_submissions 
      WHERE participant_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own responses"
  ON survey_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    submission_id IN (
      SELECT id FROM survey_submissions 
      WHERE participant_id::text = auth.uid()::text
    )
  );

-- Service role policies (for backend operations)
CREATE POLICY "Service role can access all participant data"
  ON survey_participants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all submission data"
  ON survey_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all response data"
  ON survey_responses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_survey_participants_email ON survey_participants(email);
CREATE INDEX IF NOT EXISTS idx_survey_submissions_participant_id ON survey_submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_survey_submissions_status ON survey_submissions(completion_status);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submission_id ON survey_responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_order ON survey_responses(submission_id, response_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_survey_participants_updated_at
  BEFORE UPDATE ON survey_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_submissions_updated_at
  BEFORE UPDATE ON survey_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();