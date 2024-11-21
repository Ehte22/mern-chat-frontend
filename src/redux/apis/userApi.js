import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/user`,
        credentials: "include"
    }),
    endpoints: (builder) => {
        return {
            updateProfile: builder.mutation({
                query: userData => {
                    return {
                        url: "/update",
                        method: "POST",
                        body: userData
                    }
                },
                transformResponse: data => {
                    localStorage.setItem("user", JSON.stringify(data.result))
                    return data.result
                }
            }),
            searchProfile: builder.query({
                query: term => {
                    return {
                        url: `/search/${term}`,
                        method: "GET",
                    }
                },
                transformResponse: data => data.result
            }),

        }
    }
})

export const { useUpdateProfileMutation, useLazySearchProfileQuery } = userApi
