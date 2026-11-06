import { useState } from "react";
import { clearToken, saveToken } from "../../shared/api/tokenStorage";
import { AuthContext } from "./AuthContext";
import {
  clearSessionUser,
  loadSessionUser,
  saveSessionUser,
} from "./authStorage";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSessionUser);

  function login(sessionUser, token) {
    if (!sessionUser || !token) return;
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
    clearToken();
    clearSessionUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
