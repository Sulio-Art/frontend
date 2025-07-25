

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
  user: null,
  token: null,
 
  hasChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      
      state.hasChecked = true;

      if (token && typeof window !== "undefined") {
        
        localStorage.setItem("app_token", token);
      }
    },
    
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.hasChecked = true;

      if (typeof window !== "undefined") {
        
        localStorage.removeItem("app_token");
      }
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
