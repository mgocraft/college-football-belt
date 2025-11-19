import React, { useEffect, useState } from "react";
import AdUnit from "./AdUnit";

const ADSENSE_ENV_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false";

function resolveInitialPreference() {
  if (!ADSENSE_ENV_ENABLED) {
    return false;
  }
  if (typeof window === "undefined") {
    return true;
  }
  if (window.__adsenseLoadFailed) {
    return false;
  }
  return true;
}

/**
 * Thin wrapper that keeps AdSense units from rendering until
 * the library has successfully loaded. When the script fails
 * to initialize we simply hide the slot to avoid broken UI.
 */
export default function AdSlot({ enabled = true, ...props }) {
  const [adsenseReady, setAdsenseReady] = useState(resolveInitialPreference);

  useEffect(() => {
    if (!ADSENSE_ENV_ENABLED || typeof window === "undefined") {
      return;
    }

    function handleFailure() {
      setAdsenseReady(false);
    }

    function handleLoaded() {
      if (!window.__adsenseLoadFailed) {
        setAdsenseReady(true);
      }
    }

    window.addEventListener("adsense-error", handleFailure);
    window.addEventListener("adsense-loaded", handleLoaded);

    if (window.__adsenseLoadFailed) {
      setAdsenseReady(false);
    }

    if (window.__adsenseLoaded) {
      setAdsenseReady(true);
    }

    return () => {
      window.removeEventListener("adsense-error", handleFailure);
      window.removeEventListener("adsense-loaded", handleLoaded);
    };
  }, []);

  if (!enabled || !ADSENSE_ENV_ENABLED || !adsenseReady) {
    return null;
  }

  return <AdUnit {...props} />;
}
