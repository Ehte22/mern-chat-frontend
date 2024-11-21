import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/authApi";
import authSlice from "./slices/authSlice";
import { chatApi } from "./apis/chatApi";
import { userApi } from "./apis/userApi";
import chatSlice from "./slices/chatSlice";


const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        auth: authSlice,
        chat: chatSlice,
    },
    middleware: defaultMiddleware => [
        ...defaultMiddleware(),
        authApi.middleware,
        chatApi.middleware,
        userApi.middleware,
    ]
})

export default reduxStore