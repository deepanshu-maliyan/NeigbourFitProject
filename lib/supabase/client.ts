"use client"

/**
 * Supabase Client Configuration for Client Components
 *
 * This module provides a singleton Supabase client instance for use in React Client Components.
 * It includes configuration validation and error handling for missing environment variables.
 *
 * @fileoverview Client-side Supabase configuration and client creation
 * @author NeighborFit Team
 * @version 1.0.0
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

/**
 * Validates if Supabase environment variables are properly configured
 *
 * Checks for the presence and validity of required Supabase environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: The Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: The Supabase anonymous/public API key
 *
 * @returns {boolean} True if all required environment variables are present and valid
 */
export const isSupabaseConfigured = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    return typeof url === "string" && url.length > 0 && typeof key === "string" && key.length > 0
  } catch (error) {
    console.warn("Error checking Supabase configuration:", error)
    return false
  }
})()

/**
 * Creates a Supabase client instance for Client Components
 *
 * This function safely creates a Supabase client with proper error handling.
 * If environment variables are not configured, it returns null.
 *
 * @returns {SupabaseClient | null} Supabase client instance or null if not configured
 */
export function createClient() {
  try {
    if (!isSupabaseConfigured) {
      console.warn("Supabase is not properly configured")
      return null
    }
    return createClientComponentClient()
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

/**
 * Singleton Supabase client instance for Client Components
 *
 * This client is configured to work with React Client Components and includes:
 * - Automatic session management
 * - Cookie-based authentication state persistence
 * - Real-time subscriptions support
 * - Automatic token refresh
 *
 * Usage:
 * ```typescript
 * import { supabase } from '@/lib/supabase/client'
 *
 * // In a Client Component
 * if (supabase) {
 *   const { data, error } = await supabase.from('neighborhoods').select('*')
 * }
 * ```
 *
 * @example
 * // Fetching data in a Client Component
 * const [neighborhoods, setNeighborhoods] = useState([])
 *
 * useEffect(() => {
 *   async function fetchData() {
 *     if (!supabase) return
 *     const { data } = await supabase.from('neighborhoods').select('*')
 *     setNeighborhoods(data || [])
 *   }
 *   fetchData()
 * }, [])
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs} Supabase Auth Helpers
 */
export const supabase = createClient()
