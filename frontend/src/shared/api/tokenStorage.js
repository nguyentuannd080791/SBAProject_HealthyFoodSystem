const tokenKey = "hf_session_token";
let tokenRevision = 0;

export function getTokenRevision() {
  return tokenRevision;
}

export function loadToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

export function saveToken(token) {
  tokenRevision += 1;
  if (!token) {
    localStorage.removeItem(tokenKey);
    return;
  }
  localStorage.setItem(tokenKey, token);
}

export function clearToken() {
  tokenRevision += 1;
  localStorage.removeItem(tokenKey);
}
