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
   */
  const results: Omit<UserResult, "id" | "created_at">[] = neighborhoods.map((neighborhood) => {
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
      match_score: Number.parseFloat(matchScore.toFixed(2)),
    }
  })

  // Clear existing results for this user to prevent duplicates
  await supabase.from("user_results").delete().eq("user_id", userId)

  // Insert new calculated results
  const { data, error } = await supabase.from("user_results").insert(results).select()

  if (error) {
    console.error("Error saving match results:", error)
    return []
  }

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
