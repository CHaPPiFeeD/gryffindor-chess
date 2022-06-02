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


export const InfoSidebar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    leaveGame()
    navigate(path.login())
  }

  return (
    <Box className={styles.content}>
      <Box>
        <MoveQueueTypography />
        <TimeTypography />
      </Box>

      <Box className={styles.info_box}>
        <Logs />
        <EatFigures />
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
