"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Search, LogOut, Heart, LogIn, Building } from "lucide-react"
import { signOut } from "@/lib/actions"
import { supabase } from "@/lib/supabase/client"
import type { User as AuthUser } from "@supabase/supabase-js"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check if we're on auth pages
  const isAuthPage = pathname.startsWith("/auth/")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [mounted])

  const isActive = (path: string) => {
    return pathname === path
  }

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Don't show navbar on auth pages
  if (isAuthPage) {
    return null
  }

  // Show loading state
  if (loading) {
    return (
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-airbnb-500 to-airbnb-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold text-gray-900">NeighborFit</span>
            </Link>
            <div className="flex items-center space-x-1">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // If no user, show login/signup options
  if (!user) {
    return (
      <>
        {/* Desktop Navbar */}
        <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-airbnb-500 to-airbnb-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white fill-current" />
                </div>
                <span className="text-xl font-bold text-gray-900">NeighborFit</span>
              </Link>

              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" className="rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white rounded-full px-4 py-2">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-2 py-2">
            <Link href="/auth/login" className="flex flex-col items-center py-2">
              <div className="p-2 rounded-full">
                <LogIn className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs mt-1 text-gray-500">Sign In</span>
            </Link>

            <Link href="/auth/sign-up" className="flex flex-col items-center py-2">
              <div className="p-2 rounded-full bg-airbnb-50">
                <Home className="h-5 w-5 text-airbnb-500" />
              </div>
              <span className="text-xs mt-1 text-airbnb-500 font-medium">Sign Up</span>
            </Link>
          </div>
        </nav>
      </>
    )
  }

  // If user is authenticated, show full navigation
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-airbnb-500 to-airbnb-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-xl font-bold text-gray-900">NeighborFit</span>
            </Link>

            <div className="flex items-center space-x-1">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 ${
                    isActive("/") ? "bg-airbnb-500 hover:bg-airbnb-600 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>

              <Link href="/quiz">
                <Button
                  variant={isActive("/quiz") ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 ${
                    isActive("/quiz")
                      ? "bg-airbnb-500 hover:bg-airbnb-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Match
                </Button>
              </Link>

              <Link href="/neighborhoods">
                <Button
                  variant={isActive("/neighborhoods") ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 ${
                    isActive("/neighborhoods")
                      ? "bg-airbnb-500 hover:bg-airbnb-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Explore
                </Button>
              </Link>

              <Link href="/profile">
                <Button
                  variant={isActive("/profile") ? "default" : "ghost"}
                  className={`rounded-full px-4 py-2 ${
                    isActive("/profile")
                      ? "bg-airbnb-500 hover:bg-airbnb-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 py-2">
          <Link href="/" className="flex flex-col items-center py-2">
            <div className={`p-2 rounded-full ${isActive("/") ? "bg-airbnb-50" : ""}`}>
              <Home className={`h-5 w-5 ${isActive("/") ? "text-airbnb-500" : "text-gray-500"}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive("/") ? "text-airbnb-500 font-medium" : "text-gray-500"}`}>
              Home
            </span>
          </Link>

          <Link href="/quiz" className="flex flex-col items-center py-2">
            <div className={`p-2 rounded-full ${isActive("/quiz") ? "bg-airbnb-50" : ""}`}>
              <Search className={`h-5 w-5 ${isActive("/quiz") ? "text-airbnb-500" : "text-gray-500"}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive("/quiz") ? "text-airbnb-500 font-medium" : "text-gray-500"}`}>
              Quiz
            </span>
          </Link>

          <Link href="/neighborhoods" className="flex flex-col items-center py-2">
            <div className={`p-2 rounded-full ${isActive("/neighborhoods") ? "bg-airbnb-50" : ""}`}>
              <Building className={`h-5 w-5 ${isActive("/neighborhoods") ? "text-airbnb-500" : "text-gray-500"}`} />
            </div>
            <span
              className={`text-xs mt-1 ${isActive("/neighborhoods") ? "text-airbnb-500 font-medium" : "text-gray-500"}`}
            >
              Explore
            </span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center py-2">
            <div className={`p-2 rounded-full ${isActive("/profile") ? "bg-airbnb-50" : ""}`}>
              <Building className={`h-5 w-5 ${isActive("/profile") ? "text-airbnb-500" : "text-gray-500"}`} />
            </div>
            <span className={`text-xs mt-1 ${isActive("/profile") ? "text-airbnb-500 font-medium" : "text-gray-500"}`}>
              Profile
            </span>
          </Link>

          <form action={signOut} className="flex flex-col items-center py-2">
            <button type="submit" className="flex flex-col items-center">
              <div className="p-2 rounded-full">
                <LogOut className="h-5 w-5 text-gray-500" />
              </div>
              <span className="text-xs mt-1 text-gray-500">Logout</span>
            </button>
          </form>
        </div>
      </nav>
    </>
  )
}
