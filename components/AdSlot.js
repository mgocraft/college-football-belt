import React from "react";
import AdUnit from "./AdUnit";
import AmazonBanner from "./AmazonBanner";

/**
 * Chooses between AdSense and Amazon affiliate ads.
 * When NEXT_PUBLIC_ADSENSE_ENABLED === "true", renders <AdUnit/>;
 * otherwise falls back to <AmazonBanner/>.
 */
export default function AdSlot(props) {
  const adsenseEnabled =
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  return adsenseEnabled ? <AdUnit {...props} /> : <AmazonBanner />;
}
