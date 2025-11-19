const DEFAULT_CLIENT_ID = "ca-pub-7568133290427764";
const ADSENSE_CERT_AUTH_ID = "f08c47fec0942fa0";

function sanitizeId(id) {
  if (!id) return "";
  return id.trim();
}

function ensureClientPrefix(id) {
  if (!id) return DEFAULT_CLIENT_ID;
  const normalized = sanitizeId(id);
  if (normalized.startsWith("ca-pub-")) return normalized;
  if (normalized.startsWith("pub-")) return `ca-${normalized}`;
  return normalized;
}

function stripClientPrefix(id) {
  if (!id) return "";
  return id.replace(/^ca-/, "");
}

export function getAdsenseClientId() {
  const envId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
  return ensureClientPrefix(envId || DEFAULT_CLIENT_ID);
}

export function getAdsTxtEntry() {
  const publisherId = stripClientPrefix(getAdsenseClientId());
  return `google.com, ${publisherId}, DIRECT, ${ADSENSE_CERT_AUTH_ID}`;
}
