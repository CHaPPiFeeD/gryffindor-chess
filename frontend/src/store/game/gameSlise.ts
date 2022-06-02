import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { move } from '../../api/socket';
import { changeFigureDataType, gameDataType, usersQueueType } from '../../api/types'

export type gameType = {
  board: string[][];
  ways: string[];
  color: string | null;
  moveQueue: string | null;
  activePosition: [number, number] | null;
  endPosition: [number, number] | null;
  gameStartTime: Date | null;
  gameEndTime: Date | null;
  endGameMessage: {
    title: string;
    message: string;
  }
  queue: usersQueueType[] | null;
  log: any;
  eatFigures: string[] | null;
}

const initialState: gameType = {
  board: [],
  ways: [],
  color: null,
  moveQueue: null,
  activePosition: null,
  endPosition: null,
  gameStartTime: null,
  gameEndTime: null,
  endGameMessage: {
    title: '',
    message: '',
  },
  queue: null,
  log: [],
  eatFigures: null,
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
      state.gameStartTime = action.payload?.gameStart || state.gameStartTime;
      state.log = action.payload?.log || state.log;
      state.eatFigures = action.payload.eatFigures || null;
    },
    setActivePosition: (state, action) => {
      state.activePosition = action.payload;
    },
    setMessage: (state, action) => {
      state.endGameMessage.title = action.payload.title;
      state.endGameMessage.message = action.payload.message;
    },
    setEndTime: (state, action) => {
      state.gameEndTime = action.payload?.gameEnd || state.gameEndTime;
    },
    setEndPosition: (state, action) => {
      state.endPosition = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
  },
})

export const setMove = (
  activePosition: [number, number] | null,
  payload: [number, number],
  change: changeFigureDataType,
) => async (dispatch: any) => {
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

    const data = { startPos: activePosition, endPos: payload, change };

    console.log(`move ${JSON.stringify(data.startPos)} to ${JSON.stringify(data.endPos)}`);

    dispatch(setActivePosition(null))

    move(data)
  }
}

export const { setBoard, setActivePosition, setMessage, setEndPosition, setQueue, setEndTime } = gameSlice.actions;

export default gameSlice.reducer;
