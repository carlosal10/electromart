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
const getAuthHeader = () => {
  const token = localStorage.getItem('token'); // adjust key if you use a different one
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
export const api = {
  async get(path) {
    const res = await fetch(apiUrl(path), {
      headers: { ...getAuthHeader() },
      credentials: 'include',
      cache: 'no-store',
    });
    return handleResponse(res);
  },

  async post(path, body) {
    const res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async put(path, body) {
    const res = await fetch(apiUrl(path), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async del(path) {
    const res = await fetch(apiUrl(path), {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
      credentials: 'include',
      cache: 'no-store',
    });
    return handleResponse(res);
  },
};

// Optional: file upload helper
export const uploadFile = async (path, file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { ...getAuthHeader() },
    // file uploads shouldn't be cached
    cache: 'no-store',
    body: form,
  });
  return handleResponse(res);
};
