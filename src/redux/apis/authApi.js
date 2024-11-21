import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/auth`,
        credentials: "include"
    }),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: userData => {
                    return {
                        url: "/login",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: data => {
                    localStorage.setItem("user", JSON.stringify(data.result))
                    return data.result
                }
            }),
            register: builder.mutation({
                query: userData => {
                    return {
                        url: "/register",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            logout: builder.mutation({
                query: () => {
                    return {
                        url: "/logout",
                        method: "POST",
                    }
                },
                transformResponse: data => {
                    localStorage.removeItem("user")
                    return data
                }
            })
        }
    }
})

export const {
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation
} = authApi
