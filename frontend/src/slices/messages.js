import { createSlice } from '@reduxjs/toolkit';
import { setInitialState } from './channels';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      state.messages.push(message);
    },
  },
  extraReducers: builder => {
    builder.addCase(setInitialState, (state, { payload }) => {
      const { messages } = payload;
      state.messages = messages;
    });
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;