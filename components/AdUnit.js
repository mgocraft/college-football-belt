import { useEffect, useRef, useState } from "react";

/**
 * Smart AdSense unit for cfbbelt.com
 * - No page changes required:
 *   If `enabled` prop is omitted, it auto-enables when the page has "enough" content.
 * - Heuristics:
 *   - Wait until document.body innerText length >= minText (default 300 chars)
 *   - Optionally require an element to exist (e.g., "#main-content")
 *   - Then wait until the slot is in view before pushing (reduces CLS)
 *
 * Optional props you can tweak per placement:
 *   <AdUnit AdSlot="9168138847" variant="leaderboard" />
 *   <AdUnit AdSlot="123" variant="inContent" auto={{ minText: 500, selector: "#belt-table" }} />
 *
 * If you prefer explicit control, pass `enabled={boolean}` and the heuristics are skipped.
 */

export default function AdUnit({
  AdSlot,
  slot,                             // allow either name
  enabled,                          // if provided, overrides auto heuristics
  variant = "leaderboard",
  type: legacyType,
  format: legacyFormat,
  className = "",
  client = "ca-pub-7568133290427764",
  auto = { minText: 300, selector: null },   // heuristics when enabled is undefined
}) {
  const ref = useRef(null);
  const pushedRef = useRef(false);
  const [shouldRender, setShouldRender] = useState(Boolean(enabled)); // if enabled provided, honor immediately

  // Heuristic gate: only when enabled is not explicitly set
  useEffect(() => {
    if (typeof enabled === "boolean") {
      setShouldRender(enabled);
      return;
    }

    const { minText = 300, selector = null } = auto || {};
    const meetsText = () => (document?.body?.innerText || "").trim().length >= minText;
    const meetsSelector = () => (selector ? !!document.querySelector(selector) : true);

    // Poll a few times quickly as content hydrates
    let tries = 0;
    const maxTries = 40; // ~4s if 100ms
    const timer = setInterval(() => {
      tries += 1;
      if (meetsText() && meetsSelector()) {
        setShouldRender(true);
        clearInterval(timer);
      } else if (tries >= maxTries) {
        // Fail-open after timeout to avoid never showing ads on slower pages
        setShouldRender(true);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [enabled, auto]);

  useEffect(() => {
    if (!shouldRender || !ref.current || pushedRef.current) return;

    // Use IntersectionObserver to push only when visible
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
              // swallow; AdSense may retry later
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [shouldRender]);

  // Variant resolution (back-compat with your legacy props)
  const resolvedVariant = (legacyType || legacyFormat || variant || "leaderboard")
    .toLowerCase()
    .includes("content")
    ? "inContent"
    : "leaderboard";

  const preset = presets[resolvedVariant] || presets.leaderboard;
  const resolvedSlot = slot || AdSlot;

  // Do not render any ad markup until heuristics say “ready”
  if (!shouldRender) return null;

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
        .wrapper { width: 100%; display: block; margin: 0 auto; }
        .leaderboard { max-width: 728px; min-height: 90px; }
        @media (max-width: 1024px) { .leaderboard { max-width: 468px; min-height: 60px; } }
        @media (max-width: 640px)  { .leaderboard { max-width: 320px; min-height: 100px; } }
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
    dataAdFormat: "horizontal",
    fullWidthResponsive: "false",
    style: { display: "block" },
  },
  inContent: {
    wrapper: "wrapper",
    ins: "incontent",
    dataAdFormat: "auto",
    fullWidthResponsive: "false",
    style: { display: "block" },
  },
};
