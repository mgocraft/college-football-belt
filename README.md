This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Advertising configuration

The site now uses AdSense exclusively for its display inventory. The script loads automatically on eligible routes, so no extra markup is required—drop an `<AdSlot>` component anywhere in the UI and it will hydrate into a responsive `<ins class="adsbygoogle">` unit once Google finishes bootstrapping.

If you need to temporarily suppress ads (for example in preview environments) set the following environment variable:

```
NEXT_PUBLIC_ADSENSE_ENABLED="false" # disable AdSense globally
```

Any other value, including leaving the variable undefined, enables AdSense. When disabled, `<AdSlot>` returns `null` and no script is requested.

To point the site at your own AdSense account, set the publisher ID (with or without the `ca-` prefix):

```
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID="ca-pub-1234567890"
```

Also update `public/ads.txt` with the matching publisher ID (`pub-...`) so AdSense can verify your authorized seller record at `https://your-domain.com/ads.txt`.

## Newsletter signup

The site includes an email newsletter powered by [Mailchimp](https://mailchimp.com). To enable the signup form, set the following environment variables:

```
MAILCHIMP_API_KEY="your_api_key"
MAILCHIMP_SERVER_PREFIX="usX"      # e.g. us21
MAILCHIMP_LIST_ID="list_id"
```

These values allow the `/api/subscribe` endpoint to add addresses to your audience list.
