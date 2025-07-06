"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { quizQuestions } from "@/lib/quiz-questions"
import type { UserPreferences } from "@/types"
import { saveUserPreferences, calculateAndSaveMatches } from "@/lib/database"
import { Loader2 } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const totalQuestions = quizQuestions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.preference]: value,
    }))

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      if (!supabase) {
        throw new Error("Supabase client not available")
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      // Prepare user preferences with all the correct field names
      const preferences: UserPreferences = {
        user_id: user.id,
        safety_importance: answers.safety_importance || 3,
        affordability_importance: answers.affordability_importance || 3,
        connectivity_importance: answers.connectivity_importance || 3,
        metro_access_importance: answers.metro_access_importance || 3,
        food_culture_importance: answers.food_culture_importance || 3,
        nightlife_importance: answers.nightlife_importance || 3,
        family_friendly_importance: answers.family_friendly_importance || 3,
        cultural_diversity_importance: answers.cultural_diversity_importance || 3,
        green_spaces_importance: answers.green_spaces_importance || 3,
        job_opportunities_importance: answers.job_opportunities_importance || 3,
        healthcare_importance: answers.healthcare_importance || 3,
        education_importance: answers.education_importance || 3,
        shopping_importance: answers.shopping_importance || 3,
      }

      // Save preferences
      const savedPreferences = await saveUserPreferences(preferences)

      if (!savedPreferences) {
        throw new Error("Failed to save preferences")
      }

      // Calculate matches
      await calculateAndSaveMatches(user.id)

      // Redirect to results page
      router.push("/results")
    } catch (err) {
      console.error("Error submitting quiz:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="bg-white border-gray-200 shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white">
          <CardTitle className="text-2xl">Lifestyle Preferences Quiz</CardTitle>
          <CardDescription className="text-white/80">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </CardDescription>
          <div className="w-full bg-white/30 h-2 rounded-full mt-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900">{currentQuestion.question}</h3>
            {currentQuestion.description && <p className="text-gray-600">{currentQuestion.description}</p>}
            <RadioGroup value={answers[currentQuestion.preference]?.toString()} className="space-y-3 mt-4">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`${currentQuestion.id}-${option.value}`}
                    onClick={() => handleAnswer(option.value)}
                    className="border-gray-300 text-airbnb-500"
                  />
                  <Label htmlFor={`${currentQuestion.id}-${option.value}`} className="text-gray-800 cursor-pointer">
                    {option.label}
                    {option.description && <span className="block text-sm text-gray-500">{option.description}</span>}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 bg-transparent"
          >
            Previous
          </Button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "See My Matches"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!answers[currentQuestion.preference]}
              className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white"
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
