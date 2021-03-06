import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { leaveGame, offerDraw } from '../../../api/socket';
import { path } from '../../../router/constants';
import styles from './styles.module.scss';
import { TimeTypography } from './TimeTypography';
import { Logs } from './Logs';
import { EatFigures } from './EatFigures';
import { MoveQueueTypography } from './MoveQueueTypofraphy';
import { PlayersName } from './PlayersNames';
import { useState } from 'react';
import { useAppSelector } from '../../../hooks/redux';


export const InfoSidebar = () => {
  const navigate = useNavigate();
  const [stateDisabled, setStateDisabled] = useState(false);
  const endGame = useAppSelector(state => state.game.gameEndTime);

  const handleClickDraw = () => {
    setStateDisabled(true);
    offerDraw(true);

    setTimeout(() => {
      setStateDisabled(false);
    }, 60000);
  };

  const handleClick = () => {
    if (endGame) {
      navigate(path.auth());
    } else if (confirm('Do you really want to surrender?')) {
      leaveGame();
    }
  };

  return (
    <Box className={styles.content}>

      {/* <Box className={styles.info}> */}
      <PlayersName />

      <Box className={styles.info_box_one}>
        <MoveQueueTypography />
        <TimeTypography />
      </Box>

      <Box className={styles.info_box_two}>
        <Logs />
        <EatFigures />
      </Box>
      {/* </Box> */}

      <Box className={styles.button_box}>
        <Button
          onClick={handleClickDraw}
          variant='contained'
          disabled={stateDisabled}
        >
          Offer a draw
        </Button>

        <Button
          onClick={handleClick}
          variant='contained'
        >
          Surrender or go back
        </Button>
      </Box>

    </Box>
  );
};
