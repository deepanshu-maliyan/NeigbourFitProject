/**
 * Script to recalculate all user matches with the improved algorithm
 * 
 * This script will:
 * 1. Find all users who have taken the quiz
 * 2. Recalculate their matches using the improved algorithm
 * 3. Update the database with the new scores
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function recalculateAllMatches() {
  try {
    console.log('🔄 Starting to recalculate all user matches...')

    // Get all users who have preferences (i.e., have taken the quiz)
    const { data: users, error: usersError } = await supabase
      .from('user_preferences')
      .select('user_id')

    if (usersError) {
      throw usersError
    }

    if (!users || users.length === 0) {
      console.log('No users found with preferences')
      return
    }

    console.log(`Found ${users.length} users with preferences`)

    // Delete all existing results first
    console.log('🗑️ Clearing all existing match results...')
    const { error: clearError } = await supabase
      .from('user_results')
      .delete()
      .neq('id', 0) // Delete all records

    if (clearError) {
      console.error('Error clearing results:', clearError)
    } else {
      console.log('✅ All existing results cleared')
    }

    // Recalculate for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      console.log(`\n📊 Recalculating matches for user ${i + 1}/${users.length}: ${user.user_id}`)

      try {
        // We need to implement the calculation logic here since we can't import server functions
        await recalculateUserMatches(user.user_id)
        console.log(`✅ Successfully recalculated matches for user ${user.user_id}`)
      } catch (error) {
        console.error(`❌ Error recalculating matches for user ${user.user_id}:`, error.message)
      }
    }

    console.log('\n🎉 Finished recalculating all user matches!')

  } catch (error) {
    console.error('❌ Error in recalculateAllMatches:', error)
  }
}

async function recalculateUserMatches(userId) {
  // Get user preferences
  const { data: preferences, error: prefsError } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (prefsError || !preferences) {
    throw new Error(`Could not fetch preferences: ${prefsError?.message || 'No preferences found'}`)
  }

  // Get all neighborhoods
  const { data: neighborhoods, error: neighborhoodsError } = await supabase
    .from('neighborhoods')
    .select('*')

  if (neighborhoodsError || !neighborhoods || neighborhoods.length === 0) {
    throw new Error(`Could not fetch neighborhoods: ${neighborhoodsError?.message || 'No neighborhoods found'}`)
  }

  // Calculate matches using the improved algorithm
  const results = neighborhoods.map((neighborhood) => {
    // Normalize neighborhood scores to 0-1 scale (from 0-10 scale)
    const normalizedScores = {
      safety: Math.min(neighborhood.safety_score / 10, 1),
      affordability: Math.min(neighborhood.affordability_score / 10, 1),
      connectivity: Math.min(neighborhood.connectivity_score / 10, 1),
      metro_access: Math.min(neighborhood.metro_access_score / 10, 1),
      food_culture: Math.min(neighborhood.food_culture_score / 10, 1),
      nightlife: Math.min(neighborhood.nightlife_score / 10, 1),
      family_friendly: Math.min(neighborhood.family_friendly_score / 10, 1),
      cultural_diversity: Math.min(neighborhood.cultural_diversity_score / 10, 1),
      green_spaces: Math.min(neighborhood.green_spaces_score / 10, 1),
      job_opportunities: Math.min(neighborhood.job_opportunities_score / 10, 1),
      healthcare: Math.min(neighborhood.healthcare_score / 10, 1),
      education: Math.min(neighborhood.education_score / 10, 1),
      shopping: Math.min(neighborhood.shopping_score / 10, 1),
    }

    // Normalize importance weights to 0-1 scale (from 1-5 scale)
    const normalizedImportance = {
      safety: preferences.safety_importance / 5,
      affordability: preferences.affordability_importance / 5,
      connectivity: preferences.connectivity_importance / 5,
      metro_access: preferences.metro_access_importance / 5,
      food_culture: preferences.food_culture_importance / 5,
      nightlife: preferences.nightlife_importance / 5,
      family_friendly: preferences.family_friendly_importance / 5,
      cultural_diversity: preferences.cultural_diversity_importance / 5,
      green_spaces: preferences.green_spaces_importance / 5,
      job_opportunities: preferences.job_opportunities_importance / 5,
      healthcare: preferences.healthcare_importance / 5,
      education: preferences.education_importance / 5,
      shopping: preferences.shopping_importance / 5,
    }

    // Calculate weighted scores
    const weightedScores = [
      normalizedScores.safety * normalizedImportance.safety,
      normalizedScores.affordability * normalizedImportance.affordability,
      normalizedScores.connectivity * normalizedImportance.connectivity,
      normalizedScores.metro_access * normalizedImportance.metro_access,
      normalizedScores.food_culture * normalizedImportance.food_culture,
      normalizedScores.nightlife * normalizedImportance.nightlife,
      normalizedScores.family_friendly * normalizedImportance.family_friendly,
      normalizedScores.cultural_diversity * normalizedImportance.cultural_diversity,
      normalizedScores.green_spaces * normalizedImportance.green_spaces,
      normalizedScores.job_opportunities * normalizedImportance.job_opportunities,
      normalizedScores.healthcare * normalizedImportance.healthcare,
      normalizedScores.education * normalizedImportance.education,
      normalizedScores.shopping * normalizedImportance.shopping,
    ]

    // Calculate total weighted score
    const totalWeightedScore = weightedScores.reduce((sum, score) => sum + score, 0)
    
    // Calculate total importance weight
    const totalImportanceWeight = Object.values(normalizedImportance).reduce((sum, weight) => sum + weight, 0)

    // Calculate match percentage (40-95% range)
    const baseScore = 40
    const variableScore = 55
    
    let matchScore = baseScore
    if (totalImportanceWeight > 0) {
      const normalizedMatch = totalWeightedScore / totalImportanceWeight
      matchScore = baseScore + (normalizedMatch * variableScore)
    }

    const finalScore = Math.min(Math.max(matchScore, baseScore), baseScore + variableScore)
    
    return {
      user_id: userId,
      neighborhood_id: neighborhood.id,
      match_score: Number.parseFloat(finalScore.toFixed(1)),
    }
  })

  // Sort by score
  results.sort((a, b) => b.match_score - a.match_score)

  // Enhance top matches
  const enhancedResults = results.map((result, index) => {
    let enhancedScore = result.match_score
    
    if (index < 10) {
      const boost = (10 - index) * 2
      enhancedScore = Math.min(enhancedScore + boost, 95)
    }
    
    const variation = (Math.random() - 0.5) * 2
    enhancedScore = Math.max(40, Math.min(95, enhancedScore + variation))
    
    return {
      ...result,
      match_score: Number.parseFloat(enhancedScore.toFixed(1)),
    }
  })

  console.log(`Calculated ${enhancedResults.length} matches with scores ranging from ${Math.min(...enhancedResults.map(r => r.match_score))} to ${Math.max(...enhancedResults.map(r => r.match_score))}`)

  // Insert the results
  const { data, error } = await supabase
    .from('user_results')
    .insert(enhancedResults)

  if (error) {
    throw new Error(`Failed to insert results: ${error.message}`)
  }

  return enhancedResults
}

// Run the script
recalculateAllMatches().then(() => {
  console.log('Script completed')
  process.exit(0)
}).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
