/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import remove from 'lodash/remove';
import { removeChannel, setInitialState } from './channels';

const initialState = { messages: [] };

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, { payload: { message } }) => {
      state.messages.push(message);
    },
  },
  extraReducers: (builder) => {
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
