// utils/api.js
const normalizeBaseUrl = (baseUrl = '') => {
  const trimmed = String(baseUrl || '').trim();
  if (!trimmed) return '';
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

// CRA-friendly env reader (optionally allows a runtime window override)
const readEnvBase = () => {
  let v = '';
  // 1) CRA build-time env: REACT_APP_API_BASE_URL
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) {
    v = process.env.REACT_APP_API_BASE_URL;
  }
  // 2) Optional runtime override you can set before app bootstrap
  if (!v && typeof window !== 'undefined' && window.__API_BASE__) {
    v = window.__API_BASE__;
  }
  return normalizeBaseUrl(v);
};

export const API_BASE_URL = readEnvBase();

export const apiUrl = (path) => {
  if (!path.startsWith('/')) {
    throw new Error(`Expected absolute API path starting with "/". Received: ${path}`);
  }
  return `${API_BASE_URL}${path}`;
};

// --- Auth header helper ---
const getAuthHeader = (explicitToken) => {
  let token = explicitToken;
  if (!token) {
    try {
      token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    } catch (_) {
      token = null;
    }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Unified response handler ---
const handleResponse = async (res) => {
  // Some responses (304 Not Modified or 204 No Content) may have empty bodies.
  // Try to parse JSON, but fall back to an empty object when there's no body.
  const data = await res
    .text()
    .then((t) => {
      try {
        return t ? JSON.parse(t) : {};
      } catch (e) {
        return {};
      }
    })
    .catch(() => ({}));

  // Treat 304 as a cache-related issue for API endpoints (auth should never be served from cache).
  if (res.status === 304) {
    throw new Error('Not Modified (304) - resource served from cache. Try disabling cache or ensure the server does not return 304 for API endpoints.');
  }

  if (!res.ok) {
    const message = data?.error || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return { data };
};

// --- Minimal fetch wrapper ---
const mergeHeaders = (authToken, extraHeaders) => ({
  ...getAuthHeader(authToken),
  ...(extraHeaders || {}),
});

export const api = {
  async get(path, options = {}) {
    const { authToken, headers, ...fetchOptions } = options;
    const res = await fetch(apiUrl(path), {
      headers: mergeHeaders(authToken, headers),
      credentials: 'include',
      cache: 'no-store',
      ...fetchOptions,
    });
    return handleResponse(res);
  },

  async post(path, body, options = {}) {
    const { authToken, headers, ...fetchOptions } = options;
    const res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...mergeHeaders(authToken, headers) },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body),
      ...fetchOptions,
    });
    return handleResponse(res);
  },

  async put(path, body, options = {}) {
    const { authToken, headers, ...fetchOptions } = options;
    const res = await fetch(apiUrl(path), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...mergeHeaders(authToken, headers) },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body),
      ...fetchOptions,
    });
    return handleResponse(res);
  },

  async del(path, options = {}) {
    const { authToken, headers, ...fetchOptions } = options;
    const res = await fetch(apiUrl(path), {
      method: 'DELETE',
      headers: mergeHeaders(authToken, headers),
      credentials: 'include',
      cache: 'no-store',
      ...fetchOptions,
    });
    return handleResponse(res);
  },
};

// Optional: file upload helper
export const uploadFile = async (path, file, options = {}) => {
  const { authToken, headers, ...fetchOptions } = options;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: mergeHeaders(authToken, headers),
    // file uploads shouldn't be cached
    cache: 'no-store',
    body: form,
    ...fetchOptions,
  });
  return handleResponse(res);
};
