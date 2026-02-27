const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false";

function hasMeaningfulBodyText() {
  const bodyText = (document?.body?.innerText || "").trim();
  return bodyText.length > 0;
}

export function ensureAdsenseLoaded(pubId) {
  if (!ADSENSE_ENABLED || typeof window === "undefined") return;
  if (window.__adsenseLoadFailed) return;
  if (!hasMeaningfulBodyText()) return;

  const existing = document.querySelector(
    "script[data-cfb-belt-adsense='auto']"
  );

  if (existing || window.__adsenseScriptLoading) {
    if (window.__adsenseLoaded) {
      window.dispatchEvent(new Event("adsense-loaded"));
    }
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
  script.crossOrigin = "anonymous";
  script.dataset.cfbBeltAdsense = "auto";

  window.__adsenseScriptLoading = true;

  script.addEventListener("load", () => {
    window.__adsenseScriptLoading = false;
    window.__adsenseLoaded = true;
    window.dispatchEvent(new Event("adsense-loaded"));
  });

  script.addEventListener("error", () => {
    window.__adsenseScriptLoading = false;
    window.__adsenseLoadFailed = true;
    window.dispatchEvent(new Event("adsense-error"));
    script.remove();
  });

  document.head.appendChild(script);
}

