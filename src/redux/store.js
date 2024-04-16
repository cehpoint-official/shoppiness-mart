import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slice/authSlice";
import { AuthApi } from "./api/AuthApi.js";



const reduxStore = configureStore({
    reducer: {

        [AuthApi.reducerPath]: AuthApi.reducer,
        auth: authSlice
    },
    middleware: (defaultMiddleware) => [
        ...defaultMiddleware(), AuthApi.middleware]
})

export default reduxStore