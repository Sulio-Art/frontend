import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { artworkApi } from "./api/artworkApi";
import { chatApi } from "./api/chatApi";
import { customerApi } from "./api/customerApi";
import authReducer from "./slices/authSlice";
import { diaryApi } from "./api/diaryApi";
import { eventApi } from "./api/eventApi";
import { profileApi } from "./api/profileApi";
import { settingApi } from "./api/settingsApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [artworkApi.reducerPath]: artworkApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [diaryApi.reducerPath]: diaryApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [settingApi.reducerPath]: settingApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(artworkApi.middleware)
      .concat(chatApi.middleware)
      .concat(diaryApi.middleware)
      .concat(eventApi.middleware)
      .concat(profileApi.middleware)
      .concat(settingApi.middleware)
      .concat(customerApi.middleware),
});
