import { createSlice } from '@reduxjs/toolkit';
import { move } from '../../api/socket';
import { ChangeFigureDataType, GameDataType } from '../../api/types';

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
  log: string[];
  eatFigures: {
    white: string[],
    black: string[],
  };
  lastMove: number[][],
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
  log: [],
  eatFigures: {
    white: [],
    black: [],
  },
  lastMove: [],
};

export const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    setGame: (state, { payload }: { payload: GameDataType }) => {
      state.players = payload.players || state.players;
      state.color = payload.color || state.color;
      state.board = payload.board;
      state.ways = payload.ways;
      state.moveQueue = payload.moveQueue;
      state.gameStartTime = payload.gameStart || state.gameStartTime;
      state.gameEndTime = payload.gameEnd || initialState.gameEndTime;
      state.log = payload.log || initialState.log;
      state.eatFigures = payload.eatFigures || initialState.eatFigures;
      state.lastMove = payload.lastMove || state.lastMove;
      state.endGameMessage.title = payload.title;
      state.endGameMessage.message = payload.message;
      state.gameEndTime = payload.gameEnd || null;
    },
    setActivePosition: (state, action) => {
      state.activePosition = action.payload;
    },
    setEndPosition: (state, action) => {
      state.endPosition = action.payload;
    },
  },
});

export const setMove = (
  activePosition: [number, number] | null,
  payload: [number, number],
  change: ChangeFigureDataType,
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

    dispatch(setActivePosition(null));

    move(moveData);
  }
};

export const {
  setGame,
  setActivePosition,
  setEndPosition,
} = gameSlice.actions;


export default gameSlice.reducer;
