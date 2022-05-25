import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { startGameDataType } from '../../api/types'

export type boardType = {
  board: string[][];
  ways: string[];
}

const initialState: boardType = {
  board: [],
  ways: [],
}

export const counterSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<startGameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setBoard } = counterSlice.actions;

export default counterSlice.reducer;
