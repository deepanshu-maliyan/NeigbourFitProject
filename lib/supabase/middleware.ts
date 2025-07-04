/**
 * Supabase Middleware for Authentication and Session Management
 *
 * This middleware handles:
 * - Authentication state management across requests
 * - Session refresh for expired tokens
 * - Protected route access control
 * - OAuth callback handling
 * - Cookie-based session persistence
 *
 * The middleware runs on every request and ensures that authentication
 * state is properly maintained throughout the application.
 *
 * @fileoverview Supabase authentication middleware
 * @author NeighborFit Team
 * @version 1.0.0
 */

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Validates if Supabase environment variables are properly configured
 *
 * @returns {boolean} True if Supabase is properly configured
 */
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

/**
 * Updates user session and handles authentication flow
 *
 * This function processes each request to:
 * 1. Check for OAuth callback codes and exchange them for sessions
 * 2. Refresh expired authentication tokens
 * 3. Protect routes that require authentication
 * 4. Allow public access to authentication pages
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} Modified response with updated session
 *
 * @example
 * // This function is called automatically by Next.js middleware
 * // Configuration in middleware.ts:
 *
 * import { updateSession } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs#middleware} Middleware Guide
 */
export async function updateSession(request: NextRequest) {
  // Skip authentication if Supabase is not configured
  // This allows the app to run during initial setup
  if (!isSupabaseConfigured) {
    return NextResponse.next({
      request,
    })
  }

  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  // This client can read and write authentication cookies
  const supabase = createMiddlewareClient({ req: request, res })

  // Extract URL components for processing
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  /**
   * Handle OAuth callback
   *
   * When users complete OAuth flow (Google, GitHub, etc.), they're redirected
   * back with a 'code' parameter that needs to be exchanged for a session.
   */
  if (code) {
    // Exchange the OAuth code for a user session
    await supabase.auth.exchangeCodeForSession(code)

    // Redirect to home page after successful authentication
    // This prevents the code from being visible in the URL
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Refresh the session if it exists
  // This ensures that expired tokens are automatically renewed
  await supabase.auth.getSession()

  /**
   * Route Protection Logic
   *
   * Define which routes require authentication and handle redirects
   */

  // Define public authentication routes that don't require login
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/auth/login") ||
    request.nextUrl.pathname.startsWith("/auth/sign-up") ||
    request.nextUrl.pathname === "/auth/callback"

  // Skip authentication check for public auth routes
  if (!isAuthRoute) {
    // Get the current session to check authentication status
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Redirect unauthenticated users to login page
    if (!session) {
      const redirectUrl = new URL("/auth/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Return the response with updated session cookies
  return res
}
