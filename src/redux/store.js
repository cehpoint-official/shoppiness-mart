import { configureStore } from "@reduxjs/toolkit";
import { AuthApi } from "./api/AuthApi";
import authSlice from "./slice/authSlice";



const reduxStore = configureStore({
    reducer: {

        [AuthApi.reducerPath]: AuthApi.reducer,
        auth: authSlice
    },
    middleware: (defaultMiddleware) => [
        ...defaultMiddleware(), AuthApi.middleware]
})

export default reduxStore