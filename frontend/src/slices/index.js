import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channels.js';
import messagesReducer from './messages.js';
import modalReducer from './modal.js';

export default configureStore({
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
    modal: modalReducer,
  },
});
