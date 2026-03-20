import { createContext, useState, useContext } from "react";
import { getAuthHeaders } from "../api/authHeaders";

const AuthContext = createContext(null);

const requireEmailPassword = (credentials, message) => {
  if (!credentials?.email?.trim() || !credentials?.password?.trim()) {
    return message;
  }
  return null;
};

export default function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => {
    return !!localStorage.getItem("mn_accessToken");
  });

  const [userEmail, setUserEmail] = useState("");

  const [authErrors, setAuthErrors] = useState([]);

  const loginRegisterHandler = async (credentials, url, actionType) => {
    const err = requireEmailPassword(
      credentials,
      "Email and Password are required",
    );

    if (err) {
      setAuthErrors((prev) => [{ error: err }, ...prev]);
      return { ok: false };
    }

    setAuthErrors([]);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      let message = `${actionType} failed (${res.status})`;
      try {
        const data = await res.json();
        message = data?.message || data?.error || message;
      } catch (err) {
        console.log("Could not parse error response as JSON", err);
      }

      setAuthErrors((prev) => [{ error: message }, ...prev]);
      return { ok: false };
    }

    const content = await res.json();

    if (content?.access_token) {
      localStorage.setItem("mn_accessToken", content.access_token);
    }
    if (content?.refresh_token) {
      localStorage.setItem("mn_refreshToken", content.refresh_token);
    }

    setIsAuthed(true);
    localStorage.setItem("mn_isAuthed", "true");
    setUserEmail(content.email);
    return {
      ok: true,
      data: { email: content["email"], token: content["access_token"] },
    };
  };

  const register = (credentials) => {
    resetAuthErrors();
    return loginRegisterHandler(
      credentials,
      "/api/auth/registration",
      "Registration",
    );
  };

  const resetAuthErrors = () => {
    setAuthErrors([]);
  };

  const login = async (credentials) => {
    resetAuthErrors();
    const data = await loginRegisterHandler(
      credentials,
      "/api/auth/login",
      "Login",
    );

    return data;
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        console.warn("Logout request failed:", res.status, data);
      }

      return { ok: true, ...data };
    } catch (error) {
      console.error("Logout request error:", error);
      return { ok: true };
    } finally {
      setIsAuthed(false);
      setUserEmail("");
      localStorage.removeItem("mn_accessToken");
      localStorage.removeItem("mn_refreshToken");
      localStorage.removeItem("mn_isAuthed");
      localStorage.removeItem("mn_userEmail");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthed,
        authErrors,
        login,
        logout,
        register,
        resetAuthErrors,
        userEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
