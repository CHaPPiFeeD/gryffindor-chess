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
  eatFigures: {
    white: string[],
    black: string[],
  };
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
  eatFigures: {
    white: [],
    black: [],
  },
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
      state.gameEndTime = initialState.gameEndTime;
      state.log = initialState.log;
      state.eatFigures = initialState.eatFigures;
    },
    setGame: (state, action: PayloadAction<gameDataType>) => {
      state.board = action.payload.board;
      state.ways = action.payload.ways;
      state.moveQueue = action.payload.moveQueue;
      state.log = action.payload?.log || state.log;
      state.eatFigures = action.payload.eatFigures || state.eatFigures;
    },
    setActivePosition: (state, action) => {
      state.activePosition = action.payload;
    },
    setMessage: (state, action) => {
      state.endGameMessage.title = action.payload.title;
      state.endGameMessage.message = action.payload.message;
    },
    setEndTime: (state, action) => {
      state.gameEndTime = action.payload?.gameEnd || null;
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
  if (activePosition === null) dispatch(setActivePosition(payload));
  if (activePosition !== null) {

    const isCancelMove =
      activePosition[0] === payload[0] &&
      activePosition[1] === payload[1];

    if (isCancelMove) {
      dispatch(setActivePosition(null));
      return;
    }

    const moveData = { start: activePosition, end: payload, change };

    console.log(`move ${JSON.stringify(moveData.start)} to ${JSON.stringify(moveData.end)}`);

    dispatch(setActivePosition(null))

    move(moveData)
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
} = gameSlice.actions;


export default gameSlice.reducer;
