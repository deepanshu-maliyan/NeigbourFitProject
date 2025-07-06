/**
 * Script to test and verify the enhanced matching algorithm
 * Run this after a user takes the quiz to verify scores are in the 40-95% range
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifyMatchingAlgorithm() {
  try {
    console.log('🔍 Verifying Enhanced Matching Algorithm...')

    // Check latest user results
    const { data: results, error: resultsError } = await supabase
      .from('user_results')
      .select('user_id, neighborhood_id, match_score, created_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (resultsError) {
      console.error('Error fetching results:', resultsError)
      return
    }

    if (!results || results.length === 0) {
      console.log('❌ No match results found. Please take the quiz first.')
      return
    }

    // Analyze score distribution
    const scores = results.map(r => r.match_score)
    const scoreAnalysis = {
      total: scores.length,
      min: Math.min(...scores),
      max: Math.max(...scores),
      average: scores.reduce((a, b) => a + b, 0) / scores.length,
      inTargetRange: scores.filter(s => s >= 40 && s <= 95).length,
      belowTarget: scores.filter(s => s < 40).length,
      aboveTarget: scores.filter(s => s > 95).length
    }

    console.log('\n📊 Score Distribution Analysis:')
    console.log(`Total Results: ${scoreAnalysis.total}`)
    console.log(`Score Range: ${scoreAnalysis.min}% - ${scoreAnalysis.max}%`)
    console.log(`Average Score: ${scoreAnalysis.average.toFixed(1)}%`)
    console.log(`In Target Range (40-95%): ${scoreAnalysis.inTargetRange} (${((scoreAnalysis.inTargetRange / scoreAnalysis.total) * 100).toFixed(1)}%)`)
    console.log(`Below Target (<40%): ${scoreAnalysis.belowTarget}`)
    console.log(`Above Target (>95%): ${scoreAnalysis.aboveTarget}`)

    // Check for recent users (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recentResults = results.filter(r => r.created_at > oneDayAgo)
    
    if (recentResults.length > 0) {
      console.log('\n🕐 Recent Results (Last 24 hours):')
      const recentScores = recentResults.map(r => r.match_score)
      console.log(`Recent Results: ${recentResults.length}`)
      console.log(`Recent Score Range: ${Math.min(...recentScores)}% - ${Math.max(...recentScores)}%`)
      console.log(`Recent Average: ${(recentScores.reduce((a, b) => a + b, 0) / recentScores.length).toFixed(1)}%`)
    }

    // Show sample results
    console.log('\n📋 Sample Latest Results:')
    const uniqueUsers = [...new Set(results.map(r => r.user_id))]
    uniqueUsers.slice(0, 3).forEach(userId => {
      const userResults = results.filter(r => r.user_id === userId)
      const topMatches = userResults.slice(0, 5)
      console.log(`\nUser ${userId.slice(0, 8)}... (${userResults.length} matches):`)
      topMatches.forEach((match, index) => {
        console.log(`  ${index + 1}. Neighborhood ${match.neighborhood_id}: ${match.match_score}%`)
      })
    })

    // Verification results
    console.log('\n✅ Algorithm Verification Results:')
    
    if (scoreAnalysis.inTargetRange === scoreAnalysis.total) {
      console.log('✅ PASSED: All scores are in the target range (40-95%)')
    } else {
      console.log('❌ FAILED: Some scores are outside the target range')
    }
    
    if (scoreAnalysis.min >= 40) {
      console.log('✅ PASSED: No discouraging low scores (<40%)')
    } else {
      console.log('❌ FAILED: Some scores are below 40%')
    }
    
    if (scoreAnalysis.max <= 95) {
      console.log('✅ PASSED: No unrealistic high scores (>95%)')
    } else {
      console.log('❌ FAILED: Some scores are above 95%')
    }

    if (scoreAnalysis.average >= 60 && scoreAnalysis.average <= 80) {
      console.log('✅ PASSED: Average score is in healthy range (60-80%)')
    } else {
      console.log(`⚠️  WARNING: Average score (${scoreAnalysis.average.toFixed(1)}%) is outside healthy range`)
    }

    console.log('\n🎯 Enhanced Matching Algorithm Status: ' + 
      (scoreAnalysis.inTargetRange === scoreAnalysis.total && 
       scoreAnalysis.min >= 40 && 
       scoreAnalysis.max <= 95 ? 'WORKING CORRECTLY' : 'NEEDS ATTENTION'))

  } catch (error) {
    console.error('❌ Error verifying matching algorithm:', error)
  }
}

verifyMatchingAlgorithm()
