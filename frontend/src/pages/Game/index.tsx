import { Box } from '@mui/system';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkEndGame,
  checkOpponentDisconnect,
  checkSocketConnection,
  exceptionHandler,
  getOfferDraw,
  leaveGame,
} from '../../api/socket';
import { MODAL } from '../../constants/modal';
import { useAppDispatch } from '../../hooks/redux';
import { path } from '../../router/constants';
import { setEndTime, setGame, setMessage } from '../../store/game/gameSlise';
import { setOpen, setClose } from '../../store/modal/modalSlise';
import { Board } from './Board';
import { InfoSidebar } from './InfoSidebar/indes';
import styles from './styles.module.scss';


export const Game = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    checkSocketConnection();
    exceptionHandler(dispatch);
    checkOpponentDisconnect((isDisconnect: boolean) => {
      console.log('disconnect opponent');
      if (isDisconnect) {
        dispatch(setOpen(MODAL.WAITING_FOR_OPPONENT));
      } else {
        dispatch(setClose(MODAL.WAITING_FOR_OPPONENT));
      }
    });

    window.onbeforeunload = (e) => {
      e.preventDefault();
      return confirm();
    };

    checkEndGame((data: any) => {
      console.log('end game');
      dispatch(setMessage(data));
      dispatch(setEndTime(data));
      dispatch(setOpen('endGame'));
      dispatch(setGame(data));
      window.onbeforeunload = null;
    });

    getOfferDraw(() => {
      dispatch(setOpen('draw'));
    });

    return () => {
      // leaveGame();
      // navigate(path.auth());
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <Box className={styles.wrapper}>
      <Board />
      <InfoSidebar />
    </Box>
  );
};
