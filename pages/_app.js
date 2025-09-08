// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Footer from "../components/Footer";

const PUB_ID = "ca-pub-7568133290427764"; // your AdSense publisher ID

// Routes where Auto Ads must NEVER initialize
const AUTO_ADS_BLOCKLIST = [
  /^\/404$/,            // custom 404
  /^\/_error$/,         // Next error page
  /^\/500$/,            // 500s (if any)
  /^\/api(\/|$)/,       // API routes
  /^\/sitemap(\.xml)?$/,
  /^\/robots\.txt$/,
  /^\/healthz$/,
  // Add any other utility/thin routes you want ad-free, e.g.:
  // /^\/search$/,
  // /^\/admin(\/|$)/,
];

function isBlocked(pathname) {
  return AUTO_ADS_BLOCKLIST.some((re) => re.test(pathname));
}

function ensureAutoAdsLoaded(pubId) {
  // Skip if the page has no meaningful text content
  const bodyText = (document?.body?.innerText || "").trim();
  if (!bodyText.length) return;

  // Avoid double-inserting the auto-ads script
  const already = Array.from(document.scripts).some((s) =>
    s.src.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")
  );
  if (already) return;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { hasContent = true } = pageProps;

  useEffect(() => {
    const handle = (url) => {
      const bodyText = (document?.body?.innerText || "").trim();
      const contentPresent =
        typeof hasContent === "boolean" ? hasContent : bodyText.length > 0;
      if (!isBlocked(url) && contentPresent) ensureAutoAdsLoaded(PUB_ID);
    };

    // initial load
    handle(router.pathname);
    // on client route changes
    router.events.on("routeChangeStart", handle);
    return () => router.events.off("routeChangeStart", handle);
  }, [router.pathname, hasContent]);

  return (
    <>
      {/* ----- Google Analytics ----- */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-5K4ZNLRJK7"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5K4ZNLRJK7', { page_path: window.location.pathname });
          `,
        }}
      />

      {/* IMPORTANT: We removed the static AdSense <Script> tags.
         Auto-ads now loads dynamically only on allowed routes. */}

      <Component {...pageProps} />
      <Footer />
    </>
  );
}
