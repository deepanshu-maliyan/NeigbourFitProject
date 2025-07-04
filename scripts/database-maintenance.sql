-- Database maintenance and optimization script

-- Analyze tables to update statistics
ANALYZE neighborhoods;
ANALYZE user_preferences;
ANALYZE user_results;

-- Vacuum tables to reclaim space
VACUUM neighborhoods;
VACUUM user_preferences;
VACUUM user_results;

-- Check for any orphaned records (shouldn't be any with proper foreign keys)
-- This is just for verification
SELECT 
    'Orphaned user_preferences' as issue,
    COUNT(*) as count
FROM user_preferences up
LEFT JOIN auth.users au ON up.user_id = au.id
WHERE au.id IS NULL

UNION ALL

SELECT 
    'Orphaned user_results' as issue,
    COUNT(*) as count
FROM user_results ur
LEFT JOIN auth.users au ON ur.user_id = au.id
WHERE au.id IS NULL

UNION ALL

SELECT 
    'Invalid neighborhood references' as issue,
    COUNT(*) as count
FROM user_results ur
LEFT JOIN neighborhoods n ON ur.neighborhood_id = n.id
WHERE n.id IS NULL;

-- Check data quality
SELECT 
    'Neighborhoods with missing data' as check_type,
    COUNT(*) as count
FROM neighborhoods 
WHERE description IS NULL 
    OR description = '' 
    OR image_url IS NULL 
    OR image_url = '';

-- Show database size information
SELECT 
    pg_size_pretty(pg_total_relation_size('neighborhoods')) as neighborhoods_size,
    pg_size_pretty(pg_total_relation_size('user_preferences')) as user_preferences_size,
    pg_size_pretty(pg_total_relation_size('user_results')) as user_results_size;
