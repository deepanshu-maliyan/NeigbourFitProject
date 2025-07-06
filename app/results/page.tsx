"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Info, Users, GraduationCap, IndianRupee, Wind } from "lucide-react"
import Link from "next/link"
import { getUserMatches } from "@/lib/database"
import type { UserResult, Neighborhood } from "@/types"

type MatchWithNeighborhood = UserResult & { neighborhood: Neighborhood }

export default function ResultsPage() {
  const [matches, setMatches] = useState<MatchWithNeighborhood[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true)
        
        if (!supabase) {
          throw new Error("Supabase client not available")
        }
        
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("User not authenticated")
        }

        const userMatches = await getUserMatches(user.id)
        setMatches(userMatches)

        if (userMatches.length > 0) {
          setSelectedNeighborhood(userMatches[0].neighborhood)
        }
      } catch (err) {
        console.error("Error fetching matches:", err)
        setError(err instanceof Error ? err.message : "Failed to load matches")
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-airbnb-500" />
      </div>
    )
  }

  if (error || matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <Card className="bg-white border-gray-200 shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            {error ? "Error Loading Results" : "No Matches Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Please take the quiz to get personalized neighborhood recommendations."}
          </p>
          <Link href="/quiz">
            <Button className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white">
              {error ? "Try Again" : "Take the Quiz"}
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Neighborhood Matches</h1>
      <p className="text-gray-600 mb-8">Based on official government data and research</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-white border-gray-200 shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white">
              <CardTitle className="text-xl">Top Matches</CardTitle>
              <CardDescription className="text-white/80">Ranked by compatibility</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[60vh] overflow-y-auto p-3">
              <div className="space-y-2">
                {matches.map((match) => (
                  <div
                    key={match.neighborhood_id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedNeighborhood?.id === match.neighborhood_id
                        ? "bg-airbnb-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedNeighborhood(match.neighborhood)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="font-medium">{match.neighborhood.name}</span>
                      </div>
                      <div className="text-sm font-bold">{Math.round(match.match_score)}%</div>
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {match.neighborhood.city}, {match.neighborhood.state}
                    </div>
                    {match.neighborhood.pincode && (
                      <div className="text-xs opacity-70">PIN: {match.neighborhood.pincode}</div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/quiz">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full bg-transparent"
              >
                Retake Quiz
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedNeighborhood && (
            <Card className="bg-white border-gray-200 shadow-lg rounded-xl overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedNeighborhood.image_url})` }}
              ></div>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-gray-900">{selectedNeighborhood.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {selectedNeighborhood.city}, {selectedNeighborhood.state}
                      {selectedNeighborhood.pincode && ` - ${selectedNeighborhood.pincode}`}
                    </CardDescription>
                  </div>
                  <div className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white text-xl font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                    {Math.round(matches.find((m) => m.neighborhood_id === selectedNeighborhood.id)?.match_score || 0)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">{selectedNeighborhood.description}</p>

                {/* Government Data Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedNeighborhood.population_density && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <Users className="h-5 w-5 text-airbnb-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-900">
                        {selectedNeighborhood.population_density.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">per km²</div>
                    </div>
                  )}
                  {selectedNeighborhood.literacy_rate && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <GraduationCap className="h-5 w-5 text-airbnb-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-900">{selectedNeighborhood.literacy_rate}%</div>
                      <div className="text-xs text-gray-600">Literacy</div>
                    </div>
                  )}
                  {selectedNeighborhood.avg_income && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <IndianRupee className="h-5 w-5 text-airbnb-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(selectedNeighborhood.avg_income / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-gray-600">Avg Income</div>
                    </div>
                  )}
                  {selectedNeighborhood.air_quality_index && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <Wind className="h-5 w-5 text-airbnb-500 mx-auto mb-1" />
                      <div className="text-sm font-medium text-gray-900">{selectedNeighborhood.air_quality_index}</div>
                      <div className="text-xs text-gray-600">AQI</div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Lifestyle Scores</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ScoreBar label="Safety" score={selectedNeighborhood.safety_score} />
                    <ScoreBar label="Affordability" score={selectedNeighborhood.affordability_score} />
                    <ScoreBar label="Connectivity" score={selectedNeighborhood.connectivity_score} />
                    <ScoreBar label="Metro Access" score={selectedNeighborhood.metro_access_score} />
                    <ScoreBar label="Food Culture" score={selectedNeighborhood.food_culture_score} />
                    <ScoreBar label="Nightlife" score={selectedNeighborhood.nightlife_score} />
                    <ScoreBar label="Family Friendly" score={selectedNeighborhood.family_friendly_score} />
                    <ScoreBar label="Cultural Diversity" score={selectedNeighborhood.cultural_diversity_score} />
                    <ScoreBar label="Green Spaces" score={selectedNeighborhood.green_spaces_score} />
                    <ScoreBar label="Job Opportunities" score={selectedNeighborhood.job_opportunities_score} />
                    <ScoreBar label="Healthcare" score={selectedNeighborhood.healthcare_score} />
                    <ScoreBar label="Education" score={selectedNeighborhood.education_score} />
                    <ScoreBar label="Shopping" score={selectedNeighborhood.shopping_score} />
                  </div>
                </div>

                {selectedNeighborhood.data_sources && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 mb-1">Data Sources</p>
                        <p className="text-blue-700">{selectedNeighborhood.data_sources}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg flex items-start gap-3 border border-gray-200">
                  <Info className="h-5 w-5 text-airbnb-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p>
                      This analysis is based on official government data, census information, and verified research
                      sources. Consider visiting the area and conducting your own research before making decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  // Normalize score from 0-10 to 1-5 scale
  const normalizeScore = (score: number, maxScore: number = 10): number => {
    if (score <= 0) return 1
    if (score >= maxScore) return 5
    // Convert from 0-maxScore to 1-5 scale
    return Number((1 + (score / maxScore) * 4).toFixed(1))
  }

  const normalizedScore = normalizeScore(score)

  const getColor = (score: number) => {
    if (score >= 4) return "bg-green-500"
    if (score >= 3) return "bg-blue-500"
    if (score >= 2) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
          <div className={`h-full ${getColor(normalizedScore)}`} style={{ width: `${normalizedScore * 20}%` }}></div>
        </div>
        <span className="text-xs text-gray-600 w-8">{normalizedScore}/5</span>
      </div>
    </div>
  )
}
