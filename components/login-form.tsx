"use client"

import { useFormState } from "react-dom"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { signIn } from "@/lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white py-3 text-base font-medium rounded-lg h-12 shadow-md hover:shadow-lg transition-all duration-200"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        "Sign In"
      )}
    </Button>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction] = useFormState(signIn, null)

  // Handle successful login by redirecting
  useEffect(() => {
    if (state?.success) {
      router.push("/")
    }
  }, [state, router])

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-6 pt-8 px-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-airbnb-500 to-airbnb-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome back</CardTitle>
          <CardDescription className="text-gray-600 mt-2">Sign in to your NeighborFit account</CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-airbnb-500 focus:ring-airbnb-500 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="h-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-airbnb-500 focus:ring-airbnb-500 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-airbnb-500 focus:ring-airbnb-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-airbnb-500 hover:text-airbnb-600 font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <SubmitButton />

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-airbnb-500 hover:text-airbnb-600 font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-xs text-gray-500">
        Secure login protected by industry-standard encryption
      </div>
    </div>
  )
}
