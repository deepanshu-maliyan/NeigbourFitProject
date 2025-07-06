/**
 * Neighborhoods Content Component
 *
 * A comprehensive neighborhood exploration interface that provides:
 * - Advanced filtering and search capabilities
 * - Interactive neighborhood cards with detailed information
 * - Government data visualization
 * - Detailed neighborhood view with lifestyle scores
 * - Responsive design for mobile and desktop
 *
 * This component handles the main neighborhoods page functionality including
 * data filter                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.connectivity_score) / 5) * 100}%` }}
                              />className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.food_culture_score) / 5) * 100}%` }}
                              />sorting, selection, and detailed information display.
 *
 * @component
 * @example
 * // Usage in a page component
 * import NeighborhoodsContent from '@/components/neighborhoods-content'
 *
 * export default function NeighborhoodsPage() {
 *   const neighborhoods = await getNeighborhoods()
 *   return <NeighborhoodsContent neighborhoods={neighborhoods} />
 * }
 *
 * @param {NeighborhoodsContentProps} props - Component props
 * @param {Neighborhood[]} props.neighborhoods - Array of neighborhood data
 *
 * @author NeighborFit Team
 * @version 1.0.0
 */

"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Search,
  Filter,
  Users,
  GraduationCap,
  IndianRupee,
  Wind,
  Shield,
  Car,
  Train,
  UtensilsCrossed,
  Music,
  Baby,
  Palette,
  Trees,
  Briefcase,
  Heart,
  Building,
  ShoppingBag,
  Info,
  Star,
  Eye,
  ExternalLink,
  Globe,
} from "lucide-react"
import type { Neighborhood } from "@/types"
import Link from "next/link"

/**
 * Normalizes a score to be within 1-5 range
 * @param score - The raw score to normalize
 * @param maxScore - The maximum possible score (default: 10)
 * @returns A normalized score between 1-5
 */
const normalizeScore = (score: number, maxScore: number = 10): number => {
  if (score <= 0) return 1
  if (score >= maxScore) return 5
  // Convert from 0-maxScore to 1-5 scale
  return Number((1 + (score / maxScore) * 4).toFixed(1))
}

/**
 * Props interface for NeighborhoodsContent component
 */
interface NeighborhoodsContentProps {
  /** Array of neighborhood objects to display and filter */
  neighborhoods: Neighborhood[]
}

/**
 * Main neighborhoods exploration component
 *
 * Features:
 * - Real-time search across neighborhood names, cities, and states
 * - Multi-level filtering by city and state
 * - Dynamic sorting by various criteria
 * - Interactive neighborhood selection
 * - Detailed information panel with government data
 * - Responsive grid layout
 * - Performance optimized with useMemo hooks
 */
