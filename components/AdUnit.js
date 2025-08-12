import { useEffect, useRef } from "react";

/**
 * Drop‑in AdSense component tuned for cfbbelt.com
 * - Forces horizontal formats in top/bottom leaderboard spots
 * - Caps width so ads don’t look oversized on desktop
 * - Uses responsive mobile sizes without huge vertical blocks
 * - Defers (adsbygoogle).push() until the slot is in view (reduces CLS)
 *
 * Usage examples:
 *   <AdUnit slot="9168138847" variant="leaderboard" />
 *   <AdUnit slot="1234567890" variant="inContent" />
 *
 * Notes:
 * - Keep the global AdSense script in _app.tsx or _document.tsx:
 *   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7568133290427764" crossorigin="anonymous"></script>
 */

export default function AdUnit({
  AdSlot,
  // Backward-compatible: accept `variant`, `type`, or `format` without changing page code
  variant = "leaderboard",
  type: legacyType,
  format: legacyFormat,
  className = "",
  client = "ca-pub-7568133290427764",
}) {
  const ref = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!ref.current || pushedRef.current) return;

    // Defer pushing until visible to avoid CLS and wasted requests
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== "undefined") {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              pushedRef.current = true;
              io.disconnect();
            } catch (e) {
              // swallow; AdSense will retry
            }
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

    // Resolve variant from any legacy props without requiring page changes
  const resolvedVariant = (legacyType || legacyFormat || variant || "leaderboard").toLowerCase().includes("content")
    ? "inContent"
    : "leaderboard";

  // Size presets — keep horizontal, cap width, avoid tall blocks
  const preset = presets[resolvedVariant] || presets.leaderboard;

  return (
    <div className={`${preset.wrapper} ${className}`}>
      <ins
        ref={ref}
        className={`adsbygoogle ${preset.ins}`}
        style={preset.style}
        data-ad-client={client}
        data-ad-slot={AdSlot}
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

        /* In‑content: prefer 336x280/300x250 but never full‑width skyscrapers */
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
    fullWidthResponsive: "false",
    style: { display: "block" },
  },
  inContent: {
    wrapper: "wrapper",
    ins: "incontent",
    // Let Google pick from rectangle family within capped container
    dataAdFormat: "auto",
    fullWidthResponsive: "false",
    style: { display: "block" },
  },
};
