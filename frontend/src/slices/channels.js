/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import find from 'lodash/find';
import remove from 'lodash/remove';

const initialState = { channels: [], currentChannelId: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState: (state, { payload: { channels, currentChannelId } }) => {
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
    changeChannel: (state, { payload: { channelId } }) => {
      state.currentChannelId = channelId;
    },
    addChannel: (state, { payload: { channel } }) => {
      state.channels.push(channel);
    },
    removeChannel: (state, { payload: { channelId } }) => {
      remove(state.channels, ({ id }) => id === channelId);
    },
    renameChannel: (state, { payload: { channelId, name } }) => {
      const channel = find(state.channels, ({ id }) => id === channelId);
      channel.name = name;
    },
  },
});

export const {
  setInitialState, changeChannel, addChannel, removeChannel, renameChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
