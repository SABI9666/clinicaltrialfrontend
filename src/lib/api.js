/**
 * Client for the Clinical Trial Access API.
 *
 * VITE_API_BASE_URL points at the Cloud Run service in deployed environments.
 * When it is blank the client uses same-origin /api, which is what the Vite
 * dev proxy serves.
 */
const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const url = (path) => `${BASE}${path}`;

async function request(path, init = {}) {
  const res = await fetch(url(path), {
    ...init,
    headers: { 'content-type': 'application/json', ...init.headers },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
      if (body?.details?.length) {
        message = body.details.map((d) => d.message).join('. ');
      }
    } catch {
      /* non-JSON error body — keep the status message */
    }
    throw Object.assign(new Error(message), { status: res.status });
  }

  return res.status === 204 ? null : res.json();
}

/** Full site payload: every section plus published collections. */
export const fetchSite = () => request('/api/public/site');

export const submitEnquiry = (payload) =>
  request('/api/public/enquiries', { method: 'POST', body: JSON.stringify(payload) });

/**
 * Resolve an image path to a URL the browser can load.
 * Absolute URLs (Cloud Storage) pass through; API-relative uploads get the
 * API origin; bundled /media assets are served by Vercel.
 */
export function resolveImage(src) {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/uploads/')) return `${BASE}${src}`;
  return src;
}
