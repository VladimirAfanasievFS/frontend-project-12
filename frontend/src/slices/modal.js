import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modal: {
    isVisible: false,
    type: null,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    switchModal: (state, { payload: { isVisible, type } }) => {
      state.isVisible = isVisible;
      state.type = type;
    },
  },
});

export const { switchModal } = modalSlice.actions;

export default modalSlice.reducer;
