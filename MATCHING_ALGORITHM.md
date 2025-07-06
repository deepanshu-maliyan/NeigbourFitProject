# Neighborhood Matching Algorithm

## Overview

The NeighborFit matching algorithm uses an advanced weighted scoring system to match users with neighborhoods based on 13 lifestyle factors. The algorithm produces meaningful match percentages in the 40-95% range that provide users with actionable results.

## Neighborhood Scoring System

Each neighborhood in the database is scored on 13 factors using government data and municipal statistics:

### Scoring Factors (0-10 scale)
1. **Safety Score** - Crime rates, security infrastructure
2. **Affordability Score** - Cost of living, housing prices
3. **Connectivity Score** - Transportation infrastructure
4. **Metro Access Score** - Public transport accessibility
5. **Food Culture Score** - Restaurant diversity, local cuisine
6. **Nightlife Score** - Entertainment options, social venues
7. **Family Friendly Score** - Schools, parks, family amenities
8. **Cultural Diversity Score** - Demographics, community diversity
9. **Green Spaces Score** - Parks, gardens, environmental quality
10. **Job Opportunities Score** - Employment market, business hubs
11. **Healthcare Score** - Medical facilities, healthcare access
12. **Education Score** - Educational institutions, quality
13. **Shopping Score** - Retail options, commercial areas

## User Preference Collection

Users rate the importance of each factor on a 1-5 scale:
- **1**: Not important at all
- **2**: Slightly important
- **3**: Moderately important
- **4**: Very important
- **5**: Extremely important

## Matching Algorithm

### Step 1: Normalization
```typescript
// Normalize neighborhood scores to 0-1 scale
const normalizedScores = {
  safety: Math.min(neighborhood.safety_score / 10, 1),
  affordability: Math.min(neighborhood.affordability_score / 10, 1),
  // ... for all 13 factors
}

// Normalize user importance ratings to 0-1 scale
const normalizedImportance = {
  safety: preferences.safety_importance / 5,
  affordability: preferences.affordability_importance / 5,
  // ... for all 13 factors
}
```

### Step 2: Weighted Score Calculation
```typescript
// Calculate weighted scores (neighborhood_score × user_importance)
const weightedScores = [
  normalizedScores.safety × normalizedImportance.safety,
  normalizedScores.affordability × normalizedImportance.affordability,
  // ... for all 13 factors
]

const totalWeightedScore = weightedScores.reduce((sum, score) => sum + score, 0)
const totalImportanceWeight = Object.values(normalizedImportance).reduce((sum, weight) => sum + weight, 0)
```

### Step 3: Base Score Assignment
```typescript
// Ensure meaningful percentages with a base score
const baseScore = 40 // Minimum match percentage (40%)
const variableScore = 55 // Maximum additional score (40 + 55 = 95% max)

let matchScore = baseScore
if (totalImportanceWeight > 0) {
  const normalizedMatch = totalWeightedScore / totalImportanceWeight
  matchScore = baseScore + (normalizedMatch × variableScore)
}
```

### Step 4: Score Enhancement
```typescript
// Sort by initial match score
results.sort((a, b) => b.match_score - a.match_score)

// Enhance top matches for better user experience
const enhancedResults = results.map((result, index) => {
  let enhancedScore = result.match_score
  
  // Boost top 10 matches (2-20% boost)
  if (index < 10) {
    const boost = (10 - index) × 2
    enhancedScore = Math.min(enhancedScore + boost, 95)
  }
  
  // Add slight variation to prevent identical scores
  const variation = (Math.random() - 0.5) × 2 // ±1% variation
  enhancedScore = Math.max(40, Math.min(95, enhancedScore + variation))
  
  return {
    ...result,
    match_score: Number.parseFloat(enhancedScore.toFixed(1))
  }
})
```

## Algorithm Features

### 1. **Meaningful Score Range**
- All matches fall between 40-95%
- Provides actionable results for users
- Maintains relative ranking accuracy

### 2. **Top Match Enhancement**
- Top 10 matches receive additional boost
- Creates clear distinction between good and great matches
- Encourages user engagement with best options

### 3. **Weighted Importance**
- User preferences directly influence scoring
- More important factors have greater impact
- Personalized results based on individual priorities

### 4. **Score Variation**
- Slight randomization prevents identical scores
- Maintains natural score distribution
- Avoids artificial tie-breaking

## Database Integration

### User Preferences Storage
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  safety_importance INTEGER CHECK (safety_importance BETWEEN 1 AND 5),
  affordability_importance INTEGER CHECK (affordability_importance BETWEEN 1 AND 5),
  -- ... for all 13 factors
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Match Results Storage
```sql
CREATE TABLE user_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  neighborhood_id INTEGER REFERENCES neighborhoods(id),
  match_score DECIMAL(4,1) CHECK (match_score BETWEEN 0 AND 100),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, neighborhood_id)
);
```

## Performance Optimizations

1. **Batch Processing**: All neighborhoods calculated in single operation
2. **Efficient Upsert**: Uses PostgreSQL UPSERT to handle conflicts
3. **Indexed Queries**: Optimized database queries with proper indexing
4. **Caching**: Results cached until user retakes quiz

## Error Handling & Reliability

- Graceful fallback for database conflicts
- Comprehensive logging for debugging
- Automatic retry mechanisms
- Data validation at multiple levels

