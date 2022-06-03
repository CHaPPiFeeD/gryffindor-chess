import { Box } from '@mui/system'
import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkEndGame, checkSocketConnection, getOfferDraw, leaveGame } from '../../api/socket'
import { useAppDispatch } from '../../hooks/redux'
import { path } from '../../router/constants'
import { setEndTime, setGame, setMessage } from '../../store/game/gameSlise'
import { setOpen } from '../../store/modal/modalSlise'
import { Board } from './Board'
import { InfoSidebar } from './InfoSidebar/indes'
import styles from './styles.module.scss'


export const Game = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    checkSocketConnection();

    checkEndGame((data: any) => {
      dispatch(setMessage(data))
      dispatch(setEndTime(data))
      dispatch(setOpen('endGame'))
      dispatch(setGame(data))
    })

    getOfferDraw(() => {
      dispatch(setOpen('draw'))
    })

    return () => {
      leaveGame();
      navigate(path.login());
    }
  }, [])

  return (
    <Box className={styles.wrapper}>
      <Board />
      <InfoSidebar />
    </Box>
  )
}
