/*
  # Create lands and fraud_reports tables

  1. New Tables
    - `lands`
      - `id` (uuid, primary key) - Unique identifier for each land
      - `title` (text) - Name/title of the land
      - `location` (text) - Location of the land
      - `size` (text) - Size of the land (e.g., "10 acres")
      - `description` (text) - Description of the land
      - `owner_name` (text) - Name of the landowner
      - `image_url` (text, nullable) - Optional image URL
      - `created_at` (timestamptz) - Timestamp when land was added
    
    - `fraud_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `name` (text) - Name of person reporting
      - `issue` (text) - Brief issue title
      - `description` (text) - Detailed description of the issue
      - `created_at` (timestamptz) - Timestamp when report was submitted

  2. Security
    - Enable RLS on both tables
    - Allow public read access to lands (for farmers to view)
    - Allow public insert access to lands (for landowners to add)
    - Allow public insert access to fraud_reports (for users to report)
    - Allow public read access to fraud_reports (for admin to view)
*/

CREATE TABLE IF NOT EXISTS lands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  size text NOT NULL,
  description text NOT NULL DEFAULT '',
  owner_name text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fraud_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  issue text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lands ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to lands"
  ON lands FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to lands"
  ON lands FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to fraud reports"
  ON fraud_reports FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to fraud reports"
  ON fraud_reports FOR INSERT
  TO anon
  WITH CHECK (true);