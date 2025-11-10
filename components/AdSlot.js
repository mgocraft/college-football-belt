import React, { useEffect, useState } from "react";
import AdUnit from "./AdUnit";
import AmazonBanner from "./AmazonBanner";

const ADSENSE_ENV_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

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
 * Chooses between AdSense and Amazon affiliate ads.
 * When NEXT_PUBLIC_ADSENSE_ENABLED === "true", renders <AdUnit/>;
 * otherwise falls back to <AmazonBanner/>.
 */
export default function AdSlot(props) {
  const [useAdsense, setUseAdsense] = useState(resolveInitialPreference);

  useEffect(() => {
    if (!ADSENSE_ENV_ENABLED || typeof window === "undefined") {
      return;
    }

    function handleFailure() {
      setUseAdsense(false);
    }

    function handleLoaded() {
      if (!window.__adsenseLoadFailed) {
        setUseAdsense(true);
      }
    }

    window.addEventListener("adsense-error", handleFailure);
    window.addEventListener("adsense-loaded", handleLoaded);

    if (window.__adsenseLoadFailed) {
      setUseAdsense(false);
    }

    return () => {
      window.removeEventListener("adsense-error", handleFailure);
      window.removeEventListener("adsense-loaded", handleLoaded);
    };
  }, []);

  if (!ADSENSE_ENV_ENABLED || !useAdsense) {
    return <AmazonBanner {...props} />;
  }

  return <AdUnit {...props} />;
}
