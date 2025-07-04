# Neighborhood Matching Algorithm

## Overview

The NeighborFit matching algorithm uses a direct scoring system to match users with neighborhoods based on 13 lifestyle factors. Each neighborhood has pre-calculated scores for these factors, which are weighted according to user preferences.

## Matching Process

1. **User Preferences Collection**
   - Users rate importance of 13 factors on a 1-5 scale
   - Preferences are stored in `user_preferences` table
   - Each rating represents how important that factor is to the user

2. **Neighborhood Data**
   - Each neighborhood has 13 pre-scored metrics (0-10 scale)
   - Scores based on government data and municipal statistics
   - Stored in `neighborhoods` table

3. **Scoring System**
   ```typescript
   // For each factor:
   const factorScore = neighborhood.factor_score * (user.factor_importance / 5)
   
   // Total importance for normalization
   const totalImportance = sum(all_factor_importances)
   
   // Final score calculation
   const matchScore = (sum(all_factor_scores) / totalImportance) * 10
   ```

## Actual Code Implementation

The matching algorithm is implemented in `lib/database.ts`. Here's the core calculation function:

```typescript
// Calculate and save neighborhood matches for a user
export async function calculateAndSaveMatches(userId: string): Promise<UserResult[]> {
  const supabase = createClient()

  // Get user preferences - required for calculation
  const preferences = await getUserPreferences(userId)
  if (!preferences) {
    console.error("No preferences found for user")
    return []
  }

  // Get all neighborhoods to calculate matches against
  const neighborhoods = await getNeighborhoods()
  if (neighborhoods.length === 0) {
    console.error("No neighborhoods found")
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