const tokenKey = "hf_session_token";

export function loadToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

export function saveToken(token) {
  if (!token) {
    localStorage.removeItem(tokenKey);
    return;
  }
  localStorage.setItem(tokenKey, token);
}

export function clearToken() {
  localStorage.removeItem(tokenKey);
}
