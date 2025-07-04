import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileContent from "@/components/profile-content"

export default async function ProfilePage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
          <p className="text-gray-600">Please configure your Supabase environment variables.</p>
        </div>
      </div>
    )
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <ProfileContent user={user} />
    </div>
  )
}
