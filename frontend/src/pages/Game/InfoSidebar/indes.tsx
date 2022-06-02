import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { leaveGame } from '../../../api/socket';
import { path } from '../../../router/constants';
import styles from './styles.module.scss'
import { TimeTypography } from './TimeTypography';
import { Logs } from './Logs';
import { EatFigures } from './EatFigures';
import { MoveQueueTypography } from './MoveQueueTypofraphy';
import { PlayersName } from './PlayersNames';


export const InfoSidebar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    leaveGame()
    navigate(path.login())
  }

  return (
    <Box className={styles.content}>

      <Box className={styles.info}>
        <PlayersName />

        <Box className={styles.info_box_one}>
          <MoveQueueTypography />
          <TimeTypography />
        </Box>

        <Box className={styles.info_box_two}>
          <Logs />
          <EatFigures />
        </Box>
      </Box>

      <Button
        onClick={handleClick}
        variant='contained'
      >
        Surrender or go back
      </Button>
    </Box>
  )
};
