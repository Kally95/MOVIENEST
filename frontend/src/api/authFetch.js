const ACCESS_TOKEN_KEY = "mn_accessToken";
const REFRESH_TOKEN_KEY = "mn_refreshToken";
const AUTH_FLAG_KEY = "mn_isAuthed";

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_FLAG_KEY);
  localStorage.removeItem("mn_userEmail");
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthStorage();
    return null;
  }

  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!res.ok) {
    clearAuthStorage();
    return null;
  }

  const data = await res.json();

  if (!data?.access_token) {
    clearAuthStorage();
    return null;
  }

  setAccessToken(data.access_token);
  return data.access_token;
}

export async function authFetch(url, options = {}) {
  const accessToken = getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  const retryHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${newAccessToken}`,
  };

  response = await fetch(url, {
    ...options,
    headers: retryHeaders,
  });

  return response;
}

export { clearAuthStorage };
