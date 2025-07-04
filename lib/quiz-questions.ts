/**
 * Lifestyle Quiz Questions Configuration
 *
 * This module contains the complete set of quiz questions used to assess
 * user preferences for neighborhood matching. Each question corresponds to
 * one of the 13 lifestyle factors used in the matching algorithm.
 *
 * The questions are designed to be:
 * - Clear and easy to understand
 * - Relevant to Indian urban living
 * - Comprehensive in covering all lifestyle aspects
 * - Consistent in rating scale (1-5 importance)
 *
 * @fileoverview Quiz questions for lifestyle preference assessment
 * @author NeighborFit Team
 * @version 1.0.0
 */

import type { QuizQuestion } from "@/types"

/**
 * Complete array of lifestyle quiz questions
 *
 * Each question follows a consistent structure:
 * - Main question about importance of a lifestyle factor
 * - Descriptive context explaining what the factor includes
 * - 5-point importance scale from "Not important" to "Extremely important"
 * - Mapping to corresponding UserPreferences field
 *
 * The questions are ordered to create a logical flow for users:
 * 1. Safety and security concerns
 * 2. Financial considerations
 * 3. Transportation and connectivity
 * 4. Lifestyle and entertainment
 * 5. Family and community factors
 * 6. Professional and educational needs
 *
 * @constant {QuizQuestion[]} quizQuestions
 *
 * @example
 * // Usage in quiz component
 * import { quizQuestions } from '@/lib/quiz-questions'
 *
 * quizQuestions.forEach((question, index) => {
 *   console.log(`Question ${index + 1}: ${question.question}`)
 * })
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: "safety",
    question: "How important is neighborhood safety to you?",
    description: "This includes crime rates, street lighting, and general feeling of security.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "safety_importance",
  },
  {
    id: "affordability",
    question: "How important is affordability to you?",
    description: "This includes rent, property prices, and general cost of living.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "affordability_importance",
  },
  {
    id: "connectivity",
    question: "How important is overall connectivity to you?",
    description: "This includes road networks, traffic conditions, and ease of commuting.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "connectivity_importance",
  },
  {
    id: "metro",
    question: "How important is metro/local train access to you?",
    description: "This measures proximity to metro stations and local train networks.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "metro_access_importance",
  },
  {
    id: "food",
    question: "How important is food culture and dining options?",
    description: "This includes street food, restaurants, cafes, and local cuisine variety.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "food_culture_importance",
  },
  {
    id: "nightlife",
    question: "How important is nightlife and entertainment to you?",
    description: "This includes pubs, clubs, late-night eateries, and entertainment venues.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "nightlife_importance",
  },
  {
    id: "family",
    question: "How important are family-friendly amenities to you?",
    description: "This includes schools, parks, playgrounds, and child-friendly facilities.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "family_friendly_importance",
  },
  {
    id: "cultural_diversity",
    question: "How important is cultural diversity to you?",
    description: "This includes festivals, cultural events, and community diversity.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "cultural_diversity_importance",
  },
  {
    id: "green_spaces",
    question: "How important are green spaces and parks to you?",
    description: "This includes parks, gardens, and access to nature within the city.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "green_spaces_importance",
  },
  {
    id: "job_opportunities",
    question: "How important is proximity to job opportunities?",
    description: "This measures the availability of jobs and business districts nearby.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "job_opportunities_importance",
  },
  {
    id: "healthcare",
    question: "How important is access to healthcare facilities?",
    description: "This includes hospitals, clinics, and medical services availability.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "healthcare_importance",
  },
  {
    id: "education",
    question: "How important is access to educational institutions?",
    description: "This includes schools, colleges, and educational facilities nearby.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "education_importance",
  },
  {
    id: "shopping",
    question: "How important is access to shopping and markets?",
    description: "This includes malls, local markets, and shopping convenience.",
    options: [
      { value: 1, label: "Not important" },
      { value: 2, label: "Slightly important" },
      { value: 3, label: "Moderately important" },
      { value: 4, label: "Very important" },
      { value: 5, label: "Extremely important" },
    ],
    preference: "shopping_importance",
  },
]

/**
 * Utility function to get a question by its ID
 *
 * @param {string} id - The unique identifier of the question
 * @returns {QuizQuestion | undefined} The question object or undefined if not found
 *
 * @example
 * const safetyQuestion = getQuestionById('safety')
 * if (safetyQuestion) {
 *   console.log(safetyQuestion.question)
 * }
 */
export function getQuestionById(id: string): QuizQuestion | undefined {
  return quizQuestions.find((question) => question.id === id)
}

/**
 * Utility function to get questions by preference field
 *
 * @param {string} preference - The preference field name
 * @returns {QuizQuestion | undefined} The question object or undefined if not found
 *
 * @example
 * const question = getQuestionByPreference('safety_importance')
 * console.log(question?.question)
 */
export function getQuestionByPreference(preference: string): QuizQuestion | undefined {
  return quizQuestions.find((question) => question.preference === preference)
}

/**
 * Validates if all required preferences are covered by quiz questions
 *
 * @returns {boolean} True if all preferences have corresponding questions
 */
export function validateQuizCompleteness(): boolean {
  const requiredPreferences = [
    "safety_importance",
    "affordability_importance",
    "connectivity_importance",
    "metro_access_importance",
    "food_culture_importance",
    "nightlife_importance",
    "family_friendly_importance",
    "cultural_diversity_importance",
    "green_spaces_importance",
    "job_opportunities_importance",
    "healthcare_importance",
    "education_importance",
    "shopping_importance",
  ]

  const questionPreferences = quizQuestions.map((q) => q.preference)

  return requiredPreferences.every((pref) => questionPreferences.includes(pref as any))
}

/**
 * Gets the total number of quiz questions
 *
 * @returns {number} Total number of questions in the quiz
 */
export function getQuizLength(): number {
  return quizQuestions.length
}

/**
 * Calculates quiz progress as a percentage
 *
 * @param {number} currentQuestionIndex - Current question index (0-based)
 * @returns {number} Progress percentage (0-100)
 *
 * @example
 * const progress = getQuizProgress(5) // 5th question out of 13
 * console.log(`Progress: ${progress}%`) // Progress: 38%
 */
export function getQuizProgress(currentQuestionIndex: number): number {
  return Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)
}
