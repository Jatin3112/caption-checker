"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/user");
      setUser(res.data.data);
    } catch (err) {
      console.log("User not logged in.");
      setUser(null);
    }
  };

  const logout = async () => {
    await axios.get("/api/logout");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, fetchUser, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
