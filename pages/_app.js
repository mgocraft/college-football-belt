// pages/_app.js
import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Footer from "../components/Footer";
import { getAdsenseClientId } from "../utils/adsense";
import { ensureAdsenseLoaded } from "../utils/adsenseLoader";
import {
  AdPreferencesProvider,
  useAdPreferences,
} from "../components/AdPreferencesProvider";

const PUB_ID = getAdsenseClientId();
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false";

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

function AppShell({ Component, pageProps }) {
  const router = useRouter();
  const { hasContent = true } = pageProps;
  const { autoAdsEnabled } = useAdPreferences();

  useEffect(() => {
    if (!ADSENSE_ENABLED) return;
    const handle = (url) => {
      const bodyText = (document?.body?.innerText || "").trim();
      const contentPresent =
        typeof hasContent === "boolean" ? hasContent : bodyText.length > 0;
      const routeBlocked = isBlocked(url);
      const shouldLoadForAutoAds = autoAdsEnabled && !routeBlocked && contentPresent;

      if (shouldLoadForAutoAds) {
        ensureAdsenseLoaded(PUB_ID);
      }
    };

    // initial load
    handle(router.pathname);
    // on client route changes
    router.events.on("routeChangeStart", handle);
    return () => router.events.off("routeChangeStart", handle);
  }, [router.pathname, hasContent, autoAdsEnabled]);

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

export default function MyApp(props) {
  return (
    <AdPreferencesProvider>
      <AppShell {...props} />
    </AdPreferencesProvider>
  );
}
