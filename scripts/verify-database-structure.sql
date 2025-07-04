-- Verify database structure after cleanup

-- Show all tables in the public schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Show all columns for our main tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('neighborhoods', 'user_preferences', 'user_results')
ORDER BY table_name, ordinal_position;

-- Show all indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Show all RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Show table sizes (after data is inserted)
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
    AND tablename IN ('neighborhoods', 'user_preferences', 'user_results')
ORDER BY tablename, attname;

-- Count records in each table
SELECT 
    'neighborhoods' as table_name, 
    COUNT(*) as record_count 
FROM neighborhoods
UNION ALL
SELECT 
    'user_preferences' as table_name, 
    COUNT(*) as record_count 
FROM user_preferences
UNION ALL
SELECT 
    'user_results' as table_name, 
    COUNT(*) as record_count 
FROM user_results;
