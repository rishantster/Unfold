# Unfold

A deliberately simple personal networking page: passwordless email sign-in, one form, one public link, done.

## Set up (about 5 minutes)

1. Create a free [Supabase](https://supabase.com) project.
2. Open **SQL Editor** and run `supabase/migrations/001_profiles.sql`.
3. Copy `.env.example` to `.env.local` and add the Project URL and anon key from **Project Settings → API**.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to Redirect URLs.
5. That is all: Supabase Email authentication is enabled by default. Users receive a passwordless magic link, so no Google Cloud project, OAuth consent screen, client ID, or client secret is required.

```bash
npm install
npm run dev
```

Deploy to Vercel and add the same three environment variables. Change `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL to the production address, then add `https://YOUR_DOMAIN/auth/callback` to Redirect URLs. The database uses row-level security: profiles are publicly readable, while only their owner can create or edit them.

## What Supabase handles

- Passwordless email authentication and sessions
- The hosted Postgres database
- Unique public profile handles
- Row-level security so a user can only edit their own profile

No Google configuration or separate backend server is needed.
