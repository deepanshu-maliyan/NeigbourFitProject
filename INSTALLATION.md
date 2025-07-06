# NeighborFit Installation Guide

## Prerequisites

- **Node.js 18+** - JavaScript runtime
- **pnpm** - Fas### 3. Test Application Flow
1. **Signup/Login**: Create account or sign in
2. **Take Quiz**: Complete all 13 questions
3. **View Results**: See neighborhood matches with meaningful percentages
4. **Retake Quiz**: Change preferences and see updated resultssk space efficient package manager
- **Supabase account** - Backend-as-a-Service for database and auth
- **Git** - Version control

## Installation Steps

### 1. Clone Repository & Install Dependencies
```bash
git clone [repository-url]
cd neighborfit
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Getting Supabase Credentials:**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API
4. Copy Project URL and Public anon key
5. Copy Service role key (for admin operations)

### 3. Database Setup

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to Supabase Dashboard > SQL Editor
2. Run these scripts in order:
   ```sql
   -- 1. Setup tables and RLS policies
   -- Copy and run: scripts/setup-database.sql
   
   -- 2. Add neighborhood data
   -- Copy and run: scripts/seed-indian-neighborhoods.sql
   
   -- 3. Verify setup (optional)
   -- Copy and run: scripts/verify-database-structure.sql
   ```

#### Option B: Using Scripts (Advanced)
```bash
# Check database connection
node scripts/check-database-service-role.js

# Verify everything is working
node scripts/verify-database-structure.sql
```

### 4. Start Development Server
```bash
pnpm dev
```

The application will start on:
- Primary: `http://localhost:3000`
- If port is busy, automatically tries: 3001, 3002, 3003, etc.

### 5. First Time Setup
1. Visit the application in your browser
2. Create a new account using the signup form
3. Take the lifestyle quiz (13 questions)
4. View your personalized neighborhood matches

## Project Structure

```
neighborfit/
├── app/                    # Next.js app router pages
│   ├── auth/              # Login/signup pages
│   ├── quiz/              # Lifestyle assessment
│   ├── results/           # Match results
│   └── neighborhoods/     # Browse all neighborhoods
├── components/            # Reusable UI components
├── lib/                   # Core business logic
│   ├── database.ts       # Matching algorithm & DB operations
│   ├── supabase/         # Database client configuration
│   └── quiz-questions.ts # Quiz questions data
├── scripts/               # Database setup scripts
├── types/                 # TypeScript type definitions
└── .env.local            # Environment variables (you create this)
```

## Verification Steps

### 1. Check Database Connection
```bash
node scripts/check-database-service-role.js
```
Should show:
- User Preferences: 0+ records
- User Results: 0+ records  
- Neighborhoods: 42 records

### 2. Test Application Flow
1. **Signup/Login**: Create account or sign in
2. **Take Quiz**: Complete all 13 questions
3. **View Results**: See neighborhood matches with 40-95% scores
4. **Retake Quiz**: Change preferences and see updated results

### 3. Check Logs
Monitor terminal for any errors during development:
```bash
# Development server logs
pnpm dev

# Check for database operation logs
# Look for: "Enhanced match scores", "Successfully saved match results"
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```
⚠ Port 3000 is in use, trying 3001 instead.
```
**Solution**: This is normal. The app will find an available port automatically.

#### Database Connection Errors
```
Error: Invalid JWT / Authentication failed
```
**Solutions**:
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is active
3. Ensure RLS policies are properly set up

#### Low Match Scores
```
Users seeing very low percentages
```
**Solution**: 
1. Clear browser cache
2. Retake the quiz to trigger new calculations
3. Check terminal logs for any algorithm errors

#### Build Errors
```
Module not found or compilation errors
```
**Solutions**:
1. Delete `node_modules` and run `pnpm install`
2. Check Node.js version (requires 18+)
3. Ensure all dependencies are properly installed

### Advanced Troubleshooting

#### Database Debugging
```bash
# Check database state with service role access
node scripts/check-database-service-role.js

# View all tables and data
# Use Supabase Dashboard > Table Editor
```

#### Clear User Data (Development)
```sql
-- Run in Supabase SQL Editor
DELETE FROM user_results WHERE user_id = 'your_user_id';
DELETE FROM user_preferences WHERE user_id = 'your_user_id';
```

#### Reset Database (Development)
```bash
# Re-run setup scripts in Supabase SQL Editor
# 1. scripts/setup-database.sql (recreates tables)
# 2. scripts/seed-indian-neighborhoods.sql (re-adds data)
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Production Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## Getting Help

If you encounter issues:

1. **Check Logs**: Review terminal output for error messages
2. **Verify Environment**: Ensure all environment variables are set correctly
3. **Database State**: Use `check-database-service-role.js` to verify data
4. **Clear Cache**: Clear browser cache and restart development server
5. **Documentation**: Review `README.md` and `MATCHING_ALGORITHM.md`

## Success Indicators

Your installation is successful when:
- ✅ Development server starts without errors
- ✅ Database connection script shows 42 neighborhoods
- ✅ User signup/login works
- ✅ Quiz saves preferences
- ✅ Results show meaningful match scores
- ✅ Retaking quiz updates scores appropriately

---

For detailed technical information, see [README.md](README.md) and [MATCHING_ALGORITHM.md](MATCHING_ALGORITHM.md).