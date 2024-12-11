"use client"

import { createContext, useState } from 'react';

export const AuthContext = createContext({
  accessToken: null,
  setAccessToken: () => {},
  pointId: null,
  setPointId: () => {},
});

/* export const EnterPoint = createContext({

}); */

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [pointId, setPointId] = useState(null);

  console.log(accessToken)

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, pointId, setPointId}}>
      {children}
    </AuthContext.Provider>
  );
};