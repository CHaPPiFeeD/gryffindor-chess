import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Action } from 'history';
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
  gameStartTime: Date | null;
  endGameMessage: {
    title: string;
    message: string;
  }
}

const initialState: gameType = {
  board: [],
  ways: [],
  color: null,
  moveQueue: null,
  activePosition: null,
  gameStartTime: null,
  endGameMessage: {
    title: '',
    message: '',
  },
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
      state.gameStartTime = action.payload?.gameStart || state.gameStartTime || null;
      console.log(action.payload?.gameStart);

    },
    setActivePosition: (state, action) => {
      console.log(`active: ${action.payload}`);

      state.activePosition = action.payload;
    },
    setMessage: (state, action) => {
      state.endGameMessage.title = action.payload.title;
      state.endGameMessage.message = action.payload.message;
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

export const { setBoard, setActivePosition, setMessage } = gameSlice.actions;

export default gameSlice.reducer;
