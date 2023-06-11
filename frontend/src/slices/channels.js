import { createSlice } from '@reduxjs/toolkit';
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
  },
});

export const { setInitialState, changeChannel, addChannel, removeChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
