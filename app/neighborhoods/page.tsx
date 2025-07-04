import { isSupabaseConfigured } from "@/lib/supabase/server"
import NeighborhoodsContent from "@/components/neighborhoods-content"
import { getNeighborhoods } from "@/lib/database"

export default async function NeighborhoodsPage() {
  console.log("Supabase configured:", isSupabaseConfigured)
  
  if (!isSupabaseConfigured) {
    console.error("Supabase configuration error - missing environment variables")
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Connect Supabase to get started</h1>
          <p className="text-gray-600">Please configure your Supabase environment variables.</p>
        </div>
      </div>
    )
  }

  // Fetch all neighborhoods
  console.log("Fetching neighborhoods...")
  const neighborhoods = await getNeighborhoods()
  console.log("Fetched neighborhoods:", neighborhoods?.length || 0, "records")

  return (
    <div className="max-w-7xl mx-auto py-8">
      <NeighborhoodsContent neighborhoods={neighborhoods} />
    </div>
  )
}
