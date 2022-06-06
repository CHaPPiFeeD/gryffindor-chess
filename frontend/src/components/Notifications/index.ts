import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { RootState } from '../../store'
import { resetNotifications } from '../../store/notification/notificationSlise'


export const Notifications = () => {
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useAppDispatch()

  const selectNotifications = (state: RootState) => state.notification.notifications

  const notifications = useAppSelector(selectNotifications)
  

  useEffect(() => {
    if (notifications?.length) {
      console.log(11111, notifications)
      notifications.map((notification) => notification?.message ? enqueueSnackbar(notification?.message, { variant: notification?.type || 'info' }) : null)
      dispatch(resetNotifications())
    }
    

  }, [notifications])

  return null
}
