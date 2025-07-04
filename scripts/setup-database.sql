-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  safety_score DECIMAL(3,1) NOT NULL,
  affordability_score DECIMAL(3,1) NOT NULL,
  connectivity_score DECIMAL(3,1) NOT NULL,
  metro_access_score DECIMAL(3,1) NOT NULL,
  food_culture_score DECIMAL(3,1) NOT NULL,
  nightlife_score DECIMAL(3,1) NOT NULL,
  family_friendly_score DECIMAL(3,1) NOT NULL,
  cultural_diversity_score DECIMAL(3,1) NOT NULL,
  green_spaces_score DECIMAL(3,1) NOT NULL,
  job_opportunities_score DECIMAL(3,1) NOT NULL,
  healthcare_score DECIMAL(3,1) NOT NULL,
  education_score DECIMAL(3,1) NOT NULL,
  shopping_score DECIMAL(3,1) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT neighborhoods_pkey PRIMARY KEY (id)
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
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
  CONSTRAINT user_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_preferences_user_id_key UNIQUE (user_id)
);

-- Create user_results table
CREATE TABLE IF NOT EXISTS user_results (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  neighborhood_id INTEGER NOT NULL,
  match_score DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_results_pkey PRIMARY KEY (id),
  CONSTRAINT user_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_results_neighborhood_id_fkey FOREIGN KEY (neighborhood_id) REFERENCES neighborhoods(id)
);

-- Create RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

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

-- Create policies for neighborhoods
CREATE POLICY "Anyone can view neighborhoods"
  ON neighborhoods FOR SELECT
  USING (true);
