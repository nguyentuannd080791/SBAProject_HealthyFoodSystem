import { useEffect, useRef, useState } from "react";
import { refreshSession } from "../../shared/api/httpClient";
import { clearToken, saveToken } from "../../shared/api/tokenStorage";
import { AuthContext } from "./AuthContext";
import {
  clearSessionUser,
  loadSessionUser,
  saveSessionUser,
} from "./authStorage";

export function AuthProvider({ children }) {
  const [initialUser] = useState(loadSessionUser);
  const [user, setUser] = useState(initialUser);
  const [isRestoringSession, setIsRestoringSession] = useState(!initialUser);
  const sessionVersion = useRef(0);

  useEffect(() => {
    if (initialUser) return;
    let active = true;
    const version = sessionVersion.current;
    refreshSession().then((data) => {
      if (!active || sessionVersion.current !== version) return;
      saveSessionUser(data.user);
      setUser(data.user);
    }).catch(() => {
      // An absent or expired refresh cookie leaves the visitor signed out.
    }).finally(() => { if (active) setIsRestoringSession(false); });
    return () => { active = false; };
  }, [initialUser]);

  function login(sessionUser, token) {
    if (!sessionUser || !token) return;
    sessionVersion.current += 1;
    saveToken(token);
    saveSessionUser(sessionUser);
    setUser(sessionUser);
  }

  function updateUser(changes) {
    const updatedUser = { ...user, ...changes };
    saveSessionUser(updatedUser);
    setUser(updatedUser);
  }

  function logout() {
    sessionVersion.current += 1;
    clearToken();
    clearSessionUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isRestoringSession, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
