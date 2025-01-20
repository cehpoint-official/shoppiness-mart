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
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },
  },
});

export const { ngoUserExist, ngoUserNotExist, setLoading } = ngoUserReducer.actions;
