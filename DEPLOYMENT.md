# Aktivity OS — Deployment checklist

## Vercel project
Create a new Vercel project named `aktivity-os` using repository `Aktivity-com/aktivity-web`.

Settings:
- Framework Preset: Next.js
- Root Directory: `os`
- Production Branch: `main` after the OS branch is merged
- Preview branch during QA: `feature/aktivity-os`

## Environment variables
Configure in Preview and Production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Use the existing Aktivity Supabase project.

## Domain
After the first successful production deployment:
- Add `os.aktivity.com`
- Point the required DNS record to Vercel
- Keep the public web project separate from Aktivity OS

## Authentication
1. Create the first Supabase Auth user for the Aktivity administrator.
2. Copy its Auth User ID.
3. In `public.os_users`, link the default internal user to that Auth User ID.
4. Verify login and RLS access.
5. Do not enable public sign-up for Aktivity OS.

## Smoke test
- Login / logout
- Dashboard loads real Supabase data
- Create/edit Project
- Create/edit/complete/re-schedule Task
- Inbox -> Task conversion
- Create Organization
- Create Contact and link to Organization
- Create Opportunity + next action
- Move Opportunity through Pipeline
- Log CRM Activity + next action
- Review Admin pre-registrations
- Convert B2B lead to CRM
- Create/update Goal
- Weekly Agenda
- Mobile navigation

## Google Calendar
Only after the OS has a stable HTTPS domain:
1. Create/configure Google OAuth credentials.
2. Add the production callback URL under `os.aktivity.com`.
3. Implement Calendar connection.
4. Test create/update links from Aktivity tasks to Google Calendar.

## Release rule
Do not merge `feature/aktivity-os` into `main` until:
- Preview build passes
- smoke test passes
- login/RLS verified
- the public `aktivity-web` deployment remains unaffected
