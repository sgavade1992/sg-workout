# SG Workout — Backend Setup Guide

## Architecture

```
Browser (index.html / workout.html)
        ↕  Supabase JS SDK
Supabase (auth + database)
  ├── Auth: email/password + Google OAuth
  └── Database: PostgreSQL with RLS
        └── user_data table (one row per user, JSONB)
```

Each user's entire progress is stored as a single JSONB blob in `user_data.data`.
Row Level Security (RLS) ensures users can only ever access their own row.

---

## Step 1 — Create Supabase project

1. Go to **supabase.com** → Sign in → **New project**
2. Name it `sg-workout` (or anything)
3. Choose a region close to you
4. Click **Create project** (takes ~2 min to spin up)
5. Go to **Project Settings → API**
6. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

---

## Step 2 — Run the database setup SQL

1. In your Supabase project → **SQL Editor** → **New query**
2. Paste the entire contents of **`supabase-setup.sql`**
3. Click **Run**
4. You should see: `Success. No rows returned`

---

## Step 3 — Enable Google OAuth (optional)

1. Supabase Dashboard → **Authentication → Providers → Google**
2. Toggle **Enable Google provider**
3. Go to [console.cloud.google.com](https://console.cloud.google.com)
4. Create a project → APIs & Services → Credentials → OAuth 2.0 Client IDs
5. Authorized redirect URIs: `https://xxxx.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret back to Supabase

---

## Step 4 — Add your credentials to the app

Open **both** `index.html` and `js/supabase-backend.js`.
Find these two lines and replace with your values:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';      // e.g. https://xxxx.supabase.co
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g. eyJhbGci...
```

They appear in:
- `index.html` → in the `<script>` block near the bottom
- `js/supabase-backend.js` → lines 1–2

---

## Step 5 — Deploy to GitHub Pages

1. Create a GitHub repo (e.g. `sg-workout`)
2. Upload **all files** (keep folder structure):
   ```
   index.html           ← landing / login page
   workout.html         ← main app
   manifest.json
   icon-192.png
   icon-512.png
   css/style.css
   js/app.js
   js/data.js
   js/render.js
   js/builder.js
   js/supabase-backend.js
   data/progress.json   ← keep as {} (not used by Supabase version)
   supabase-setup.sql   ← only needed for setup, safe to include
   ```
3. Repo **Settings → Pages → Source: main branch / root**
4. Site live at: `https://yourusername.github.io/sg-workout/`
5. The root `index.html` is the login page — users land here first

---

## How it works after deployment

```
User visits https://yourusername.github.io/sg-workout/
        ↓
index.html checks Supabase session
  → Not logged in? Show login/signup form
  → Already logged in? Redirect to workout.html instantly

User signs in / creates account
        ↓
workout.html loads
  → Checks session (redirects to index.html if expired)
  → Loads user's data from Supabase user_data table
  → User sees their personal dashboard, calendar, progress

User logs a session / checks exercise
        ↓
Data auto-saves to Supabase (1.5s debounce)
  → Also saved to localStorage as offline fallback
  → Real-time listener updates other open tabs/devices
```

---

## User data structure (stored in user_data.data)

```json
{
  "logs": [...],           // session log entries
  "wkDone": {},            // exercise checklist state
  "exNotes": {},           // per-exercise notes
  "benchDone": {},         // benchmark checkboxes
  "bodyWeight": [...],     // weight tracking
  "programStart": "2025-01-01",
  "activeProgram": "hyrox",
  "customPlan": null        // user's custom builder plan
}
```

---

## Supabase free tier limits
- 50,000 monthly active users
- 500MB database storage
- Unlimited API requests
- 2 free projects

More than enough for personal use + family/friends.
