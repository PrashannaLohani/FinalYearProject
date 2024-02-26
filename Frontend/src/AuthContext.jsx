import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [uidb64, setUidb64] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ uidb64, setUidb64, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
