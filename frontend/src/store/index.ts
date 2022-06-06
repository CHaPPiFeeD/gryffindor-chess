import { configureStore } from '@reduxjs/toolkit'
import gameSlise from './game/gameSlise';
import modalSlise from './modal/modalSlise';
import notificationSlise from './notification/notificationSlise';

export const store = configureStore({
  reducer: {
    game: gameSlise,
    modals: modalSlise,
    notification: notificationSlise,
  },
  devTools: true,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
