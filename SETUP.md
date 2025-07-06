# NeighborFit Project Setup Guide

This guide will help you clone and run the NeighborFit project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **npm** (comes with Node.js) or **pnpm** (recommended)

## Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
git clone <your-github-repository-url>
cd NeigbourFitProject
```

Replace `<your-github-repository-url>` with the actual GitHub URL of this project.

## Step 2: Install Dependencies

Due to potential dependency conflicts and Windows symlink issues, we recommend using npm with legacy peer deps:

### Option 1: Using npm (Recommended for Windows)
```bash
npm install --legacy-peer-deps
```

### Option 2: Using pnpm (Alternative)
If you prefer pnpm, try:
```bash
pnpm install
```

**Note:** If you encounter symlink errors on Windows with pnpm, use the npm option above instead.

<!-- ## Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   (On Windows Command Prompt, use: `copy .env.example .env.local`)

2. Edit `.env.local` and fill in your environment variables:
   - Database connection strings
   - API keys
   - Other configuration values -->

<!-- ## Step 4: Set Up the Database (if applicable)

If this project uses a database, run the setup scripts:

```bash
# Run database setup script
node scripts/setup-database.sql

# Seed the database with sample data
node scripts/seed-indian-neighborhoods.sql
``` -->

## Step 5: Start the Development Server

Run the development server:

### Using npm:
```bash
npm run dev
```

### Using pnpm:
```bash
pnpm dev
```

## Step 6: Access the Application

Once the server starts successfully, you should see output similar to:

```
▲ Next.js 14.2.30
- Local:        http://localhost:3000
- Environments: .env.local
✓ Starting...
✓ Ready in [time]
```

Open your browser and navigate to: **http://localhost:3000**

## Troubleshooting

### Common Issues and Solutions

#### 1. Dependency Resolution Errors
If you get dependency conflicts:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 2. Symlink Issues on Windows (pnpm)
Use npm instead:
```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

#### 3. Port Already in Use
If port 3000 is busy, the server will automatically try port 3001, 3002, etc. Or you can specify a different port:
```bash
npm run dev -- -p 3001
```

#### 4. Environment Variable Issues
Make sure your `.env.local` file is properly configured with all required variables.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
NeigbourFitProject/
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                # Utility functions and configurations
├── public/             # Static assets
├── scripts/            # Database and utility scripts
├── styles/             # CSS styles
├── types/              # TypeScript type definitions
└── package.json        # Project dependencies and scripts
```

## Need Help?

If you encounter any issues during setup:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify your environment variables are set up properly
4. Check the console for any error messages

## Development Tips

- The development server supports hot reloading
- Changes to files will automatically refresh the browser
- Check the browser console and terminal for any errors
- Use the TypeScript compiler for type checking: `npm run type-check`

Happy coding! 🚀
