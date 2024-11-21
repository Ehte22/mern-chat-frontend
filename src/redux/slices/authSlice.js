import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";
import { userApi } from "../apis/userApi";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")),
    },
    reducers: {},
    extraReducers: builder => builder
        .addMatcher(userApi.endpoints.updateProfile.matchFulfilled, (state, { payload }) => {
            state.user = payload
        })
        .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
            state.user = payload
        })
        .addMatcher(authApi.endpoints.logout.matchFulfilled, (state, { payload }) => {
            state.user = null
            state.logout = true
        })
})
export default authSlice.reducer