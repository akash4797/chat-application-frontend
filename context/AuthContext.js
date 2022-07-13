import React, { useContext, useReducer } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import jwtDecode from "jwt-decode";

// @ts-ignore
const AuthContext = React.createContext();
// @ts-ignore
const AuthDispachContext = React.createContext();

export function useUser() {
  return useContext(AuthContext);
}

export function useUserUpdate() {
  return useContext(AuthDispachContext);
}

const inittoken = getCookie("token");
let user;
if (inittoken) {
  const decodedToken = jwtDecode(inittoken.toString());
  // @ts-ignore
  const expiresAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiresAt) {
    deleteCookie("token");
  } else {
    user = decodedToken;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "logout":
      deleteCookie("token");
      return { ...state, user: null };
    case "login":
      setCookie("token", action.payload.token);
      const payload = {
        email: action.payload.email,
        username: action.payload.username,
        imageurl: action.payload.imageurl,
        updatedAt: action.payload.updatedAt
      }
      return { ...state, user: payload };
    default:
      break;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user });
  return (
    <AuthContext.Provider value={state}>
      <AuthDispachContext.Provider value={dispatch}>
        {children}
      </AuthDispachContext.Provider>
    </AuthContext.Provider>
  );
}
