import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chatSlice",
    initialState: {},
    reducers: {
        setSelectedUser: (state, { payload }) => {
            state.selectedUser = payload
        }
    },
    extraReducers: builder => builder
})

export const { setSelectedUser } = chatSlice.actions
export default chatSlice.reducer