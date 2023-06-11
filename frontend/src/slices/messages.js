import { createSlice } from '@reduxjs/toolkit';
import { removeChannel, setInitialState } from './channels';
import remove from 'lodash/remove';

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
    builder
      .addCase(setInitialState, (state, { payload }) => {
        const { messages } = payload;
        state.messages = messages;
      })
      .addCase(removeChannel, (state, { payload }) => {
        remove(state.messages, ({ channelId }) => channelId === payload.channelId);
      });
  },
});

export const { addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
