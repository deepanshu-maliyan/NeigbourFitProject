/**
 * Server Actions for Authentication
 *
 * This module contains Next.js Server Actions for handling user authentication
 * including sign up, sign in, and sign out functionality. All actions use
 * Supabase Auth and include proper error handling and validation.
 *
 * Server Actions provide a secure way to handle form submissions and
 * authentication flows without exposing sensitive operations to the client.
 *
 * @fileoverview Authentication server actions
 * @author NeighborFit Team
 * @version 1.0.0
 */

"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Server Action for user sign in
 *
 * Handles user authentication using email and password. This action:
 * - Validates form data and required fields
 * - Attempts to sign in the user with Supabase Auth
 * - Returns success/error states for client handling
 * - Does not redirect directly to allow client-side navigation
 *
 * @param {any} prevState - Previous form state (from useActionState)
 * @param {FormData} formData - Form data containing email and password
 * @returns {Promise<{error?: string, success?: boolean}>} Action result
 *
 * @example
 * // Usage in a form component with useActionState
 * const [state, formAction] = useActionState(signIn, null)
 *
 * return (
 *   <form action={formAction}>
 *     <input name="email" type="email" required />
 *     <input name="password" type="password" required />
 *     <button type="submit">Sign In</button>
 *     {state?.error && <p>{state.error}</p>}
 *   </form>
 * )
 *
 * @throws {Error} When form data is missing or invalid
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-actions} Supabase Server Actions
 */
export async function signIn(prevState: any, formData: FormData) {
  // Validate form data presence
  if (!formData) {
    return { error: "Form data is missing" }
  }

  // Extract and validate required fields
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Create Supabase client for server actions
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Attempt to sign in the user
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      // Return Supabase auth error message
      return { error: error.message }
    }

    // Return success state (client will handle redirect)
    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

/**
 * Server Action for user registration
 *
 * Handles new user registration using email and password. This action:
 * - Validates form data and required fields
 * - Creates a new user account with Supabase Auth
 * - Sends email verification if configured
 * - Returns appropriate success/error messages
 *
 * @param {any} prevState - Previous form state (from useActionState)
 * @param {FormData} formData - Form data containing email and password
 * @returns {Promise<{error?: string, success?: string}>} Action result
 *
 * @example
 * // Usage in a registration form
 * const [state, formAction] = useActionState(signUp, null)
 *
 * return (
 *   <form action={formAction}>
 *     <input name="email" type="email" required />
 *     <input name="password" type="password" required />
 *     <button type="submit">Sign Up</button>
 *     {state?.error && <p>{state.error}</p>}
 *     {state?.success && <p>{state.success}</p>}
 *   </form>
 * )
 *
 * @throws {Error} When form data is missing or invalid
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-actions} Supabase Server Actions
 */
export async function signUp(prevState: any, formData: FormData) {
  // Validate form data presence
  if (!formData) {
    return { error: "Form data is missing" }
  }

  // Extract and validate required fields
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  // Create Supabase client for server actions
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  try {
    // Attempt to sign up the user
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      // Return Supabase auth error message
      return { error: error.message }
    }

    // Return success message (email verification sent)
    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

/**
 * Server Action for user sign out
 *
 * Signs out the currently authenticated user. This action:
 * - Signs out the user with Supabase Auth
 * - Redirects the user to the login page
 *
 * @returns {Promise<void>}
 *
 * @example
 * // Call this function to sign out the user
 * await signOut()
 *
 * @see {@link https://supabase.com/docs/guides/auth/auth-helpers/nextjs#server-actions} Supabase Server Actions
 */
export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}
