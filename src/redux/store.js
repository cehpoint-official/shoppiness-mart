import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./slice/authSlice";
import { authapi } from "./api/AuthApi";



const reduxStore = configureStore({
    reducer: {

        [authapi.reducerPath]: authapi.reducer,
        auth: authSlice
    },
    middleware: (defaultMiddleware) => [
        ...defaultMiddleware(), authapi.middleware]
})

export default reduxStore