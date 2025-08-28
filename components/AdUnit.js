import { useEffect, useRef } from "react";

/**
 * AdSense unit for cfbbelt.com
 * - NEW: `enabled` prop gates all rendering/pushing until real content is present.
 * - Lazy-inits (adsbygoogle).push() only when the slot is in view (reduces CLS).
 * - Backward-compatible with your existing props (AdSlot, variant/type/format).
 *
 * Usage examples:
 *   const hasMeaningfulContent = Boolean(data?.items?.length >= 3);
 *   <AdUnit AdSlot="9168138847" variant="leaderboard" enabled={hasMeaningfulContent} />
 *   <AdUnit AdSlot="1234567890" variant="inContent"  enabled={hasMeaningfulContent} />
 *
 * Keep the global AdSense script controlled in _app.js (with your route blocklist).
 */

export default function AdUnit({
  AdSlot,
  slot, // allow either name
  // Gate ad rendering/fill until the page actually has content
  enabled = true,
  // Backward-compatible: accept `variant`, `type`, or `format` without changing page code
  variant = "leaderboard",
  type: legacyType,
  format: legacyFormat,
  className = "",
  client = "ca-pub-7568133290427764",
}) {
  const ref = useRef(null);
  const pushedRef = useRef(false);

  // Early exit: do not render any ad markup when not enabled
  if (!enabled) return null;

  useEffect(() => {
    // If somehow rendered but disabled later, don't push
    if (!enabled || !ref.current || pushedRef.current) return;

    // Defer pushing until visible to avoid CLS and wasted requests
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            typeof window !== "undefined" &&
            el.getAttribute("data-adsbygoogle-status") !== "done"
          ) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushedRef.current = true;
              io.disconnect();
            } catch {
              // swallow; AdSense will retry
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // Resolve variant from any legacy props without requiring page changes
  const resolvedVariant = (legacyType || legacyFormat || variant || "leaderboard")
    .toLowerCase()
    .includes("content")
    ? "inContent"
    : "leaderboard";

  const preset = presets[resolvedVariant] || presets.leaderboard;
  const resolvedSlot = slot || AdSlot; // support either prop name

  return (
    <div className={`${preset.wrapper} ${className}`}>
      <ins
        ref={ref}
        className={`adsbygoogle ${preset.ins}`}
        style={preset.style}
        data-ad-client={client}
        data-ad-slot={resolvedSlot}
        data-ad-format={preset.dataAdFormat}
        data-full-width-responsive={preset.fullWidthResponsive}
      />
      <style jsx>{`
        /* Wrapper caps width so responsive units don't stretch awkwardly */
        .wrapper { width: 100%; display: block; margin: 0 auto; }

        /* Leaderboard: 728x90 desktop, 468x60 tablet, 320x100 mobile */
        .leaderboard { max-width: 728px; min-height: 90px; }
        @media (max-width: 1024px) { .leaderboard { max-width: 468px; min-height: 60px; } }
        @media (max-width: 640px)  { .leaderboard { max-width: 320px; min-height: 100px; } }

        /* In-content: prefer 336x280/300x250 but never full-width skyscrapers */
        .incontent { max-width: 336px; min-height: 280px; }
        @media (max-width: 1024px) { .incontent { max-width: 300px; min-height: 250px; } }
        @media (max-width: 400px)  { .incontent { max-width: 300px; min-height: 250px; } }
      `}</style>
    </div>
  );
}

const presets = {
  leaderboard: {
    wrapper: "wrapper",
    ins: "leaderboard",
    // Force horizontal so AdSense doesn’t render tall squares
    dataAdFormat: "horizontal",
    fullWidthResponsive: "false", // string expected by Google
    style: { display: "block" },
  },
  inContent: {
    wrapper: "wrapper",
    ins: "incontent",
    // Let Google pick from rectangle family within capped container
    dataAdFormat: "auto",
    fullWidthResponsive: "false", // string expected by Google
    style: { display: "block" },
  },
};
