import { Box } from '@mui/system';
import { useEffect } from 'react';
import {
  checkEndGame,
  checkOpponentDisconnect,
  checkSocketConnection,
  exceptionHandler,
  getOfferDraw,
} from '../../api/socket';
import { MODAL } from '../../constants/modal';
import { useAppDispatch } from '../../hooks/redux';
import { setGame } from '../../store/game/gameSlise';
import { setOpen, setClose } from '../../store/modal/modalSlise';
import { Board } from './Board';
import { InfoSidebar } from './InfoSidebar/indes';
import { RatingBar } from './RatingBar';
import styles from './styles.module.scss';

export const Game = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkSocketConnection();
    exceptionHandler(dispatch);

    checkOpponentDisconnect((isDisconnect: boolean) => {
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
      dispatch(setOpen('endGame'));
      dispatch(setGame(data));
      window.onbeforeunload = null;
    });

    getOfferDraw(() => {
      dispatch(setOpen('draw'));
    });

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return (
    <Box className={styles.wrapper}>
      <RatingBar />
      <Board />
      <InfoSidebar />
    </Box>
  );
};
