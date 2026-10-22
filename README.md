# PrepClever

Responsive analytics landing page with screenshot-matched Firebase authentication pages.

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

Copy `.env.example` to `.env.local` and add the Firebase web app values:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
```

Firebase browser configuration values are public by design. The Turnstile secret is server-only and must never be prefixed with `NEXT_PUBLIC_` or committed.

## Firebase setup

1. Create or open a Firebase project at `https://console.firebase.google.com`.
2. Add a Web app and copy its configuration into `.env.local`.
3. In Authentication > Sign-in method, enable:
   - Google
   - Email/password
   - Phone
4. In Authentication > Settings > Authorized domains, add `localhost` and the production hostname.
5. For phone auth, use Firebase test phone numbers during development. Firebase phone auth uses its own reCAPTCHA verifier in addition to Cloudflare Turnstile.
6. Add the production domain to the OAuth consent/configuration settings required by Google.

Without Firebase values, the pages still render and show a configuration error when an auth action is attempted.

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
