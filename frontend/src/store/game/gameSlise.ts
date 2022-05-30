import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '..';
import { move } from '../../api/socket';
import { gameDataType } from '../../api/types'

export type gameType = {
  board: string[][];
  ways: string[];
  color: 'white' | 'black' | null;
  moveQueue: 'white' | 'black' | null;
  activePosition: number[] | null;
}

const initialState: gameType = {
  board: [],
  ways: [],
  color: null,
  moveQueue: null,
  activePosition: null,
}

export const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<gameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.moveQueue = action.payload.moveQueue;
      state.color = action.payload?.color || state.color;
    },
    setActivePosition: (state, action) => {
      console.log(`active: ${action.payload}`);

      state.activePosition = action.payload;
    },
  },
})

export const setMove = (activePosition: number[] | null, payload: number[]) => async (dispatch: any) => {
  const isNull = activePosition === null;

  if (isNull) dispatch(setActivePosition(payload));
  
  if (!isNull) {

    const isCancelMove = 
      activePosition[0] === payload[0] && 
      activePosition[1] === payload[1];

    if (isCancelMove) {
      dispatch(setActivePosition(null));
      return;
    }

    const data = { startPos: activePosition, endPos: payload };

    console.log(`move ${JSON.stringify(data.startPos)} to ${JSON.stringify(data.endPos)}`);

    dispatch(setActivePosition(null))

    move(data)
  }
}

export const { setBoard, setActivePosition } = gameSlice.actions;

export default gameSlice.reducer;
