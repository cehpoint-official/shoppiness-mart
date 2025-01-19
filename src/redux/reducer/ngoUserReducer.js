import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
};

export const ngoUserReducer = createSlice({
  name: "ngoUserReducer",
  initialState,
  reducers: {
    ngoUserExist: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    ngoUserNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { ngoUserExist, ngoUserNotExist } = ngoUserReducer.actions;