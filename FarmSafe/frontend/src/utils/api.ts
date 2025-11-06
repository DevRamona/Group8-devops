export const apiFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const saved = localStorage.getItem('auth');
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (saved) {
    const { token } = JSON.parse(saved) as { token: string };
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(input, { ...init, headers });
};

