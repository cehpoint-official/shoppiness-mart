import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, google } from "../../config/Firebase";



export const authapi = createApi({
    reducerPath: "authapi",
    baseQuery: fetchBaseQuery(),
    tagTypes: ["auth"],
    endpoints: (builder) => {
        return {
            register: builder.mutation({
                queryFn: async userData => {
                    try {
                        await createUserWithEmailAndPassword(auth, userData.email, userData.password)
                        console.log("reistarion success");
                        return { data: "register successs" }
                    } catch (error) {
                        console.log(error);
                        return { error: error.message }
                    }
                },
                providesTags: ["auth"]

            }),
            //login
            login: builder.query({
                queryFn: async userData => {
                    try {
                        console.log(userData);
                        const result = await signInWithEmailAndPassword(auth, userData.email, userData.password)
                        console.warn("login success", result);
                        return { data: " login success" }
                    } catch (error) {
                        console.log(error);
                        return { error: error.message }
                    }
                }, providesTags: ["auth"]

            }),
            //google
            continueWithGoogle: builder.mutation({
                queryFn: async userData => {
                    try {
                        const result = await signInWithPopup(auth, google)
                        console.log("login successs", result);
                        console.warn("login success")
                        return { data: "login Success" }
                    } catch (error) {
                        console.log(error);
                        return { error: error.message }
                    }
                }

            }),
        }
    }
})

export const { useRegisterMutation, useLazyLoginQuery, useContinueWithGoogleMutation } = authapi
