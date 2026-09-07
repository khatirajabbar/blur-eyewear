# BLUR

BLUR is a fictional experimental eyewear store made for a school final. It treats eleven sculptural frames as editorial characters, combining a minimal e-commerce interface with a campaign film.

## What is included

- Next.js App Router, TypeScript, and an art-directed responsive interface
- Eleven local product and campaign images, with a visual fallback if an image cannot load
- Persistent cart, language (English, Azerbaijani, Russian), and USD/AZN display preference
- Supabase email/password accounts and a role-protected orders admin area
- Stripe-hosted **test** checkout — card details never touch this application
- A Film page that accepts a YouTube link through Vercel environment settings

All product prices are authored in USD. AZN is a display conversion using the manually configured demo rate in `lib/currency.ts`; Stripe test checkout is charged in USD.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Run these before deploying:

```bash
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` locally, then add the same values in **Vercel → Project → Settings → Environment Variables** for Production (and Preview if desired).

| Variable | Where it is used | Safe to expose? |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Checkout return URLs and site metadata | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase browser connection | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase browser connection | Yes |
| `NEXT_PUBLIC_CAMPAIGN_YOUTUBE_URL` | Film page embed | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Secure server-side order webhook only | **No** |
| `STRIPE_SECRET_KEY` | Secure server-side Checkout session creation | **No** |
| `STRIPE_WEBHOOK_SECRET` | Verifies genuine Stripe webhooks | **No** |

An older Supabase project may provide an anon key instead of a publishable key; use `NEXT_PUBLIC_SUPABASE_ANON_KEY` only in that case. Never put a service-role key or Stripe secret in a `NEXT_PUBLIC_` variable, source file, Git commit, or browser console.

## Supabase setup

1. Create a new Supabase project and copy its project URL plus public publishable key into the variables above.
2. In **Authentication → URL Configuration**, add your Vercel URL as the Site URL and add these Redirect URLs:
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` for local work
3. Open the Supabase SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates profiles, orders, order items, row-level security policies, and the admin role helper.
4. Register the email address that will be the admin account, then run the commented one-line promotion query at the end of that SQL file with that exact email address.

Customer accounts can read only their own orders. The service role is used only inside secure server routes/webhooks to record paid test orders.

## Stripe test checkout

1. In Stripe, turn on **Test mode** and copy the secret key beginning with `sk_test_` into `STRIPE_SECRET_KEY`.
2. Create a webhook endpoint at:

   ```text
   https://YOUR-VERCEL-DOMAIN.vercel.app/api/stripe/webhook
   ```

   Subscribe to `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
3. Redeploy after changing Vercel environment values.
4. On the site, make an account, add an item to the cart, and choose **secure test checkout**. Stripe’s standard successful test card is `4242 4242 4242 4242`, with any future expiry date and any three-digit CVC.

Stripe Checkout is hosted by Stripe, which is why the store does not collect or retain card numbers. A paid session clears the local cart after the confirmation page verifies that the session belongs to the signed-in customer.

## Campaign film

Upload the final edit to YouTube, then set `NEXT_PUBLIC_CAMPAIGN_YOUTUBE_URL` to its normal watch or share URL in Vercel. The Film page uses YouTube’s privacy-enhanced embed domain and shows a designed placeholder until the URL is set. Keep the YouTube visibility set to Unlisted or Public so a visitor can play it.

## Content and project structure

```text
app/                 Routes, checkout and auth endpoints
components/          Shared interface, product, cart, account, and campaign UI
data/products.ts     All 11 product records and their local asset paths
lib/currency.ts      Manual demo conversion rates and formatting
lib/supabase/        Supabase browser/server helpers
store/               localStorage-persisted cart, currency, and language state
supabase/schema.sql  Database schema and row-level security setup
public/looks/        Campaign model images
public/products/     Product renders
```

To change a product, edit `data/products.ts`; prices remain USD there. To change the visible AZN conversion, edit `lib/currency.ts`. The image files are local public assets, so campaigns do not depend on an external image host.

## Deploying to Vercel

1. Push the repository to GitHub and import it into Vercel as a Next.js project.
2. Add the environment variables from `.env.example` in Vercel. Use your real deployed URL for `NEXT_PUBLIC_SITE_URL`, without a trailing slash.
3. Run the Supabase SQL schema, configure the Supabase redirect URLs, and promote the chosen admin email.
4. Configure the Stripe test webhook if test checkout is being demonstrated.
5. Add the YouTube link, redeploy, and visit `/film` to confirm the embed plays.
6. Test this visitor flow on the Vercel URL: change language/currency → add a frame → see the cart toast → sign in → complete Stripe test checkout → land on confirmation with an empty cart.

BLUR is an educational fictional brand. Use only Stripe test keys and test cards for the school presentation; no live payments, live inventory, or live exchange rates are claimed.
