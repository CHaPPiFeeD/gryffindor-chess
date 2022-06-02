import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { surrender } from '../../../api/socket';
import { useAppSelector } from '../../../hooks/redux';
import { path } from '../../../router/constants';
import { Pawn } from '../../../components/Figure/figures/Pawn';
import styles from './styles.module.scss'
import { TimeTypography } from './TimeTypography';
import { Figure } from '../../../components';
import { Logs } from './Logs';
import { EatFigures } from './EatFigures';

export const InfoSidebar = () => {
  const navigate = useNavigate()
  const {
    moveQueue: moveQueueStore,
  } = useAppSelector(store => store.game)

  const handleClick = () => {
    surrender()
    navigate(path.login())
  }

  return (
    <Box className={styles.content}>
      <Box>
        <Typography component='h5' variant='h5' className={styles.move_queue}>
          Move: {moveQueueStore}
          <Box className={styles.pawn}>
            {moveQueueStore === 'white'
              ? <Pawn fill='white' />
              : <Pawn fill='#333333' />}
          </Box>
        </Typography>

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
