# Contributing to the Civic Tech DC Employment Platform

Thanks for contributing! This doc covers everything you need to get started.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.9.0
- A [Supabase](https://supabase.com/) account
- A [GitHub](https://github.com/) account (used for sign-in)

## Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/civictechdc/employment-platform.git
   cd employment-platform
   ```

2. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the `web/` directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these in your Supabase dashboard under **Settings → API**.

4. **Set up the database**

   Run the following SQL files in order in the Supabase SQL editor:
   - `supabase/schema.sql` — base schema
   - `supabase/seed.sql` — sample data (optional)
   - `supabase/phase2_auth.sql` — auth, RLS policies, and RPC functions

5. **Start the dev server**
   ```bash
   npm run dev
   ```

   The app will be running at `http://localhost:3000`.

## Workflow

This project uses a **pull request workflow**. Direct pushes to `main` are not allowed.

1. **Create a branch** for your work
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Use a descriptive prefix:
   - `feature/` — new functionality
   - `fix/` — bug fixes
   - `chore/` — maintenance, dependencies, config

2. **Make your changes** and commit them with a clear message
   ```bash
   git commit -m "Add hamburger menu for mobile header"
   ```

3. **Push your branch** and open a pull request against `main`
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Get a review** — at least one approval is required before merging

5. **Merge** once approved — use **Squash and merge** to keep the history clean

## Project Structure

```
employment-platform/
├── supabase/          # SQL schema, seed data, and migrations
└── web/               # Next.js app
    └── src/
        ├── app/       # Pages and routes (Next.js App Router)
        ├── components/ # Shared UI components
        └── lib/       # Supabase clients, types, and utilities
```

## Key Docs

- [`VISION.md`](./VISION.md) — product vision, feature phases, and open questions
- [`DATA_MODEL.md`](./DATA_MODEL.md) — database schema and relationships

## Questions?

Join the [Civic Tech DC Slack](https://www.civictechdc.org/slack) and find us there.
