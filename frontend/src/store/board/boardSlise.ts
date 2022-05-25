import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { string } from 'yup/lib/locale';
import { startGameDataType } from '../../api/types'

export type boardType = {
  board: string[][];
  ways: string[];
  color: string;
}

const initialState: boardType = {
  board: [],
  ways: [],
  color: '',
}

export const counterSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<startGameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.color = action.payload.color;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setBoard } = counterSlice.actions;

export default counterSlice.reducer;
