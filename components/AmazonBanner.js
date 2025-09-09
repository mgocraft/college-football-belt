import React from "react";

/**
 * Simple Amazon affiliate banner.
 * Replace the iframe `src` with your own Amazon Associates banner code.
 */
export default function AmazonBanner() {
  return (
    <div style={{ textAlign: "center", margin: "1rem 0" }}>
      <iframe
        title="Amazon Banner"
        src="https://rcm-na.amazon-adsystem.com/e/cm?o=1&p=48&l=ur1&category=sports&banner=1Y0KEQF9WFA8VYHDR8R2&f=ifr&linkID=&t=cfbbelt-20&tracking_id=cfbbelt-20"
        width="728"
        height="90"
        scrolling="no"
        style={{ border: "none" }}
        frameBorder="0"
      />
    </div>
  );
}
