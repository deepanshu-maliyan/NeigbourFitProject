# NeighborFit Installation Guide

## Prerequisites

- Node.js 18+
- pnpm
- Supabase account
- Git

## Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/neighborfit.git
   cd neighborfit
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Database Setup**
   - Go to Supabase Dashboard > SQL Editor
   - Run these scripts in order:
     1. `scripts/cleanup-database.sql`
     2. `scripts/setup-database.sql`
     3. `scripts/seed-indian-neighborhoods.sql`

4. **Start Development Server**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:3000` in your browser

## Troubleshooting

- **Port in Use**: The app will automatically try ports 3000-3004
- **Database Connection**: Ensure Supabase credentials are correct in `.env.local`
- **Build Errors**: Run `pnpm install` to ensure all dependencies are installed

For more details, check the [README.md](README.md).