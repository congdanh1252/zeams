import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  otherPeers: [],
  chatMessages: [],
  localStream: undefined,
}

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateLocalStream: (state, action) => {
      state.localStream = action.payload.localStream
    },
    updateOtherPeers: (state, action) => {
      state.otherPeers = action.payload.otherPeers
    },
    updateChatMessages: (state, action) => {
      state.chatMessages = action.payload.chatMessages
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateLocalStream, updateOtherPeers, updateChatMessages } = connectionSlice.actions

export const selectOtherPeers = state => state.connection.otherPeers
export const selectLocalStream = state => state.connection.localStream
export const selectChatMessages = state => state.connection.chatMessages

export default connectionSlice.reducer