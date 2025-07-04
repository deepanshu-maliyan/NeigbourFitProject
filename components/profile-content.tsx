"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Settings, History, Mail, Calendar, MapPin, TrendingUp, Edit3, Save, X, Loader2 } from "lucide-react"
import { getUserPreferences, getUserMatches, saveUserPreferences } from "@/lib/database"
import { quizQuestions } from "@/lib/quiz-questions"
import type { UserPreferences, UserResult, Neighborhood } from "@/types"
import type { User as AuthUser } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

interface ProfileContentProps {
  user: AuthUser
}

type MatchWithNeighborhood = UserResult & { neighborhood: Neighborhood }

export default function ProfileContent({ user }: ProfileContentProps) {
  const supabase = createClientComponentClient()
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [matches, setMatches] = useState<MatchWithNeighborhood[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPreferences, setEditingPreferences] = useState(false)
  const [tempPreferences, setTempPreferences] = useState<UserPreferences | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true)

        // Load user preferences
        const userPrefs = await getUserPreferences(user.id)
        setPreferences(userPrefs)
        setTempPreferences(userPrefs)

        // Load user matches
        const userMatches = await getUserMatches(user.id)
        setMatches(userMatches)
      } catch (err) {
        console.error("Error loading profile data:", err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [user.id])

  const handleEditPreferences = () => {
    setEditingPreferences(true)
    setTempPreferences(preferences)
  }

  const handleCancelEdit = () => {
    setEditingPreferences(false)
    setTempPreferences(preferences)
    setError(null)
  }

  const handleSavePreferences = async () => {
    if (!tempPreferences) return

    try {
      setSaving(true)
      setError(null)

      const savedPrefs = await saveUserPreferences(tempPreferences)
      if (savedPrefs) {
        setPreferences(savedPrefs)
        setEditingPreferences(false)
      } else {
        throw new Error("Failed to save preferences")
      }
    } catch (err) {
      console.error("Error saving preferences:", err)
      setError("Failed to save preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const updateTempPreference = (key: keyof UserPreferences, value: number) => {
    if (!tempPreferences) return
    setTempPreferences({
      ...tempPreferences,
      [key]: value,
    })
  }

  const getPreferenceLabel = (key: string) => {
    const question = quizQuestions.find((q) => q.preference === key)
    return question ? question.question.replace("How important is ", "").replace(" to you?", "") : key
  }

  const getImportanceText = (value: number) => {
    const labels = [
      "",
      "Not Important",
      "Slightly Important",
      "Moderately Important",
      "Very Important",
      "Extremely Important",
    ]
    return labels[value] || "Unknown"
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-airbnb-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white">Profile</CardTitle>
              <CardDescription className="text-white/80">Manage your account and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-airbnb-500" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email Address
                  </Label>
                  <Input value={user.email || ""} disabled className="bg-gray-50" />
                  <p className="text-xs text-gray-500">Email cannot be changed. Contact support if needed.</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Member Since
                  </Label>
                  <Input value={new Date(user.created_at).toLocaleDateString()} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Account Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-airbnb-500">{matches.length}</div>
                    <div className="text-sm text-gray-600">Neighborhood Matches</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-airbnb-500">{preferences ? "1" : "0"}</div>
                    <div className="text-sm text-gray-600">Quiz Completed</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-airbnb-500">
                      {matches.length > 0 ? Math.round(matches[0].match_score) : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Best Match Score</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-airbnb-500" />
                    Lifestyle Preferences
                  </CardTitle>
                  <CardDescription>Your importance ratings for different neighborhood factors</CardDescription>
                </div>
                {!editingPreferences && preferences && (
                  <Button
                    onClick={handleEditPreferences}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!preferences ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Preferences Set</h3>
                  <p className="text-gray-600 mb-4">
                    Take our quiz to set your lifestyle preferences and get personalized neighborhood recommendations.
                  </p>
                  <Link href="/quiz">
                    <Button className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {editingPreferences && (
                    <div className="flex justify-end gap-2 pb-4 border-b border-gray-200">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePreferences}
                        disabled={saving}
                        className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white flex items-center gap-2"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(preferences).map(([key, value]) => {
                      if (key === "id" || key === "user_id" || key === "created_at" || key === "updated_at") return null

                      const currentValue =
                        editingPreferences && tempPreferences
                          ? (tempPreferences[key as keyof UserPreferences] as number)
                          : (value as number)

                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{getPreferenceLabel(key)}</h4>
                            <Badge variant={currentValue >= 4 ? "default" : "secondary"}>
                              {getImportanceText(currentValue)}
                            </Badge>
                          </div>

                          {editingPreferences ? (
                            <div className="space-y-2">
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={currentValue}
                                onChange={(e) =>
                                  updateTempPreference(key as keyof UserPreferences, Number.parseInt(e.target.value))
                                }
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Not Important</span>
                                <span>Extremely Important</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentValue / 5) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {!editingPreferences && (
                    <div className="pt-4 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Want to update your preferences? Take the quiz again to get new recommendations.
                      </p>
                      <Link href="/quiz">
                        <Button variant="outline">Retake Quiz</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-airbnb-500" />
                Match History
              </CardTitle>
              <CardDescription>Your neighborhood matches and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {matches.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Yet</h3>
                  <p className="text-gray-600 mb-4">Take our quiz to get personalized neighborhood recommendations.</p>
                  <Link href="/quiz">
                    <Button className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Showing {matches.length} neighborhood matches</p>
                    <Link href="/results">
                      <Button variant="outline" size="sm">
                        View Detailed Results
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{match.neighborhood.name}</h4>
                            <p className="text-sm text-gray-600">
                              {match.neighborhood.city}, {match.neighborhood.state}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-airbnb-500">{Math.round(match.match_score)}%</div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {matches.length > 5 && (
                    <div className="text-center pt-4">
                      <Link href="/results">
                        <Button variant="outline">View All {matches.length} Matches</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
