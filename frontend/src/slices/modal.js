import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: {
    isVisible: false,
    type: null,
    payload: null,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (state, { payload: { type, payload } }) => {
      state.isVisible = true;
      state.type = type;
      state.payload = payload;
    },
    hideModal: state => {
      state.isVisible = false;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
