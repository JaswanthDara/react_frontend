import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT safely
  const decodeToken = (jwtToken) => {
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      return {
        name: payload.name || "User",
        email: payload.email || "",
        role: payload.role || "User",
        id: payload.id || payload._id || null,
        exp: payload.exp || null,
      };
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return null;
    }
  };

  // Check token expiry
  const isTokenValid = (decoded) => {
    if (!decoded || !decoded.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  };

  // Restore authentication
  useEffect(() => {
    const storedToken = localStorage.getItem("ssm_token");
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (isTokenValid(decodedUser)) {
        setUser(decodedUser);
        setToken(storedToken);
        api.setToken(storedToken);
      } else {
        console.warn("Token expired or invalid — logging out");
        handleLogout();
      }
    } else {
      api.clearToken();
      console.log("No token found — user not logged in");
    }
    setLoading(false);
  }, []);

  // Login
  const handleLogin = (jwtToken) => {
    const decodedUser = decodeToken(jwtToken);
    if (!decodedUser || !isTokenValid(decodedUser)) {
      console.error("Invalid or expired token during login");
      return false;
    }

    localStorage.setItem("ssm_token", jwtToken);
    setUser(decodedUser);
    setToken(jwtToken);
    api.setToken(jwtToken);
    return true;
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("ssm_token");
    api.clearToken();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login: handleLogin,
        logout: handleLogout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
