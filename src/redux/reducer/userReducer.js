import { createSlice } from "@reduxjs/toolkit";

// In your userReducer
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  lastFetched: localStorage.getItem("lastFetched") || null,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.lastFetched = Date.now();
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("lastFetched", Date.now());
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
      state.lastFetched = null;
      localStorage.removeItem("user");
      localStorage.removeItem("lastFetched");
    },
  },
});
export const { userExist, userNotExist } = userReducer.actions;