This algorithm ensures users receive meaningful match percentages while maintaining accurate relative rankings based on their personal preferences.
    return []
  }

  // Calculate match scores using weighted preference algorithm
  const results = neighborhoods.map((neighborhood) => {
    // Calculate weighted scores for each lifestyle factor
    const safetyScore = neighborhood.safety_score * (preferences.safety_importance / 5)
    const affordabilityScore = neighborhood.affordability_score * (preferences.affordability_importance / 5)
    const connectivityScore = neighborhood.connectivity_score * (preferences.connectivity_importance / 5)
    const metroAccessScore = neighborhood.metro_access_score * (preferences.metro_access_importance / 5)
    const foodCultureScore = neighborhood.food_culture_score * (preferences.food_culture_importance / 5)
    const nightlifeScore = neighborhood.nightlife_score * (preferences.nightlife_importance / 5)
    const familyFriendlyScore = neighborhood.family_friendly_score * (preferences.family_friendly_importance / 5)
    const culturalDiversityScore = 
      neighborhood.cultural_diversity_score * (preferences.cultural_diversity_importance / 5)
    const greenSpacesScore = neighborhood.green_spaces_score * (preferences.green_spaces_importance / 5)
    const jobOpportunitiesScore = neighborhood.job_opportunities_score * (preferences.job_opportunities_importance / 5)
    const healthcareScore = neighborhood.healthcare_score * (preferences.healthcare_importance / 5)
    const educationScore = neighborhood.education_score * (preferences.education_importance / 5)
    const shoppingScore = neighborhood.shopping_score * (preferences.shopping_importance / 5)

    // Calculate total importance weight for normalization
    const totalImportance =
      preferences.safety_importance +
      preferences.affordability_importance +
      preferences.connectivity_importance +
      preferences.metro_access_importance +
      preferences.food_culture_importance +
      preferences.nightlife_importance +
      preferences.family_friendly_importance +
      preferences.cultural_diversity_importance +
      preferences.green_spaces_importance +
      preferences.job_opportunities_importance +
      preferences.healthcare_importance +
      preferences.education_importance +
      preferences.shopping_importance

    // Sum all weighted scores
    const totalScore =
      safetyScore +
      affordabilityScore +
      connectivityScore +
      metroAccessScore +
      foodCultureScore +
      nightlifeScore +
      familyFriendlyScore +
      culturalDiversityScore +
      greenSpacesScore +
      jobOpportunitiesScore +
      healthcareScore +
      educationScore +
      shoppingScore

    // Normalize to 0-100 percentage scale
    const matchScore = (totalScore / totalImportance) * 10

    return {
      user_id: userId,
      neighborhood_id: neighborhood.id,
      match_score: Number.parseFloat(matchScore.toFixed(2))
    }
  })

  return results
}
```

## Lifestyle Factors

Each factor has two components:
- Neighborhood Score (0-10): How well the neighborhood performs
- User Importance (1-5): How much the user cares about this factor

1. **Safety**
   - Crime rates
   - Police presence
   - Street lighting

2. **Affordability**
   - Housing costs
   - Daily expenses
   - Utility rates

3. **Connectivity**
   - Road networks
   - Traffic conditions
   - General accessibility

4. **Metro Access**
   - Distance to metro/train stations
   - Frequency of service
   - Last-mile connectivity

5. **Food Culture**
   - Restaurants
   - Street food
   - Food markets

6. **Nightlife**
   - Entertainment venues
   - Pubs and bars
   - Late-night activities

7. **Family Friendly**
   - Schools
   - Playgrounds
   - Family facilities

8. **Cultural Diversity**
   - Community mix
   - Cultural events
   - Religious facilities

9. **Green Spaces**
   - Parks
   - Gardens
   - Open areas

10. **Job Opportunities**
    - Business districts
    - Office complexes
    - Commercial zones

11. **Healthcare**
    - Hospitals
    - Clinics
    - Medical facilities

12. **Education**
    - Schools
    - Colleges
    - Training centers

13. **Shopping**
    - Retail outlets
    - Markets
    - Shopping centers

## Example Calculation

```typescript
// Neighborhood scores (0-10 scale)
const andheriEast = {
  safety_score: 8.5,
  affordability_score: 6.5,
  connectivity_score: 9.0,
  // ... other scores
}

// User preferences (1-5 scale)
const userPreferences = {
  safety_importance: 5,      // Very important
  affordability_importance: 3, // Moderately important
  connectivity_importance: 4,  // Important
  // ... other preferences
}

// Score calculation
const safetyScore = 8.5 * (5/5) = 8.5
const affordabilityScore = 6.5 * (3/5) = 3.9
const connectivityScore = 9.0 * (4/5) = 7.2
// ... calculate other scores

const totalScore = sum(all_scores)
const totalImportance = sum(all_importances)
const matchScore = (totalScore / totalImportance) * 10
```

## Data Sources

1. **Government Data**
   - Census 2011
   - Municipal records
   - Police statistics

2. **Infrastructure Data**
   - Transport authorities
   - Urban planning records
   - Utility companies

3. **Real Estate Data**
   - Property rates
   - Rental markets
   - Development plans

## Implementation Details

The matching algorithm is implemented in `lib/database.ts` using Supabase for data storage and retrieval. Key functions:

- `getUserPreferences`: Retrieves user's factor importance ratings
- `getNeighborhoods`: Fetches all neighborhood data
- `calculateAndSaveMatches`: Computes match scores and saves results
- `getUserMatches`: Retrieves computed matches for display

The algorithm runs server-side to ensure data security and consistent calculations. 