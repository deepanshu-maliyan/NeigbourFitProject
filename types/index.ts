/**
 * Type Definitions for NeighborFit Application
 *
 * This file contains all TypeScript type definitions used throughout the application.
 * These types ensure type safety and provide clear contracts for data structures
 * used in database operations, API responses, and component props.
 *
 * @fileoverview Application-wide type definitions
 * @author NeighborFit Team
 * @version 1.0.0
 */

export interface Neighborhood {
  /** Unique identifier for the neighborhood */
  id: number

  /** Name of the neighborhood */
  name: string

  /** City where the neighborhood is located */
  city: string

  /** State where the neighborhood is located */
  state: string

  /** Postal code (optional, some areas may not have specific pincodes) */
  pincode?: string

  // Lifestyle Scores (1-10 scale based on government data and research)

  /** Safety rating based on crime statistics and police data (1-10) */
  safety_score: number

  /** Affordability rating based on property prices and cost of living (1-10) */
  affordability_score: number

  /** Overall connectivity rating including roads and traffic (1-10) */
  connectivity_score: number

  /** Metro and local train accessibility rating (1-10) */
  metro_access_score: number

  /** Food culture and dining options rating (1-10) */
  food_culture_score: number

  /** Nightlife and entertainment venues rating (1-10) */
  nightlife_score: number

  /** Family-friendly amenities and facilities rating (1-10) */
  family_friendly_score: number

  /** Cultural diversity and community variety rating (1-10) */
  cultural_diversity_score: number

  /** Green spaces, parks, and nature access rating (1-10) */
  green_spaces_score: number

  /** Job opportunities and employment prospects rating (1-10) */
  job_opportunities_score: number

  /** Healthcare facilities and medical services rating (1-10) */
  healthcare_score: number

  /** Educational institutions and schools rating (1-10) */
  education_score: number

  /** Shopping and retail availability rating (1-10) */
  shopping_score: number

  // Government Statistics (optional fields from official data sources)

  /** Population density per square kilometer (from Census data) */
  population_density?: number

  /** Literacy rate percentage (from Census data) */
  literacy_rate?: number

  /** Average monthly income in INR (from economic surveys) */
  avg_income?: number

  /** Air Quality Index (from pollution control boards) */
  air_quality_index?: number

  // Metadata

  /** Detailed description of the neighborhood */
  description?: string

  /** URL to representative image of the neighborhood */
  image_url?: string

  /** References to government data sources used for scoring */
  data_sources?: string

  /** Timestamp when the record was created */
  created_at: string
}

export interface UserPreferences {
  /** Auto-generated unique identifier (optional for new records) */
  id?: number

  /** UUID of the user from Supabase Auth */
  user_id: string

  // Importance Ratings (1-5 scale)
  // 1 = Not Important, 2 = Slightly Important, 3 = Moderately Important
  // 4 = Very Important, 5 = Extremely Important

  /** How important is neighborhood safety to the user */
  safety_importance: number

  /** How important is affordability and cost of living to the user */
  affordability_importance: number

  /** How important is overall connectivity and transportation to the user */
  connectivity_importance: number

  /** How important is metro/train access to the user */
  metro_access_importance: number

  /** How important is food culture and dining options to the user */
  food_culture_importance: number

  /** How important is nightlife and entertainment to the user */
  nightlife_importance: number

  /** How important are family-friendly amenities to the user */
  family_friendly_importance: number

  /** How important is cultural diversity to the user */
  cultural_diversity_importance: number

  /** How important are green spaces and nature access to the user */
  green_spaces_importance: number

  /** How important are job opportunities to the user */
  job_opportunities_importance: number

  /** How important is healthcare access to the user */
  healthcare_importance: number

  /** How important is education access to the user */
  education_importance: number

  /** How important is shopping and retail access to the user */
  shopping_importance: number

  /** Timestamp when preferences were created (optional) */
  created_at?: string

  /** Timestamp when preferences were last updated (optional) */
  updated_at?: string
}

export interface UserResult {
  /** Unique identifier for this match result */
  id: number

  /** UUID of the user this result belongs to */
  user_id: string

  /** ID of the neighborhood this result is for */
  neighborhood_id: number

  /** Calculated compatibility score (0-100 percentage) */
  match_score: number

  /** Timestamp when this result was calculated */
  created_at: string

  /** Optional: Full neighborhood data when joined in queries */
  neighborhood?: Neighborhood
}

export interface QuizQuestion {
  /** Unique identifier for the question */
  id: string

  /** The main question text displayed to the user */
  question: string

  /** Optional additional description or context for the question */
  description?: string

  /** Array of answer options with values and labels */
  options: {
    /** Numeric value (1-5) representing importance level */
    value: number

    /** Display label for this option */
    label: string

    /** Optional additional description for this option */
    description?: string
  }[]

  /**
   * The UserPreferences field this question maps to
   * Must be a valid key from UserPreferences (excluding metadata fields)
   */
  preference: keyof Omit<UserPreferences, "id" | "user_id" | "created_at" | "updated_at">
}

/**
 * Type guard to check if a value is a valid Neighborhood
 *
 * @param value - Value to check
 * @returns True if value is a valid Neighborhood object
 *
 * @example
 * if (isNeighborhood(data)) {
 *   console.log(`Valid neighborhood: ${data.name}`)
 * }
 */
export function isNeighborhood(value: any): value is Neighborhood {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "number" &&
    typeof value.name === "string" &&
    typeof value.city === "string" &&
    typeof value.state === "string" &&
    typeof value.safety_score === "number" &&
    typeof value.affordability_score === "number"
    // Add more checks as needed
  )
}

/**
 * Type guard to check if a value is valid UserPreferences
 *
 * @param value - Value to check
 * @returns True if value is a valid UserPreferences object
 */
export function isUserPreferences(value: any): value is UserPreferences {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.user_id === "string" &&
    typeof value.safety_importance === "number" &&
    value.safety_importance >= 1 &&
    value.safety_importance <= 5
    // Add more validation as needed
  )
}

/**
 * Utility type for creating new neighborhoods (without auto-generated fields)
 */
export type NewNeighborhood = Omit<Neighborhood, "id" | "created_at">

/**
 * Utility type for updating neighborhoods (all fields optional except id)
 */
export type UpdateNeighborhood = Partial<Neighborhood> & { id: number }

/**
 * Utility type for user preferences without metadata
 */
export type PreferencesInput = Omit<UserPreferences, "id" | "created_at" | "updated_at">

/**
 * Utility type for match results with neighborhood data included
 */
export type MatchWithNeighborhood = UserResult & { neighborhood: Neighborhood }
