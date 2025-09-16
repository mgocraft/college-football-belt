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

This project can display either Google AdSense units or a fallback Amazon affiliate banner.

Set the following environment variable to control which network is used:

```
NEXT_PUBLIC_ADSENSE_ENABLED="true" # use AdSense; any other value shows the Amazon banner
```

Enable this flag only after your AdSense account and the site have been approved. Once the flag is set to `"true"`, the AdSense script is injected dynamically and `<AdSlot>` components will render AdSense `<ins class="adsbygoogle">` slots. When the flag is not `"true"`, `<AdSlot>` instead renders the Amazon affiliate banner.

### Amazon Product Advertising API

The Amazon banner uses the Product Advertising API to fetch product details. Provide the following credentials in your environment for the `/api/amazon-ads` endpoint:

```
AMAZON_ACCESS_KEY="your_access_key"
AMAZON_SECRET_KEY="your_secret_key"
AMAZON_ASSOCIATE_TAG="yourtag-20"
AMAZON_ASINS="B0D8KTKMQW,B00W5VNB80,B07QYCVT29,XXXXXXXXXX"
```

Set `AMAZON_ASINS` to a comma-separated list (up to six entries) of ASINs you want to feature for the current week's Belt matchup. The example above uses the ASINs for the Florida Gators wall art, Miami Hurricanes necklace, and fantasy football belt links that ship with this project—replace `XXXXXXXXXX` with the ASIN behind your shortened URL. The banner calls Amazon's `GetItems` endpoint to retrieve the latest product title, hero image, and price for each ASIN so the creative stays compliant with Amazon's 24-hour pricing freshness requirement. If the API request fails or no ASINs are configured, the banner now simply displays a reminder to check back later instead of rendering stale fallback products.

## Newsletter signup

The site includes an email newsletter powered by [Mailchimp](https://mailchimp.com). To enable the signup form, set the following environment variables:

```
MAILCHIMP_API_KEY="your_api_key"
MAILCHIMP_SERVER_PREFIX="usX"      # e.g. us21
MAILCHIMP_LIST_ID="list_id"
```

These values allow the `/api/subscribe` endpoint to add addresses to your audience list.
