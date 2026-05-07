# Forge

Forge is an AI second brain for solo builders. Users paste messy project thoughts, and the AI converts them into structured execution plans.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase (PostgreSQL)
- Gemini API (AI Generation)
- Framer Motion (Animations)

## Local Development

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your `.env.local` file with the required environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. Run the Supabase SQL schema setup in your Supabase project (see `supabase.sql`).

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. In the environment variables section on Vercel, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Click Deploy!
