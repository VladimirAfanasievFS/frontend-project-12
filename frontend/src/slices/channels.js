import { createSlice } from '@reduxjs/toolkit';

const initialState = { channels: [], currentChannelId: null };

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setInitialState: (state, { payload: { channels, currentChannelId } }) => {
      state.channels = channels;
      state.currentChannelId = currentChannelId;
    },
  },
});

export const { setInitialState } = channelsSlice.actions;

export default channelsSlice.reducer;
