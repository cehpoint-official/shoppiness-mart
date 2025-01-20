import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/userReducer";
import { businessUserReducer } from "./reducer/businessUserReducer";
import { ngoUserReducer } from "./reducer/ngoUserReducer";
export const store = configureStore({
  reducer: {
    [businessUserReducer.name]: businessUserReducer.reducer,
    [ngoUserReducer.name]: ngoUserReducer.reducer,
    [userReducer.name]: userReducer.reducer,
  },
});
