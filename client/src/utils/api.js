const normalizeBaseUrl = (baseUrl = '') => {
  const trimmed = baseUrl.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
};

export const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL);

export const apiUrl = (path) => {
  if (!path.startsWith('/')) {
    throw new Error(`Expected absolute API path starting with "/". Received: ${path}`);
  }
  return `${API_BASE_URL}${path}`;
};

