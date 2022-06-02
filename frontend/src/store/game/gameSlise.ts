import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { move } from '../../api/socket';
import { changeFigureDataType, gameDataType, gameStartDataType, usersQueueType } from '../../api/types'

export type gameType = {
  players: {
    white: string,
    black: string,
  },
  board: string[][];
  ways: string[];
  color: string;
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
  eatFigures: string[];
}

const initialState: gameType = {
  players: {
    white: '',
    black: '',
  },
  board: [],
  ways: [],
  color: '',
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
  eatFigures: [],
}

export const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    setGameStart: (state, action: PayloadAction<gameStartDataType>) => {
      state.players = action.payload.players;
      state.color = action.payload.color;
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.moveQueue = action.payload.moveQueue;
      state.gameStartTime = action.payload.gameStart;
    },
    setGame: (state, action: PayloadAction<gameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.moveQueue = action.payload.moveQueue;
      state.log = action.payload?.log || state.log;
      state.eatFigures = action.payload.eatFigures;
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
    clearGameSlise: (state) => {
      state.players.white = '';
      state.players.black = '';
      state.color = '';
      state.board = [];
      state.ways = [];
      state.moveQueue = null;
      state.gameStartTime = null;
      state.log = null;
      state.eatFigures = [];
      state.activePosition = null;
      state.endGameMessage.title = '';
      state.endGameMessage.message = '';
      state.gameEndTime = null;
      state.endPosition = null;
      state.queue = null;
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

export const {
  setGameStart,
  setGame,
  setActivePosition,
  setMessage,
  setEndPosition,
  setQueue,
  setEndTime,
  clearGameSlise,
} = gameSlice.actions;


export default gameSlice.reducer;
