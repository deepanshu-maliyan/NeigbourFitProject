/**
 * Script to check database state and existing match scores
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabaseState() {
  try {
    console.log('🔍 Checking database state...')

    // Check user preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('user_preferences')
      .select('user_id, created_at')

    if (prefsError) {
      console.error('Error fetching preferences:', prefsError)
    } else {
      console.log(`\n👤 User Preferences: ${preferences?.length || 0} records`)
      if (preferences && preferences.length > 0) {
        console.log('Sample users:', preferences.slice(0, 3).map(p => ({ user_id: p.user_id, created: p.created_at })))
      }
    }

    // Check user results (matches)
    const { data: results, error: resultsError } = await supabase
      .from('user_results')
      .select('user_id, neighborhood_id, match_score')
      .order('match_score', { ascending: false })

    if (resultsError) {
      console.error('Error fetching results:', resultsError)
    } else {
      console.log(`\n📊 User Results: ${results?.length || 0} records`)
      if (results && results.length > 0) {
        const uniqueUsers = new Set(results.map(r => r.user_id)).size
        const scoreRange = {
          min: Math.min(...results.map(r => r.match_score)),
          max: Math.max(...results.map(r => r.match_score)),
          avg: results.reduce((sum, r) => sum + r.match_score, 0) / results.length
        }
        console.log(`Unique users with matches: ${uniqueUsers}`)
        console.log(`Score range: ${scoreRange.min.toFixed(1)} - ${scoreRange.max.toFixed(1)} (avg: ${scoreRange.avg.toFixed(1)})`)
        console.log('Top 5 matches:', results.slice(0, 5).map(r => ({ 
          user: r.user_id.substring(0, 8) + '...', 
          neighborhood: r.neighborhood_id, 
          score: r.match_score 
        })))
      }
    }

    // Check neighborhoods
    const { data: neighborhoods, error: neighborhoodsError } = await supabase
      .from('neighborhoods')
      .select('id, name, safety_score, affordability_score')
      .limit(5)

    if (neighborhoodsError) {
      console.error('Error fetching neighborhoods:', neighborhoodsError)
    } else {
      console.log(`\n🏘️ Neighborhoods: ${neighborhoods?.length || 0} records (showing first 5)`)
      if (neighborhoods && neighborhoods.length > 0) {
        neighborhoods.forEach(n => {
          console.log(`  ${n.id}: ${n.name} (safety: ${n.safety_score}, affordability: ${n.affordability_score})`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the check
checkDatabaseState().then(() => {
  console.log('\n✅ Database check completed')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Check failed:', error)
  process.exit(1)
})
