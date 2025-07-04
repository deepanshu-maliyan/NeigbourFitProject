-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_results;
DROP TABLE IF EXISTS user_preferences;
DROP TABLE IF EXISTS neighborhoods;

-- Create neighborhoods table with India-specific metrics based on government data
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  pincode VARCHAR(10),
  -- Safety metrics (based on NCRB data, police station density)
  safety_score DECIMAL(3,1) NOT NULL,
  -- Affordability (based on property registration data, cost of living index)
  affordability_score DECIMAL(3,1) NOT NULL,
  -- Connectivity (based on road density, traffic index from government surveys)
  connectivity_score DECIMAL(3,1) NOT NULL,
  -- Metro/Public transport (based on distance to stations, frequency)
  metro_access_score DECIMAL(3,1) NOT NULL,
  -- Food culture (based on restaurant density, street food availability)
  food_culture_score DECIMAL(3,1) NOT NULL,
  -- Nightlife (based on commercial licenses, entertainment venues)
  nightlife_score DECIMAL(3,1) NOT NULL,
  -- Family friendly (based on school density, parks, child-friendly facilities)
  family_friendly_score DECIMAL(3,1) NOT NULL,
  -- Cultural diversity (based on census data on communities)
  cultural_diversity_score DECIMAL(3,1) NOT NULL,
  -- Green spaces (based on forest survey, park area per capita)
  green_spaces_score DECIMAL(3,1) NOT NULL,
  -- Job opportunities (based on employment data, business registrations)
  job_opportunities_score DECIMAL(3,1) NOT NULL,
  -- Healthcare (based on hospital density, doctor-patient ratio)
  healthcare_score DECIMAL(3,1) NOT NULL,
  -- Education (based on school density, literacy rates)
  education_score DECIMAL(3,1) NOT NULL,
  -- Shopping (based on market density, commercial establishments)
  shopping_score DECIMAL(3,1) NOT NULL,
  -- Additional government data fields
  population_density INTEGER,
  literacy_rate DECIMAL(5,2),
  avg_income INTEGER,
  air_quality_index INTEGER,
  description TEXT,
  image_url TEXT,
  data_sources TEXT, -- References to government data sources
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  safety_importance INTEGER NOT NULL DEFAULT 5,
  affordability_importance INTEGER NOT NULL DEFAULT 5,
  connectivity_importance INTEGER NOT NULL DEFAULT 5,
  metro_access_importance INTEGER NOT NULL DEFAULT 5,
  food_culture_importance INTEGER NOT NULL DEFAULT 5,
  nightlife_importance INTEGER NOT NULL DEFAULT 5,
  family_friendly_importance INTEGER NOT NULL DEFAULT 5,
  cultural_diversity_importance INTEGER NOT NULL DEFAULT 5,
  green_spaces_importance INTEGER NOT NULL DEFAULT 5,
  job_opportunities_importance INTEGER NOT NULL DEFAULT 5,
  healthcare_importance INTEGER NOT NULL DEFAULT 5,
  education_importance INTEGER NOT NULL DEFAULT 5,
  shopping_importance INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create user_results table
CREATE TABLE IF NOT EXISTS user_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  neighborhood_id INTEGER NOT NULL REFERENCES neighborhoods(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, neighborhood_id)
);

-- Create RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for user_results
CREATE POLICY "Users can view their own results"
  ON user_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results"
  ON user_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
