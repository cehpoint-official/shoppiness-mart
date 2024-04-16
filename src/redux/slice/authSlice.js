import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../api/AuthApi";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {},
    reducers: {
        invalidate: (state, { payload }) => {
            payload.forEach(item => {
                state[item] = false
            })
        }
    },
    extraReducers: builder => builder
        .addMatcher(AuthApi.endpoints.continueWithGoogle.matchPending, (state, { payload }) => {
            state.loading = true
        })
        .addMatcher(AuthApi.endpoints.continueWithGoogle.matchFulfilled, (state, { payload }) => {
            state.loading = false
            state.auth = payload
        })
        .addMatcher(AuthApi.endpoints.continueWithGoogle.matchRejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

})

// export const { invalidate } = authSlice.actions
export default authSlice.reducer