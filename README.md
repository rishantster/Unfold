# Unfold

A deliberately simple personal networking page: Google sign-in, one form, one public link, done.

## Set up (about 5 minutes)

1. Create a free [Supabase](https://supabase.com) project.
2. Open **SQL Editor** and run `supabase/migrations/001_profiles.sql`.
3. In **Authentication → Providers**, enable Google and add the Google client ID and secret.
4. In Google Cloud, add `https://YOUR_PROJECT.supabase.co/auth/v1/callback` as an authorised redirect URI.
5. Copy `.env.example` to `.env.local` and add the Project URL and anon key from **Project Settings → API**.
6. In Supabase **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` (and your production equivalent) to Redirect URLs.

```bash
npm install
npm run dev
```

Deploy to Vercel and add the same three environment variables. The database uses row-level security: profiles are publicly readable, while only their owner can create or edit them.
