import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
};

export const businessUserReducer = createSlice({
  name: "businessUserReducer",
  initialState,
  reducers: {
    businessUserExist: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    businessUserNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { businessUserExist, businessUserNotExist, setLoading } = businessUserReducer.actions;
