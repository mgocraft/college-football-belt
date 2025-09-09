import React, { useEffect } from "react";

/**
 * Basic AdSense unit that renders the standard
 * `<ins class="adsbygoogle">` slot. Any previously used
 * heuristic or variant logic has been removed for a
 * straightforward implementation.
 */
export default function AdUnit({
  AdSlot,
  slot,
  adSlot,
  enabled = true,
  className = "",
  style = { display: "block" },
  client = "ca-pub-7568133290427764",
  format = "auto",
  fullWidthResponsive = true,
}) {
  const resolvedSlot = slot || AdSlot || adSlot;

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // ignore errors from ad blocker or repeated pushes
    }
  }, [enabled]);

  if (!enabled || !resolvedSlot) return null;

  return (
    <ins
      className={`adsbygoogle ${className}`.trim()}
      style={style}
      data-ad-client={client}
      data-ad-slot={resolvedSlot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
