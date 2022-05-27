import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '..';
import { move } from '../../api/socket';
import { startGameDataType } from '../../api/types'

export type boardType = {
  board: string[][];
  ways: string[];
  color: string;
  activePosition: number[] | null;
}

const initialState: boardType = {
  board: [],
  ways: [],
  color: '',
  activePosition: null,
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

// Action creators are generated for each case reducer function
export const { setBoard, setActivePosition } = boardSlice.actions;

export default boardSlice.reducer;
