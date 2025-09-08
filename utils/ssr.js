// utils/ssr.js
export function getBaseUrl(req) {
  const protoHeader = (req?.headers?.['x-forwarded-proto'] || '').toString();
  const proto = protoHeader.split(',')[0] || (req?.connection?.encrypted ? 'https' : 'http');
  const hostHeader = (
    req?.headers?.['x-forwarded-host'] ||
    req?.headers?.host ||
    'localhost:3000'
  ).toString();
  const host = hostHeader.split(',')[0];
  return `${proto}://${host}`;
}

export async function fetchFromApi(req, path) {
  const base = getBaseUrl(req);
  const url = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}
