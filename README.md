# BLUR

BLUR is a fictional experimental eyewear e-commerce project made as a school final. It studies the space between seeing and being seen through sculptural eyewear, frosted interfaces, soft distortion, and editorial product placement.

## Stack

- Next.js with the App Router and TypeScript
- Tailwind CSS for the base setup, with an art-directed global CSS system
- React Context + localStorage for cart and currency persistence
- Local centralized product data

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run build
```

## Stripe test mode (Milestone 2)

Copy `.env.example` to `.env.local` and add a Stripe **test-mode** secret key:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit `.env.local` or any secret key. Stripe Checkout is deliberately not implemented in Milestone 1; the route at `/api/checkout` currently returns a clear placeholder response.

## Project structure

```text
app/                 Routes and API route shell
components/          Shared visual, homepage, cart, and product components
data/products.ts     All 20 product records
lib/currency.ts      Demo exchange rates and currency formatting
store/               localStorage-persisted cart and currency state
public/brand/        Place blur-logo.png here when available
public/products/     Product renders (see paths in product data)
public/campaign/     Campaign video assets
```

## Adding visual assets

Product image paths are already prepared in `data/products.ts`, for example:

```text
public/products/blr-001/hero.webp
public/products/blr-001/01.webp
public/products/blr-001/02.webp
public/products/blr-001/model.webp
```

Until final renders arrive, the site uses purpose-built CSS object studies rather than broken images. The homepage and shop will continue to work when final assets are added in Milestone 2.

Campaign videos should go in `public/campaign/`, such as `01.mp4`, `02.mp4`, and so on. The reusable video observer and playback behavior are also planned for Milestone 2.

## Content and currencies

Edit `data/products.ts` to change products, product fields, prices, colors, and future rotation/lens-preview paths. All prices are stored in USD. Update manually configured demonstration exchange rates in `lib/currency.ts`; they are not live rates.

## Deploying to Vercel

1. Push this project to a private or public GitHub repository.
2. Import it into Vercel as a Next.js project.
3. Add `STRIPE_SECRET_KEY` only when Stripe Checkout is implemented; keep it server-side and use a Stripe test key. Set `NEXT_PUBLIC_SITE_URL` to the deployed Vercel URL when the app needs it.
4. Deploy.

BLUR is an educational fictional brand; it does not process live payments or claim live stock/rates.
