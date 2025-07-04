-- Clean up database by removing old/unwanted tables and ensuring clean schema

-- First, let's see what tables exist (this is just for reference)
-- You can run this separately to see current tables:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Drop any old tables that might exist from previous iterations
DROP TABLE IF EXISTS user_results CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE; 
DROP TABLE IF EXISTS neighborhoods CASCADE;

-- Drop any other tables that might have been created accidentally
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS neighborhood_reviews CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS quiz_responses CASCADE;
DROP TABLE IF EXISTS temp_neighborhoods CASCADE;
DROP TABLE IF EXISTS old_neighborhoods CASCADE;

-- Also clean up any views that might exist
DROP VIEW IF EXISTS neighborhood_stats CASCADE;
DROP VIEW IF EXISTS user_match_summary CASCADE;

-- Clean up any functions that might exist
DROP FUNCTION IF EXISTS calculate_match_score CASCADE;
DROP FUNCTION IF EXISTS get_user_recommendations CASCADE;

-- Clean up any triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- Now recreate our clean schema
-- Create neighborhoods table with government data structure
CREATE TABLE neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  pincode VARCHAR(10),
  -- Lifestyle scores (1-10 scale based on government data)
  safety_score DECIMAL(3,1) NOT NULL CHECK (safety_score >= 0 AND safety_score <= 10),
  affordability_score DECIMAL(3,1) NOT NULL CHECK (affordability_score >= 0 AND affordability_score <= 10),
  connectivity_score DECIMAL(3,1) NOT NULL CHECK (connectivity_score >= 0 AND connectivity_score <= 10),
  metro_access_score DECIMAL(3,1) NOT NULL CHECK (metro_access_score >= 0 AND metro_access_score <= 10),
  food_culture_score DECIMAL(3,1) NOT NULL CHECK (food_culture_score >= 0 AND food_culture_score <= 10),
  nightlife_score DECIMAL(3,1) NOT NULL CHECK (nightlife_score >= 0 AND nightlife_score <= 10),
  family_friendly_score DECIMAL(3,1) NOT NULL CHECK (family_friendly_score >= 0 AND family_friendly_score <= 10),
  cultural_diversity_score DECIMAL(3,1) NOT NULL CHECK (cultural_diversity_score >= 0 AND cultural_diversity_score <= 10),
  green_spaces_score DECIMAL(3,1) NOT NULL CHECK (green_spaces_score >= 0 AND green_spaces_score <= 10),
  job_opportunities_score DECIMAL(3,1) NOT NULL CHECK (job_opportunities_score >= 0 AND job_opportunities_score <= 10),
  healthcare_score DECIMAL(3,1) NOT NULL CHECK (healthcare_score >= 0 AND healthcare_score <= 10),
  education_score DECIMAL(3,1) NOT NULL CHECK (education_score >= 0 AND education_score <= 10),
  shopping_score DECIMAL(3,1) NOT NULL CHECK (shopping_score >= 0 AND shopping_score <= 10),
  -- Government data fields
  population_density INTEGER CHECK (population_density > 0),
  literacy_rate DECIMAL(5,2) CHECK (literacy_rate >= 0 AND literacy_rate <= 100),
  avg_income INTEGER CHECK (avg_income > 0),
  air_quality_index INTEGER CHECK (air_quality_index > 0),
  -- Metadata
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  data_sources TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Constraints
  UNIQUE(name, city, state)
);

-- Create user_preferences table
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Importance ratings (1-5 scale)
  safety_importance INTEGER NOT NULL DEFAULT 3 CHECK (safety_importance >= 1 AND safety_importance <= 5),
  affordability_importance INTEGER NOT NULL DEFAULT 3 CHECK (affordability_importance >= 1 AND affordability_importance <= 5),
  connectivity_importance INTEGER NOT NULL DEFAULT 3 CHECK (connectivity_importance >= 1 AND connectivity_importance <= 5),
  metro_access_importance INTEGER NOT NULL DEFAULT 3 CHECK (metro_access_importance >= 1 AND metro_access_importance <= 5),
  food_culture_importance INTEGER NOT NULL DEFAULT 3 CHECK (food_culture_importance >= 1 AND food_culture_importance <= 5),
  nightlife_importance INTEGER NOT NULL DEFAULT 3 CHECK (nightlife_importance >= 1 AND nightlife_importance <= 5),
  family_friendly_importance INTEGER NOT NULL DEFAULT 3 CHECK (family_friendly_importance >= 1 AND family_friendly_importance <= 5),
  cultural_diversity_importance INTEGER NOT NULL DEFAULT 3 CHECK (cultural_diversity_importance >= 1 AND cultural_diversity_importance <= 5),
  green_spaces_importance INTEGER NOT NULL DEFAULT 3 CHECK (green_spaces_importance >= 1 AND green_spaces_importance <= 5),
  job_opportunities_importance INTEGER NOT NULL DEFAULT 3 CHECK (job_opportunities_importance >= 1 AND job_opportunities_importance <= 5),
  healthcare_importance INTEGER NOT NULL DEFAULT 3 CHECK (healthcare_importance >= 1 AND healthcare_importance <= 5),
  education_importance INTEGER NOT NULL DEFAULT 3 CHECK (education_importance >= 1 AND education_importance <= 5),
  shopping_importance INTEGER NOT NULL DEFAULT 3 CHECK (shopping_importance >= 1 AND shopping_importance <= 5),
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Constraints
  UNIQUE(user_id)
);

-- Create user_results table
CREATE TABLE user_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  neighborhood_id INTEGER NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  -- Constraints
  UNIQUE(user_id, neighborhood_id)
);

-- Create indexes for better performance
CREATE INDEX idx_neighborhoods_city_state ON neighborhoods(city, state);
CREATE INDEX idx_neighborhoods_scores ON neighborhoods(safety_score, affordability_score, job_opportunities_score);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_results_user_id ON user_results(user_id);
CREATE INDEX idx_user_results_match_score ON user_results(match_score DESC);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for user_results
CREATE POLICY "Users can view their own results"
  ON user_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
  ON user_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own results"
  ON user_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own results"
  ON user_results FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public read access to neighborhoods table
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view neighborhoods"
  ON neighborhoods FOR SELECT
  TO public
  USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_neighborhoods_updated_at 
    BEFORE UPDATE ON neighborhoods 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables for documentation
COMMENT ON TABLE neighborhoods IS 'Stores neighborhood data with government-sourced metrics and scores';
COMMENT ON TABLE user_preferences IS 'Stores user lifestyle preferences and importance ratings';
COMMENT ON TABLE user_results IS 'Stores calculated match scores between users and neighborhoods';

-- Add comments to important columns
COMMENT ON COLUMN neighborhoods.data_sources IS 'References to government data sources used for scoring';
COMMENT ON COLUMN neighborhoods.population_density IS 'Population per square kilometer from census data';
COMMENT ON COLUMN neighborhoods.literacy_rate IS 'Literacy percentage from government education data';
COMMENT ON COLUMN neighborhoods.avg_income IS 'Average monthly income in INR from survey data';
COMMENT ON COLUMN neighborhoods.air_quality_index IS 'Air Quality Index from pollution control boards';
