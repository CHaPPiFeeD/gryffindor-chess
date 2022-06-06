
import { createSlice } from '@reduxjs/toolkit'
import { VariantType } from 'notistack'
import { AppDispatch } from '..'

export type notificationType = {
  message?: string
  type?: VariantType
}

type initialStateTypes = {
  notifications: notificationType[] | null,
}

const initialState: initialStateTypes = {
  notifications: [],
}

const notificationsReducer = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state: initialStateTypes, actions: { payload: notificationType[] }) => {
      state.notifications = actions.payload
    },
    resetNotifications: (state: initialStateTypes) => {
      state.notifications = null
    },
  },
})

export const { setNotifications, resetNotifications } = notificationsReducer.actions
export default notificationsReducer.reducer

export const showNotification = (message: string, type: VariantType = 'info') => async (dispatch: AppDispatch) => {
  dispatch(setNotifications([{ message, type }]))
}

export const handleError = (payload: notificationType[]) => (dispatch: AppDispatch) => {
  if (Array.isArray(payload)) {
    const processedErrors: notificationType[] = payload.filter((error: notificationType) => !!error?.message).map((error) => ({
      message: error?.message,
      type: 'error',
    }),
    )
    dispatch(setNotifications(processedErrors))
  }
}

