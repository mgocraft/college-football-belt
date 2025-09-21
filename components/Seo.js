import Head from 'next/head';
import { useRouter } from 'next/router';

export const SITE_URL = 'https://collegefootballbelt.com';
export const SITE_NAME = 'College Football Belt';
const DEFAULT_TITLE = `${SITE_NAME} – The Lineal College Football Championship Tracker`;
const DEFAULT_DESCRIPTION =
  'Track the College Football Belt, follow upcoming matchups, and dive into the full history of the sport\'s lineal championship.';
const DEFAULT_IMAGE = '/images/fallback-helmet.png';

const toAbsoluteUrl = (value) => {
  if (!value) return `${SITE_URL}${DEFAULT_IMAGE}`;
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return `${SITE_URL}${value}`;
  return `${SITE_URL}/${value}`;
};

const sanitizePath = (value) => {
  if (!value) return '/';
  const path = value.startsWith(SITE_URL)
    ? value.replace(SITE_URL, '')
    : value;
  const withoutHash = path.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  if (!withoutQuery) return '/';
  return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
};

const formatTitle = (title) => {
  if (!title) return DEFAULT_TITLE;
  const normalized = title.toLowerCase();
  return normalized.includes(SITE_NAME.toLowerCase())
    ? title
    : `${title} | ${SITE_NAME}`;
};

const serializeStructuredData = (data) => {
  if (!data) return null;
  try {
    return JSON.stringify(data).replace(/</g, '\\u003c');
  } catch (error) {
    console.warn('Unable to serialize structured data for SEO', error);
    return null;
  }
};

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  structuredData,
}) {
  const router = useRouter();
  const path = canonicalPath ?? router?.asPath ?? '/';
  const canonical = `${SITE_URL}${sanitizePath(path)}`;
  const formattedTitle = formatTitle(title);
  const absoluteImage = toAbsoluteUrl(image);
  const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';
  const structuredDataJson = serializeStructuredData(structuredData);

  return (
    <Head>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robotsContent} />
      {structuredDataJson ? (
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredDataJson }}
        />
      ) : null}
    </Head>
  );
}
