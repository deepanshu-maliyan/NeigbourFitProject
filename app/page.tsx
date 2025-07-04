import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  MapPin,
  TrendingUp,
  Users,
  Search,
  Heart,
  LogIn,
  Shield,
  IndianRupee,
  Train,
  UtensilsCrossed,
  Building,
  Star,
  CheckCircle,
  ArrowRight,
  Quote,
  Award,
  Globe,
  BarChart3,
  Clock,
  Smartphone,
  Zap,
  Target,
  MapPinIcon,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Eye,
  Info,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default async function Home() {
  // Handle case where Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            Please configure your Supabase environment variables to get started with NeighborFit.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left text-sm">
            <p className="font-medium mb-2">Required environment variables:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• NEXT_PUBLIC_SUPABASE_URL</li>
              <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  let user = null

  try {
    const supabase = createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error("Error getting user:", error)
    // Continue without user - will show landing page
  }

  // If no user, show complete landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-airbnb-50">
          <div className="absolute inset-0 bg-grid-gray-100 bg-[size:20px_20px] opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
            <div className="text-center">
              <Badge className="mb-6 bg-airbnb-100 text-airbnb-700 border-airbnb-200 hover:bg-airbnb-200">
                🏠 Trusted by 50,000+ Indians
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Find your perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-airbnb-500 via-airbnb-600 to-pink-600">
                  Indian neighborhood
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Discover neighborhoods across India that match your lifestyle with our data-driven platform. From
                bustling Mumbai to tech-savvy Bangalore, find your perfect home backed by government data.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Search className="mr-3 h-6 w-6" />
                    Start Your Journey Free
                  </Button>
                </Link>

                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-10 py-6 text-xl rounded-full bg-white/80 backdrop-blur-sm"
                  >
                    <LogIn className="mr-3 h-6 w-6" />
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Government Data Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>4.8/5 User Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>50,000+ Happy Users</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <h3 className="text-4xl font-bold text-rose-500 mb-2">42</h3>
                <p className="text-gray-600">Neighborhoods</p>
              </Card>
              <Card className="text-center p-6">
                <h3 className="text-4xl font-bold text-blue-500 mb-2">8</h3>
                <p className="text-gray-600">Cities</p>
              </Card>
              <Card className="text-center p-6">
                <h3 className="text-4xl font-bold text-green-500 mb-2">13</h3>
                <p className="text-gray-600">Lifestyle Factors</p>
              </Card>
              <Card className="text-center p-6">
                <h3 className="text-4xl font-bold text-purple-500 mb-2">98%</h3>
                <p className="text-gray-600">Accuracy</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">✨ Why Choose NeighborFit</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                The smartest way to find your
                <span className="text-airbnb-600"> perfect neighborhood</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced platform combines government data, user preferences, and comprehensive algorithms to deliver
                personalized neighborhood recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">India-Specific Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Deep understanding of Indian cities - from metro connectivity and street food culture to safety
                    ratings and monsoon preparedness.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Government Data Backed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Our algorithm uses official data from Census 2011, NCRB crime statistics, municipal reports, and
                    pollution control boards for maximum accuracy.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Smart Neighborhood Matching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced algorithm analyzes 13+ lifestyle factors including safety, affordability, connectivity, and
                    culture to find your perfect match.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Real-Time Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Get instant neighborhood recommendations with detailed compatibility scores, government statistics,
                    and lifestyle insights in seconds.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Mobile Optimized</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    Seamless experience across all devices. Take the quiz on your phone, view results on desktop, and
                    share with family anywhere.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Comprehensive Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    From metro cities like Mumbai and Delhi to emerging hubs like Pune and Kochi, we cover neighborhoods
                    across India's major urban centers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">🚀 Simple Process</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How it works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find your perfect neighborhood in just 3 simple steps. Our process is designed to be quick, accurate,
                and personalized to your unique lifestyle needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-airbnb-500 to-airbnb-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sign up for free in under 30 seconds. No credit card required, no hidden fees - just instant access to
                  our neighborhood matching platform.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Take the Lifestyle Quiz</h3>
                <p className="text-gray-600 leading-relaxed">
                  Answer 13 quick questions about your preferences - from safety and affordability to food culture and
                  nightlife. Takes just 3 minutes to complete.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-800" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Personalized Matches</h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive ranked neighborhood recommendations with detailed compatibility scores, government data
                  insights, and everything you need to make an informed decision.
                </p>
              </div>
            </div>

            {/* CTA in How It Works */}
            <div className="text-center mt-16">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Finding Your Perfect Home
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">💬 User Stories</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">What our users say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join thousands of Indians who have found their perfect neighborhood with NeighborFit. Here's what they
                have to say about their experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-airbnb-500 mr-3" />
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "NeighborFit helped me find the perfect area in Bangalore for my family. The safety scores and
                    school ratings were exactly what I needed to make an informed decision."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      P
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Priya Sharma</div>
                      <div className="text-gray-500 text-sm">Software Engineer, Bangalore</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-airbnb-500 mr-3" />
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "As a young professional moving to Mumbai, I was overwhelmed by choices. NeighborFit's algorithm
                    perfectly matched my priorities - great nightlife and metro connectivity!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      R
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Rahul Verma</div>
                      <div className="text-gray-500 text-sm">Marketing Manager, Mumbai</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <Quote className="h-8 w-8 text-airbnb-500 mr-3" />
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "The government data integration is brilliant! I could see actual crime statistics, air quality
                    data, and literacy rates. Made my decision to move to Pune so much easier."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Anita Desai</div>
                      <div className="text-gray-500 text-sm">Data Scientist, Pune</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Lifestyle Factors Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">🎯 Comprehensive Analysis</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">13 lifestyle factors we analyze</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our algorithm considers every aspect of urban living to ensure you find a neighborhood that truly
                matches your lifestyle and priorities.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, label: "Safety & Security", color: "from-red-500 to-red-600" },
                { icon: IndianRupee, label: "Affordability", color: "from-green-500 to-green-600" },
                { icon: Train, label: "Metro Access", color: "from-blue-500 to-blue-600" },
                { icon: UtensilsCrossed, label: "Food Culture", color: "from-orange-500 to-orange-600" },
                { icon: Building, label: "Job Opportunities", color: "from-purple-500 to-purple-600" },
                { icon: Users, label: "Family Friendly", color: "from-pink-500 to-pink-600" },
                { icon: Heart, label: "Healthcare", color: "from-teal-500 to-teal-600" },
                { icon: Star, label: "Education", color: "from-yellow-500 to-yellow-600" },
                { icon: MapPin, label: "Connectivity", color: "from-indigo-500 to-indigo-600" },
                { icon: Globe, label: "Cultural Diversity", color: "from-cyan-500 to-cyan-600" },
                { icon: TrendingUp, label: "Nightlife", color: "from-violet-500 to-violet-600" },
                { icon: Clock, label: "Green Spaces", color: "from-emerald-500 to-emerald-600" },
                { icon: Award, label: "Shopping", color: "from-rose-500 to-rose-600" },
              ].map((factor, index) => (
                <Card
                  key={index}
                  className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${factor.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <factor.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{factor.label}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-r from-airbnb-500 to-airbnb-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Stay updated with neighborhood insights</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get weekly updates on new neighborhoods, market trends, and exclusive insights delivered straight to your
              inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
              />
              <Button className="bg-white text-airbnb-600 hover:bg-gray-100 h-12 px-8 font-semibold">Subscribe</Button>
            </div>

            <p className="text-white/70 text-sm mt-4">No spam, unsubscribe at any time. We respect your privacy.</p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to find your perfect neighborhood?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of Indians who have found their ideal home with NeighborFit. Start your journey today -
              it's completely free!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white px-10 py-6 text-xl rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Heart className="mr-3 h-6 w-6" />
                  Start Your Journey
                </Button>
              </Link>

              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-airbnb-500 to-airbnb-600 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white fill-current" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">NeighborFit</span>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  India's most trusted neighborhood discovery platform. We help millions of Indians find their perfect
                  home using data-driven matching and government-verified data.
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 hover:bg-airbnb-500 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Twitter className="h-5 w-5 text-gray-600 group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 hover:bg-airbnb-500 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Facebook className="h-5 w-5 text-gray-600 group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 hover:bg-airbnb-500 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Instagram className="h-5 w-5 text-gray-600 group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 hover:bg-airbnb-500 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Linkedin className="h-5 w-5 text-gray-600 group-hover:text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-200 hover:bg-airbnb-500 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Github className="h-5 w-5 text-gray-600 group-hover:text-white" />
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/neighborhoods" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Explore Neighborhoods
                    </a>
                  </li>
                  <li>
                    <a href="/quiz" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Take Quiz
                    </a>
                  </li>
                  <li>
                    <a href="/results" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      View Results
                    </a>
                  </li>
                  <li>
                    <a href="/profile" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Profile
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/about" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="/press" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Press
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                <ul className="space-y-3">
                  <li>
                    <a href="/help" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-gray-600 hover:text-airbnb-600 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-200 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-600 text-sm">
                  © 2024 NeighborFit. All rights reserved. Made with ❤️ for India's urban explorers.
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>Made in India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Government Data Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // If user is authenticated, show the authenticated home page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-airbnb-50 via-white to-pink-50">
        <div className="absolute inset-0 bg-grid-gray-100 bg-[size:20px_20px] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              🎉 Welcome back, {user.email?.split("@")[0]}!
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your neighborhood journey
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-airbnb-500 to-airbnb-600">
                continues here
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Ready to discover your perfect Indian neighborhood? Take our personalized quiz, explore new areas, or view
              your previous results to find your ideal home.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-airbnb-500 to-airbnb-600 hover:from-airbnb-600 hover:to-airbnb-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find My Perfect Match
                </Button>
              </Link>
              <Link href="/neighborhoods">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-4 text-lg rounded-full bg-white"
                >
                  <Building className="mr-2 h-5 w-5" />
                  Explore Neighborhoods
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-airbnb-600">500+</div>
                <div className="text-sm text-gray-600">Neighborhoods</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-blue-600">25+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-green-600">13</div>
                <div className="text-sm text-gray-600">Lifestyle Factors</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Dashboard */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What would you like to do today?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our most popular features to continue your neighborhood discovery journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Take Quiz Card */}
            <Card className="bg-gradient-to-br from-airbnb-500 to-airbnb-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Take Lifestyle Quiz</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Answer 13 quick questions about your preferences to get personalized neighborhood recommendations.
                </p>
                <Link href="/quiz">
                  <Button className="bg-white text-airbnb-600 hover:bg-gray-100 w-full font-semibold">
                    Start Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* View Results Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">View My Results</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  See your personalized neighborhood matches with detailed compatibility scores and insights.
                </p>
                <Link href="/results">
                  <Button variant="outline" className="w-full bg-transparent border-gray-300 hover:bg-gray-50">
                    View Results
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Explore Neighborhoods Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Areas</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Browse through 500+ neighborhoods across India with detailed information and government data.
                </p>
                <Link href="/neighborhoods">
                  <Button variant="outline" className="w-full bg-transparent border-gray-300 hover:bg-gray-50">
                    Explore Now
                    <MapPin className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Profile Management Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Profile</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Update your preferences, view your quiz history, and manage your account settings.
                </p>
                <Link href="/profile">
                  <Button variant="outline" className="w-full bg-transparent border-gray-300 hover:bg-gray-50">
                    View Profile
                    <User className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help & Support Card */}
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Help & Support</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get help with using the platform, understanding results, or contact our support team.
                </p>
                <Button variant="outline" className="w-full bg-transparent border-gray-300 hover:bg-gray-50">
                  Get Help
                  <Info className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Latest Updates Card */}
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">What's New</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Discover the latest neighborhoods added to our database and new features we've launched.
                </p>
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 w-full font-semibold">
                  See Updates
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">🏙️ Popular Destinations</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore top Indian cities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover neighborhoods in India's most popular cities, each with unique characteristics and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                city: "Mumbai",
                neighborhoods: "12",
                highlight: "Financial Capital",
                image: "https://unsplash.com/photos/1iTKoFJvJ6E/download?force=true",
                description: "India's financial powerhouse with diverse neighborhoods."
              },
              {
                city: "Bangalore",
                neighborhoods: "10",
                highlight: "IT Hub",
                image: "https://unsplash.com/photos/2d4lAQAlbDA/download?force=true",
                description: "Tech-savvy city with modern residential areas."
              },
              {
                city: "Delhi",
                neighborhoods: "12",
                highlight: "Capital City",
                image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description: "Historic capital with modern developments."
              },
              {
                city: "Pune",
                neighborhoods: "8",
                highlight: "Cultural Hub",
                image: "https://images.unsplash.com/photo-1567898329001-c0fa9d1b1ca8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description: "Perfect blend of culture and modernity."
              }
            ].map((city) => (
              <Link
                key={city.city}
                href="/neighborhoods"
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <div className="relative h-64">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${city.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{city.city}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/40">
                        {city.highlight}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/40">
                        {city.neighborhoods} Neighborhoods
                      </Badge>
                    </div>
                    <p className="text-white/90">{city.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Your Journey */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-airbnb-500" />
                Your NeighborFit Journey
              </h2>

              <div className="space-y-4">
                <Card className="bg-white border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Account Created</h3>
                        <p className="text-gray-600 text-sm">Welcome to NeighborFit! Your journey begins here.</p>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Search className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">Ready for Quiz</h3>
                        <p className="text-gray-600 text-sm">
                          Take our lifestyle quiz to get personalized recommendations.
                        </p>
                      </div>
                      <Link href="/quiz">
                        <Button size="sm" className="bg-airbnb-500 hover:bg-airbnb-600 text-white">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-md opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-500">View Results</h3>
                        <p className="text-gray-400 text-sm">Complete the quiz to unlock your neighborhood matches.</p>
                      </div>
                      <div className="text-xs text-gray-400">Locked</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tips & Insights */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Zap className="h-6 w-6 text-yellow-500" />
                Tips & Insights
              </h2>

              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Pro Tip: Be Honest in Quiz</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          The more honest you are about your preferences, the better our AI can match you with
                          neighborhoods that truly fit your lifestyle.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Did You Know?</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Our data comes from official government sources including Census 2011, NCRB crime statistics,
                          and municipal reports for maximum accuracy.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Start with our lifestyle quiz, then explore the neighborhoods page to learn more about
                          different areas across India.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-airbnb-500 to-airbnb-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to find your perfect neighborhood?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Take our comprehensive lifestyle quiz and discover neighborhoods across India that match your unique
            preferences and lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button
                size="lg"
                className="bg-white text-airbnb-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-semibold shadow-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Take the Quiz Now
              </Button>
            </Link>
            <Link href="/neighborhoods">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-airbnb-600 px-8 py-4 text-lg rounded-full bg-transparent"
              >
                <Building className="mr-2 h-5 w-5" />
                Explore First
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Made by Deepanshu Maliyan, Galgotias University. Submitted to TrueState.
          </p>
        </div>
      </footer>
    </div>
  )
}
