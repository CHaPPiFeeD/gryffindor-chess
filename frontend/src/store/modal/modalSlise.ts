import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type modalStateType = {
  [index: string]: boolean,
}

const initialState: modalStateType = {
  endGame: false,
  changePawn: false,
  draw: false,
  waitingForOpponent: false,
};

export const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    setOpen: (state, { payload }: PayloadAction<string>) => {
      state[payload] = true;
    },
    setClose: (state, { payload }: PayloadAction<string>) => {
      state[payload] = false;
    },
  },
});

export const { setOpen, setClose } = modalSlice.actions;

export default modalSlice.reducer;

