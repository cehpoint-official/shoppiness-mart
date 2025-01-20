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
  },
});

export const { businessUserExist, businessUserNotExist } = businessUserReducer.actions;
