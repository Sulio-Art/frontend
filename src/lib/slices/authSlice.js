import { createSlice } from "@reduxjs/toolkit";

const loadToken = () => {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || null;
    }
  } catch (e) {
    console.error("Could not load token from localStorage", e);
  }
  return null;
};

const initialState = {
  token: loadToken(),
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      if (token) {
        state.token = token;

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
