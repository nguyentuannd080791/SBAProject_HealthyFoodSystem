const storageKey = "hf_session_user";

export function loadSessionUser() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function saveSessionUser(user) {
  if (!user) {
    localStorage.removeItem(storageKey);
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify(user));
}

export function clearSessionUser() {
  localStorage.removeItem(storageKey);
}
