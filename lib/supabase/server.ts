/**
 * Supabase Server Configuration for Server Components and API Routes
 *
 * This module provides server-side Supabase client creation with proper cookie handling
 * for authentication state management in Next.js App Router.
 *
 * @fileoverview Server-side Supabase configuration and client creation
 * @author NeighborFit Team
 * @version 1.0.0
 */

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

/**
 * Validates if Supabase environment variables are properly configured for server-side usage
 *
 * Checks for the presence and validity of required Supabase environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: The Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: The Supabase anonymous/public API key
 * - SUPABASE_SERVICE_ROLE_KEY: The Supabase service role key (optional, for admin operations)
 *
 * @returns {boolean} True if all required environment variables are present and valid
 */
export const isSupabaseConfigured = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("Checking Supabase configuration:", {
      url: url ? "Set" : "Missing",
      key: key ? "Set" : "Missing",
      urlLength: url?.length || 0,
      keyLength: key?.length || 0
    })

    return typeof url === "string" && url.length > 0 && typeof key === "string" && key.length > 0
  } catch (error) {
    console.warn("Error checking Supabase server configuration:", error)
    return false
  }
})()

/**
 * Creates a Supabase client for Server Components and API Routes
 *
 * This function creates a server-side Supabase client that:
 * - Reads authentication state from cookies
 * - Maintains user sessions across requests
 * - Provides access to authenticated user data
 * - Supports Row Level Security (RLS) policies
 *
 * Usage in Server Components:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 *
 * export default async function Page() {
 *   const supabase = createClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 *   if (!user) {
 *     redirect('/auth/login')
 *   }
 *
 *   return <div>Hello {user.email}</div>
 * }
 * ```
 *
 * Usage in API Routes:
 * ```typescript
 * import { createClient } from '@/lib/supabase/server'
 * import { NextResponse } from 'next/server'
 *
 * export async function GET() {
 *   const supabase = createClient()
 *   const { data, error } = await supabase.from('neighborhoods').select('*')
 *
 *   if (error) {
 *     return NextResponse.json({ error: error.message }, { status: 500 })
 *   }
 *
 *   return NextResponse.json(data)
 * }
 * ```
 *
 * @returns {SupabaseClient} Server-side Supabase client instance
 * @throws {Error} If Supabase is not properly configured
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs} Supabase Auth Helpers
 * @see {@link https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations} Server Actions
 */
export function createClient() {
  try {
    if (!isSupabaseConfigured) {
      console.error("Supabase configuration error:", {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"
      })
      throw new Error(
        "Supabase is not configured. Please check your environment variables:\n" +
          "- NEXT_PUBLIC_SUPABASE_URL\n" +
          "- NEXT_PUBLIC_SUPABASE_ANON_KEY",
      )
    }

    const cookieStore = cookies()
    const client = createServerComponentClient({ cookies: () => cookieStore })
    console.log("Supabase client created successfully")
    return client
  } catch (error) {
    console.error("Error creating Supabase server client:", error)
    throw error
  }
}

/**
 * Type definition for the server-side Supabase client
 *
 * This type can be used for type safety when passing the client around:
 * ```typescript
 * import type { ServerSupabaseClient } from '@/lib/supabase/server'
 *
 * async function fetchUserData(supabase: ServerSupabaseClient) {
 *   return await supabase.auth.getUser()
 * }
 * ```
 */
export type ServerSupabaseClient = ReturnType<typeof createClient>
