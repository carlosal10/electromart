// File: client/src/utils/api.js
// Purpose: strict JSON handling + clear diagnostics to catch HTML/empty responses.

const normalizeBaseUrl = (baseUrl = '') => {
  const t = String(baseUrl || '').trim();
  return t && t.endsWith('/') ? t.slice(0, -1) : t;
};

const readEnvBase = () => {
  let v = '';
  // Prefer the env variable injected at build time (React exposes only REACT_APP_ prefixed vars).
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) {
    v = process.env.REACT_APP_API_BASE_URL;
  } else if (typeof window !== 'undefined' && window.__API_BASE__) {
    // Next, use a runtime override if defined on the window (set in public/index.html).
    v = window.__API_BASE__;
  }
  // If neither environment nor window override is provided, fall back to the deployed API origin.
  if (!v) {
    v = 'https://electromart-server-4b6n.onrender.com';
  }
  return normalizeBaseUrl(v);
};

export const API_BASE_URL = readEnvBase();

export const apiUrl = (path) => {
  if (!path?.startsWith('/')) throw new Error(`Expected absolute API path starting with "/". Got: ${path}`);
  return `${API_BASE_URL}${path}`;
};

const getAuthHeader = (explicitToken) => {
  let token = explicitToken;
  if (!token) {
    try { token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null; } catch { token = null; }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const firstBytes = (txt, n = 120) => (txt ? txt.slice(0, n).replace(/\s+/g, ' ') : '');

const parseStrictJson = async (res, { expectJson = true } = {}) => {
  const contentType = res.headers.get('content-type') || '';
  const url = res.url || '(unknown-url)';
  const status = res.status;

  // Read raw text once
  const raw = await res.text().catch(() => '');

  // If not ok, try to parse error message but include diagnostics
  if (!res.ok) {
    let msg = 'Request failed';
    try { msg = (raw && JSON.parse(raw)?.error) || res.statusText || msg; } catch {}
    const hint = `url=${url} status=${status} type=${contentType} body~="${firstBytes(raw)}"`;
    throw new Error(`${msg} [${hint}]`);
  }

  // Strict JSON enforcement for APIs
  if (expectJson) {
    if (!contentType.toLowerCase().includes('application/json')) {
      const hint = `Non-JSON response: url=${url} status=${status} type=${contentType} body~="${firstBytes(raw)}"`;
      throw new Error(hint);
    }
    if (!raw) {
      const hint = `Empty JSON body: url=${url} status=${status}`;
      throw new Error(hint);
    }
    try {
      return { data: JSON.parse(raw) };
    } catch {
      const hint = `Invalid JSON: url=${url} status=${status} body~="${firstBytes(raw)}"`;
      throw new Error(hint);
    }
  }

  // For endpoints where JSON isn’t required
  try { return { data: raw ? JSON.parse(raw) : {} }; } catch { return { data: {} }; }
};

const mergeHeaders = (authToken, extra) => ({ ...getAuthHeader(authToken), ...(extra || {}) });

export const api = {
  async get(path, options = {}) {
    const { authToken, headers, expectJson = true, ...rest } = options;
    const res = await fetch(apiUrl(path), {
      headers: mergeHeaders(authToken, headers),
      credentials: 'include',
      cache: 'no-store',
      ...rest,
    });
    return parseStrictJson(res, { expectJson });
  },
  async post(path, body, options = {}) {
    const { authToken, headers, expectJson = true, ...rest } = options;
    const res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...mergeHeaders(authToken, headers) },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body ?? {}),
      ...rest,
    });
    return parseStrictJson(res, { expectJson });
  },
  async put(path, body, options = {}) {
    const { authToken, headers, expectJson = true, ...rest } = options;
    const res = await fetch(apiUrl(path), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...mergeHeaders(authToken, headers) },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body ?? {}),
      ...rest,
    });
    return parseStrictJson(res, { expectJson });
  },
  async del(path, options = {}) {
    const { authToken, headers, expectJson = true, ...rest } = options;
    const res = await fetch(apiUrl(path), {
      method: 'DELETE',
      headers: mergeHeaders(authToken, headers),
      credentials: 'include',
      cache: 'no-store',
      ...rest,
    });
    return parseStrictJson(res, { expectJson });
  },
};

// ===== Usage sanity (put this in your .env or index.html before app starts) =====
// .env.development
// REACT_APP_API_BASE_URL=http://localhost:4000   # <-- MUST be your API origin (not the React dev server)

// or at runtime in index.html (dev):
// <script>window.__API_BASE__ = 'http://localhost:4000';</script>
