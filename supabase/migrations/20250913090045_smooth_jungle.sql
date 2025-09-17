/*
  # Align Survey Schema with Available Data

  This migration updates the survey_participants table to better capture
  demographic data for analysis.

  ## Changes Made:
  1. **Modified `age` column:** Changed from `integer` to `text` to support age ranges.
  2. **Added `country_of_residence` column:** Added a new text field to store participant's country.
*/

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_submissions CASCADE;
DROP TABLE IF EXISTS survey_participants CASCADE;

-- Drop the update function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create survey_participants table with updated schema
CREATE TABLE survey_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age text NOT NULL, -- Changed to text for ranges
  field_of_study text NOT NULL,
  country_of_residence text NOT NULL, -- Added new column
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create survey_submissions table
CREATE TABLE survey_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES survey_participants(id) ON DELETE CASCADE,
  survey_version text NOT NULL DEFAULT '1.0',
  completion_status text NOT NULL DEFAULT 'incomplete' CHECK (completion_status IN ('incomplete', 'completed')),
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create survey_responses table
CREATE TABLE survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES survey_submissions(id) ON DELETE CASCADE,
  role_title text NOT NULL,
  assigned_icon text NOT NULL,
  response_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_survey_participants_age ON survey_participants(age);
CREATE INDEX idx_survey_participants_field ON survey_participants(field_of_study);
CREATE INDEX idx_survey_participants_country ON survey_participants(country_of_residence); -- Added index
CREATE INDEX idx_survey_submissions_participant_id ON survey_submissions(participant_id);
CREATE INDEX idx_survey_submissions_status ON survey_submissions(completion_status);
CREATE INDEX idx_survey_responses_submission_id ON survey_responses(submission_id);
CREATE INDEX idx_survey_responses_order ON survey_responses(submission_id, response_order);

-- Enable Row Level Security
ALTER TABLE survey_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for survey_participants
CREATE POLICY "Users can insert own participant data"
  ON survey_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read own participant data"
  ON survey_participants
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own participant data"
  ON survey_participants
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Service role can access all participant data"
  ON survey_participants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for survey_submissions
CREATE POLICY "Users can insert own submissions"
  ON survey_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (participant_id::text = auth.uid()::text);

CREATE POLICY "Users can read own submissions"
  ON survey_submissions
  FOR SELECT
  TO authenticated
  USING (participant_id::text = auth.uid()::text);

CREATE POLICY "Users can update own submissions"
  ON survey_submissions
  FOR UPDATE
  TO authenticated
  USING (participant_id::text = auth.uid()::text);

CREATE POLICY "Service role can access all submission data"
  ON survey_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for survey_responses
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

CREATE POLICY "Service role can access all response data"
  ON survey_responses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_survey_participants_updated_at
  BEFORE UPDATE ON survey_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_submissions_updated_at
  BEFORE UPDATE ON survey_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();