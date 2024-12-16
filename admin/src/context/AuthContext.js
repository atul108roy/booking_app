import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: safelyParseJSON(sessionStorage.getItem("user")) || null, // Use sessionStorage
  loading: false,
  error: null,
};

function safelyParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null; // Default to null if parsing fails
  }
}

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  console.log("Dispatched action:", action); // Debug log
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      console.log("LOGIN_SUCCESS payload:", action.payload); // Debug log
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.user) {
      console.log("Saving user to sessionStorage:", state.user); // Debug log
      sessionStorage.setItem("user", JSON.stringify(state.user)); // Save to sessionStorage
    } else {
      console.log("Removing user from sessionStorage");
      sessionStorage.removeItem("user"); // Remove from sessionStorage
    }
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