export default function NeighborhoodsContent({ neighborhoods }: NeighborhoodsContentProps) {
  // State management for filtering and selection
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedState, setSelectedState] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null)

  /**
   * Memoized list of unique cities from neighborhoods data
   * Sorted alphabetically for consistent UI
   */
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(neighborhoods.map((n) => n.city))].sort()
    return uniqueCities
  }, [neighborhoods])

  /**
   * Memoized list of unique states from neighborhoods data
   * Sorted alphabetically for consistent UI
   */
  const states = useMemo(() => {
    const uniqueStates = [...new Set(neighborhoods.map((n) => n.state))].sort()
    return uniqueStates
  }, [neighborhoods])

  /**
   * Memoized filtered and sorted neighborhoods
   *
   * Applies multiple filters:
   * 1. Text search across name, city, and state
   * 2. City filter (if selected)
   * 3. State filter (if selected)
   * 4. Sorting by selected criteria
   *
   * Performance optimized to only recalculate when dependencies change
   */
  const filteredNeighborhoods = useMemo(() => {
    // Apply filters
    const filtered = neighborhoods.filter((neighborhood) => {
      const matchesSearch =
        neighborhood.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neighborhood.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neighborhood.state.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = selectedCity === "all" || neighborhood.city === selectedCity
      const matchesState = selectedState === "all" || neighborhood.state === selectedState

      return matchesSearch && matchesCity && matchesState
    })

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "city":
          return a.city.localeCompare(b.city)
        case "safety":
          return b.safety_score - a.safety_score
        case "affordability":
          return b.affordability_score - a.affordability_score
        case "job_opportunities":
          return b.job_opportunities_score - a.job_opportunities_score
        case "overall":
          const aOverall = getOverallRating(a)
          const bOverall = getOverallRating(b)
          return bOverall - aOverall
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [neighborhoods, searchTerm, selectedCity, selectedState, sortBy])

  /**
   * Reset selected neighborhood when filters change
   * Prevents showing details for neighborhoods not in current filter results
   */
  useMemo(() => {
    if (selectedNeighborhood && !filteredNeighborhoods.find((n) => n.id === selectedNeighborhood.id)) {
      setSelectedNeighborhood(null)
    }
  }, [filteredNeighborhoods, selectedNeighborhood])

  /**
   * Determines color scheme for score display based on score value
   *
   * @param {number} score - Score value (1-10 scale)
   * @returns {string} Tailwind CSS classes for color styling
   */
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 6) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 4) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  /**
   * Returns appropriate icon component for lifestyle category
   *
   * @param {string} category - Lifestyle category name
   * @returns {React.ComponentType} Lucide React icon component
   */
  const getScoreIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      safety: Shield,
      affordability: IndianRupee,
      connectivity: Car,
      metro_access: Train,
      food_culture: UtensilsCrossed,
      nightlife: Music,
      family_friendly: Baby,
      cultural_diversity: Palette,
      green_spaces: Trees,
      job_opportunities: Briefcase,
      healthcare: Heart,
      education: GraduationCap,
      shopping: ShoppingBag,
    }
    return iconMap[category] || MapPin
  }

  /**
   * Calculates overall rating for a neighborhood
   *
   * Uses a weighted average of key lifestyle factors that most users
   * consider important when choosing a neighborhood.
   *
   * @param {Neighborhood} neighborhood - Neighborhood object
   * @returns {number} Overall rating (1-5 scale)
   */
  const getOverallRating = (neighborhood: Neighborhood) => {
    return (
      (normalizeScore(neighborhood.safety_score) +
        normalizeScore(neighborhood.job_opportunities_score) +
        normalizeScore(neighborhood.affordability_score) +
        normalizeScore(neighborhood.connectivity_score) +
        normalizeScore(neighborhood.food_culture_score)) /
      5
    )
  }

  // Component JSX continues...
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white rounded-2xl p-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Indian Neighborhoods</h1>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          Discover detailed insights about neighborhoods across India, backed by government data and research.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search neighborhoods..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {Array.from(new Set(neighborhoods.map((n) => n.city))).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {Array.from(new Set(neighborhoods.map((n) => n.state))).map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Neighborhoods List */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredNeighborhoods.length} Neighborhood{filteredNeighborhoods.length !== 1 ? "s" : ""}
            </h2>
            <Badge variant="outline" className="text-sm px-3 py-1">
              {selectedCity !== "all" && `${selectedCity} • `}
              {selectedState !== "all" && `${selectedState} • `}
              {searchTerm && `"${searchTerm}" • `}
              {filteredNeighborhoods.length} result{filteredNeighborhoods.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-6 h-[800px] overflow-y-auto pr-4">
            {filteredNeighborhoods.map((neighborhood) => (
              <Card
                key={neighborhood.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${
                  selectedNeighborhood?.id === neighborhood.id ? "ring-2 ring-airbnb-500" : ""
                }`}
                onClick={() => setSelectedNeighborhood(neighborhood)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
                      style={{
                        backgroundImage: `url(${neighborhood.image_url || "/placeholder.jpg"})`,
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{neighborhood.name}</h3>
                        <p className="text-gray-600">{neighborhood.city}, {neighborhood.state}</p>
                      </div>
                      <Badge
                        className={`${
                          normalizeScore(neighborhood.safety_score) >= 4
                            ? "bg-green-100 text-green-700 border-green-200"
                            : normalizeScore(neighborhood.safety_score) >= 3
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        Safety: {normalizeScore(neighborhood.safety_score)}/5
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Affordability: {normalizeScore(neighborhood.affordability_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Train className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Metro Access: {normalizeScore(neighborhood.metro_access_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Food Culture: {normalizeScore(neighborhood.food_culture_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Infrastructure: {normalizeScore(neighborhood.connectivity_score)}/5
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2">{neighborhood.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-1 h-[800px] sticky top-24">
          {selectedNeighborhood ? (
            <Card className="h-full overflow-y-auto">
              <div className="relative h-48">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${selectedNeighborhood.image_url || "/placeholder.jpg"})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-2xl font-bold">{selectedNeighborhood.name}</h2>
                  <p className="text-white/90">{selectedNeighborhood.city}, {selectedNeighborhood.state}</p>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this Neighborhood</h3>
                    <p className="text-gray-600">{selectedNeighborhood.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Safety Score</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.safety_score) / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.safety_score)}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Affordability</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.affordability_score) / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.affordability_score)}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Metro Access</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.metro_access_score) / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.metro_access_score)}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Food Culture</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${(selectedNeighborhood.food_culture_score / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.food_culture_score)}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Nightlife</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-pink-500 rounded-full"
                                style={{ width: `${(normalizeScore(selectedNeighborhood.nightlife_score) / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.nightlife_score)}/5</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-1">Infrastructure</div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${(selectedNeighborhood.connectivity_score / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{normalizeScore(selectedNeighborhood.connectivity_score)}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Family Friendly: {normalizeScore(selectedNeighborhood.family_friendly_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Cultural Diversity: {normalizeScore(selectedNeighborhood.cultural_diversity_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Healthcare: {normalizeScore(selectedNeighborhood.healthcare_score)}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Education: {normalizeScore(selectedNeighborhood.education_score)}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center text-center p-8">
              <div className="max-w-sm">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Neighborhood</h3>
                <p className="text-gray-600">
                  Click on any neighborhood card on the left to view detailed information and insights.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
