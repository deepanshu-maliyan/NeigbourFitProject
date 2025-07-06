/**
 * Database Operations and Business Logic
 *
 * This module contains all database operations for the NeighborFit application,
 * including neighborhood data retrieval, user preference management, and the
 * core matching algorithm that calculates compatibility scores.
 *
 * All functions in this module are server-side only and use Row Level Security (RLS)
 * to ensure users can only access their own data.
 *
 * @fileoverview Database operations and matching algorithm
 * @author NeighborFit Team
 * @version 1.0.0
 */

"use server"

import { createClient } from "@/lib/supabase/server"
import type { UserPreferences, UserResult, Neighborhood } from "@/types"

// Get all neighborhoods
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const supabase = createClient()
  console.log("Fetching neighborhoods...")

  try {
    // Query all neighborhoods ordered by name for consistent results
    const { data, error } = await supabase.from("neighborhoods").select("*").order("name")

    if (error) {
      console.error("Error fetching neighborhoods:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return []
    }

    console.log("Neighborhoods data:", {
      count: data?.length || 0,
      firstRecord: data?.[0] ? { 
        id: data[0].id,
        name: data[0].name,
        city: data[0].city
      } : null
    })
    return data || []
  } catch (error) {
    console.error("Unexpected error fetching neighborhoods:", error)
    return []
  }
}

// Get a specific neighborhood by ID
export async function getNeighborhood(id: number): Promise<Neighborhood | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("neighborhoods").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching neighborhood ${id}:`, error)
    return null
  }

  return data
}

// Get user preferences
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).single()

  // PGRST116 is "not found" error, which is expected for new users
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user preferences:", error)
    return null
  }

  return data || null
}

// Save user preferences
export async function saveUserPreferences(preferences: UserPreferences): Promise<UserPreferences | null> {
  const supabase = createClient()

  // Check if preferences already exist for this user
  const { data: existingData } = await supabase
    .from("user_preferences")
    .select("id")
    .eq("user_id", preferences.user_id)
    .single()

  let result

  if (existingData) {
    // Update existing preferences
    result = await supabase
      .from("user_preferences")
      .update({
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingData.id)
      .select()
      .single()
  } else {
    // Insert new preferences
    result = await supabase.from("user_preferences").insert(preferences).select().single()
  }

  if (result.error) {
    console.error("Error saving user preferences:", result.error)
    return null
  }

  return result.data
}

// Calculate and save neighborhood matches for a user
export async function calculateAndSaveMatches(userId: string): Promise<UserResult[]> {
  const supabase = createClient()

  // Get user preferences - required for calculation
  const preferences = await getUserPreferences(userId)
  if (!preferences) {
    console.error("No preferences found for user")
    return []
  }

  console.log("Calculating matches for user with preferences:", {
    userId,
    hasPreferences: !!preferences
  })

  // Get all neighborhoods to calculate matches against
  const neighborhoods = await getNeighborhoods()
  if (neighborhoods.length === 0) {
    console.error("No neighborhoods found")
    return []
  }

  /**
   * Calculate match scores using weighted preference algorithm
   *
   * Each neighborhood gets a compatibility score based on how well its
   * characteristics match the user's stated preferences and priorities.
   * 
   * Improved algorithm that produces more meaningful percentages (40-95% range)
   */
  const results: Omit<UserResult, "id" | "created_at">[] = neighborhoods.map((neighborhood) => {
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

    // Calculate weighted scores (score * importance)
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

    // Calculate match percentage (0-100)
    // Add base score to ensure minimum meaningful percentages
    const baseScore = 40 // Minimum match percentage
    const variableScore = 55 // Maximum additional score (40 + 55 = 95% max)
    
    let matchScore = baseScore
    if (totalImportanceWeight > 0) {
      const normalizedMatch = totalWeightedScore / totalImportanceWeight
      matchScore = baseScore + (normalizedMatch * variableScore)
    }

    // Ensure score is within bounds and add some randomization for similar scores
    const finalScore = Math.min(Math.max(matchScore, baseScore), baseScore + variableScore)
    
    return {
      user_id: userId,
      neighborhood_id: neighborhood.id,
      match_score: Number.parseFloat(finalScore.toFixed(1)),
    }
  })

  // Sort results by match score (descending) to get best matches first
  results.sort((a, b) => b.match_score - a.match_score)

  console.log("Initial match scores (before enhancement):", {
    count: results.length,
    top5: results.slice(0, 5).map(r => ({ id: r.neighborhood_id, score: r.match_score })),
    scoreRange: { 
      min: Math.min(...results.map(r => r.match_score)),
      max: Math.max(...results.map(r => r.match_score))
    }
  })

  // Enhance score distribution to make top matches more appealing
  const enhancedResults = results.map((result, index) => {
    let enhancedScore = result.match_score
    
    // Boost top 10 matches to make them more attractive
    if (index < 10) {
      const boost = (10 - index) * 2 // 2-20% boost for top 10
      enhancedScore = Math.min(enhancedScore + boost, 95)
    }
    
    // Add slight variations to prevent too many identical scores
    const variation = (Math.random() - 0.5) * 2 // ±1% variation
    enhancedScore = Math.max(40, Math.min(95, enhancedScore + variation))
    
    return {
      ...result,
      match_score: Number.parseFloat(enhancedScore.toFixed(1)),
    }
  })

  console.log("Enhanced match scores:", {
    count: enhancedResults.length,
    top5: enhancedResults.slice(0, 5).map(r => ({ id: r.neighborhood_id, score: r.match_score })),
    scoreRange: { 
      min: Math.min(...enhancedResults.map(r => r.match_score)),
      max: Math.max(...enhancedResults.map(r => r.match_score))
    }
  })

  // Clear existing results for this user to prevent duplicates
  console.log("Deleting existing results for user:", userId)
  const { error: deleteError } = await supabase.from("user_results").delete().eq("user_id", userId)
  
  if (deleteError) {
    console.error("Error deleting existing results:", deleteError)
    // Continue anyway - upsert should handle conflicts
  } else {
    console.log("Successfully deleted existing results")
  }

  // Use upsert to handle potential conflicts more gracefully
  console.log("Inserting new results for user:", userId, "results count:", enhancedResults.length)
  const { data, error } = await supabase
    .from("user_results")
    .upsert(enhancedResults, { 
      onConflict: 'user_id,neighborhood_id',
      ignoreDuplicates: false 
    })
    .select()

  if (error) {
    console.error("Error saving match results:", error)
    // Try simple insert as fallback
    console.log("Trying fallback insert...")
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("user_results")
      .insert(enhancedResults)
      .select()
    
    if (fallbackError) {
      console.error("Fallback insert also failed:", fallbackError)
      return []
    }
    
    console.log("Fallback insert succeeded")
    return fallbackData || []
  }

  console.log("Successfully saved match results:", data?.length || 0, "records")
  return data || []
}

// Get user's neighborhood matches with neighborhood details
export async function getUserMatches(userId: string): Promise<(UserResult & { neighborhood: Neighborhood })[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_results")
    .select(`
      *,
      neighborhood:neighborhoods(*)
    `)
    .eq("user_id", userId)
    .order("match_score", { ascending: false })

  if (error) {
    console.error("Error fetching user matches:", error)
    return []
  }

  return (data as (UserResult & { neighborhood: Neighborhood })[]) || []
}
