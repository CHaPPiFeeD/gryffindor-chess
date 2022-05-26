import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '..';
import { move } from '../../api/socket';
import { startGameDataType } from '../../api/types'

export type boardType = {
  board: string[][];
  ways: string[];
  color: string;
  activePos: number[] | null;
}

const initialState: boardType = {
  board: [],
  ways: [],
  color: '',
  activePos: null,
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<startGameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.color = action.payload.color;
    },
    setActivePos: (state, action) => {
      console.log(`active: ${action.payload}`);

      state.activePos = action.payload;
    },
  },
})

export const setMove = (activePos: number[] | null, payload: number[]) => async (dispatch: any) => {
  if (activePos === null) {
    dispatch(setActivePos(payload))
    
  } else if (activePos !== null) {
    const startPos = activePos;
    const endPos = payload;
    const data = { startPos, endPos };
    console.log(`move ${JSON.stringify(startPos)} to ${JSON.stringify(endPos)}`);

    dispatch(setActivePos(null))

    move(data)
  }
}

// Action creators are generated for each case reducer function
export const { setBoard, setActivePos } = boardSlice.actions;

export default boardSlice.reducer;
