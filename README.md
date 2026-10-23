# PrepClever

Responsive analytics landing page with Supabase authentication pages.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Auth routes:

- `http://localhost:3000/login`
- `http://localhost:3000/signup`

## Environment variables

Copy `.env.example` to `.env.local` and add the Supabase values:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
```

The Supabase URL and anon key are public browser values. The Turnstile secret is server-only and must never be prefixed with `NEXT_PUBLIC_` or committed.

## Supabase setup

Authentication is temporarily disabled by default so the onboarding flow can be developed independently. Keep this value in `.env.local`:

```text
NEXT_PUBLIC_AUTH_ENABLED=false
```

When Supabase authentication is ready, set it to `true` and restart the development server:

```text
NEXT_PUBLIC_AUTH_ENABLED=true
```

With authentication disabled, `/login` and `/signup` open the onboarding flow directly. The Supabase auth implementation remains in place.

1. Create or open a project at `https://supabase.com/dashboard`.
2. Copy the project URL and anon key from Project Settings > API into `.env.local`.
3. In Authentication > Providers, enable:
   - Google
   - Email/password
4. In Authentication > URL Configuration, set:
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://your-domain.com/auth/callback`
5. In Google Cloud Console, add the Supabase callback URL shown in Supabase's Google provider settings to the OAuth client's authorized redirect URIs.
6. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in local and production environments.

The app redirects OAuth results to your own `/auth/callback` route and exchanges the code for a Supabase session there.

### Removing the Supabase hostname from the OAuth address bar

There are two different URLs involved:

- The Google provider must redirect to Supabase's callback endpoint. This normally contains `https://<project-ref>.supabase.co/auth/v1/callback`.
- After authentication, the app redirects back to your domain at `/auth/callback`.

To remove the `supabase.co` hostname from the provider redirect itself, enable Supabase Custom Domains for the project and use the resulting auth domain in the Google provider configuration. A normal DNS alias or changing only `redirectTo` cannot remove the Supabase callback hostname.

## Cloudflare Turnstile setup

1. Open the Cloudflare dashboard and go to Turnstile.
2. Create a widget for the application.
3. Add `localhost` and the production hostname to the widget hostnames.
4. Copy the site key into `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
5. Copy the secret key into `CLOUDFLARE_TURNSTILE_SECRET_KEY`.
6. Set both values in the local and production environments.

The browser renders Turnstile on the auth forms. The server route at `/api/turnstile/verify` sends the token to Cloudflare using the secret key. Production requests fail closed when the token or secret is missing. Local development bypasses verification only when no Turnstile site key is configured.

## Validate

```bash
pnpm lint
pnpm build
pnpm start
```

The production build includes the static landing page, `/login`, `/signup`, and the dynamic `/api/turnstile/verify` route.
