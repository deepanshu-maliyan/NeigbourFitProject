# NeighborFit - Neighborhood Discovery Platform

## Project Overview
NeighborFit is a full-stack web application that helps users discover neighborhoods matching their lifestyle preferences. Built with modern web technologies and an advanced matching algorithm, this platform provides users with meaningful neighborhood recommendations based on their personal priorities.

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Server Actions + Client Hooks
- **Form Handling**: React Hook Form + Zod Validation

### Backend
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT
- **API Layer**: Next.js Server Actions
- **Data Processing**: Server-side TypeScript
- **Caching**: Next.js Cache

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: pnpm
- **Type Safety**: TypeScript
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Next.js Build System

## Core Features

### 1. **User Authentication**
   - Secure signup/login flow with Supabase Auth
   - JWT-based session management
   - Protected routes with middleware
   - Row Level Security (RLS) for data isolation

### 2. **Interactive Quiz System**
   - 13 lifestyle factors assessment
   - Dynamic question rendering with progress tracking
   - Real-time form validation
   - State persistence across sessions

### 3. **Advanced Matching Algorithm**
   - **Intelligent Scoring System**: Produces meaningful match percentages (40-95% range)
   - **Weighted Preferences**: User importance ratings directly influence results
   - **Top Match Enhancement**: Best matches receive additional boost for better UX
   - **Smart Normalization**: Converts raw scores to user-friendly percentages

### 4. **Neighborhood Data Management**
   - **Comprehensive Scoring**: 13 factors per neighborhood (0-10 scale)
   - **Government Data Integration**: Based on official statistics
   - **Multi-City Coverage**: Indian metropolitan areas
   - **Rich Metadata**: Images, descriptions, location details

### 5. **Results & Recommendations**
   - **Personalized Rankings**: Sorted by compatibility score
   - **Detailed Neighborhood Profiles**: Complete factor breakdown
   - **Interactive Interface**: Easy comparison and exploration
   - **Retake Capability**: Updated results with new preferences

## Matching Algorithm

### Technical Implementation:
```typescript
// Algorithm produces meaningful percentages with base score system
const baseScore = 40 // Minimum match percentage
const variableScore = 55 // Maximum additional score (40 + 55 = 95% max)

let matchScore = baseScore
if (totalImportanceWeight > 0) {
  const normalizedMatch = totalWeightedScore / totalImportanceWeight
  matchScore = baseScore + (normalizedMatch × variableScore)
}

// Top 10 matches receive additional boost
if (index < 10) {
  const boost = (10 - index) × 2
  enhancedScore = Math.min(enhancedScore + boost, 95)
}
```

## Database Architecture

### Core Tables:
- **neighborhoods**: Neighborhood data with 13 scored factors
- **user_preferences**: User importance ratings for each factor
- **user_results**: Calculated match scores with neighborhood details
- **auth.users**: Supabase authentication (built-in)

### Key Features:
- **Row Level Security**: Users can only access their own data
- **Unique Constraints**: Prevents duplicate user-neighborhood pairs
- **Optimized Queries**: Efficient joins and indexing
- **Data Validation**: Check constraints on score ranges

## Performance Optimizations

1. **Server-Side Rendering**: Optimal loading performance
2. **Database Optimization**: Efficient queries with proper indexing
3. **Batch Processing**: All neighborhood calculations in single operation
4. **Caching Strategy**: Results cached until user retakes quiz
5. **Lazy Loading**: Components loaded on demand

## Quick Start

### 1. Setup
```bash
git clone [repository-url]
cd neighborfit
pnpm install
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Database Setup
Run the SQL scripts in Supabase SQL Editor:
1. `scripts/setup-database.sql` - Create tables and RLS policies
2. `scripts/seed-indian-neighborhoods.sql` - Add neighborhood data
3. `scripts/verify-database-structure.sql` - Verify setup

### 4. Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure
```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── quiz/              # Quiz interface
│   ├── results/           # Match results display
│   └── neighborhoods/     # Neighborhood browser
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── forms/            # Form components
├── lib/                   # Core utilities and business logic
│   ├── database.ts       # Database operations & matching algorithm
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── styles/                # Global styles
└── scripts/               # Database setup and maintenance
```

## Development Practices

### Code Quality
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Handling**: Graceful error recovery at all levels
- **Input Validation**: Client and server-side validation
- **Code Documentation**: Detailed comments and documentation

### Architecture
- **Clean Architecture**: Separation of concerns
- **Modular Design**: Reusable components and functions
- **Server Actions**: Type-safe server-side operations
- **Responsive Design**: Mobile-first approach

### Security
- **Authentication**: Secure JWT-based sessions
- **Authorization**: Row Level Security policies
- **Input Sanitization**: XSS and injection protection
- **Environment Variables**: Secure credential management

## Algorithm Features

### Scoring System
- **Score Range**: All matches fall between 40-95%
- **Weighted Calculation**: User preferences directly influence results
- **Top Match Boosting**: Best neighborhoods receive additional enhancement
- **Natural Distribution**: Slight randomization prevents identical scores

### Database Reliability
- **Upsert Operations**: Prevents duplicate key errors
- **Graceful Fallbacks**: Handles database conflicts
- **Comprehensive Logging**: Detailed error reporting and monitoring
- **Service Role Access**: Admin-level database operations when needed

## Future Enhancements
1. **Testing Suite**: Unit and integration tests
2. **Analytics Integration**: User behavior tracking
3. **Mobile App**: React Native implementation
4. **Additional Cities**: Expanded geographical coverage
5. **Machine Learning**: Advanced recommendation engine

## Contact

**Deepanshu Maliyan**  
Galgotias University  
B.Tech Computer Science Engineering  

---

© 2025 NeighborFit. Advanced neighborhood discovery platform with intelligent matching algorithm.
