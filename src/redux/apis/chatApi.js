import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        credentials: "include"
    }),
    tagTypes: ["contact"],
    endpoints: (builder) => {
        return {
            getMessages: builder.query({
                query: messageData => {
                    return {
                        url: `/${messageData.id}`,
                        method: "GET",
                        params: { page: messageData.page }
                    }
                },
                // transformResponse: data => data.result
            }),
            sendMessage: builder.mutation({
                query: messageData => {
                    return {
                        url: "/send",
                        method: "POST",
                        body: messageData
                    }
                },
            }),
            getContacts: builder.query({
                query: () => {
                    return {
                        url: "/contacts",
                        method: "GET",
                    }
                },
                providesTags: ["contact"],
                transformResponse: data => data.result
            }),
            createGroup: builder.mutation({
                query: groupData => {
                    return {
                        url: "/create-group",
                        method: "POST",
                        body: groupData
                    }
                },
                // transformResponse: data => data.result
            }),
            createContact: builder.mutation({
                query: contactData => {
                    return {
                        url: "/create-contact",
                        method: "POST",
                        body: contactData
                    }
                },
                invalidatesTags: ["contact"]
            }),
            updateSeen: builder.mutation({
                query: id => {
                    return {
                        url: `/update-seen/${id}`,
                        method: "PUT",
                    }
                },
                // invalidatesTags: ["contact"]
            }),

        }
    }
})

export const {
    useGetContactsQuery,
    useLazyGetMessagesQuery,
    useSendMessageMutation,
    useCreateGroupMutation,
    useCreateContactMutation,
    useUpdateSeenMutation
} = chatApi
