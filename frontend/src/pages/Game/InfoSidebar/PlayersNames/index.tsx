import { Typography } from '@mui/material';
import { Box } from '@mui/system'
import { Pawn } from '../../../../components/Figure/figures/Pawn';
import { useAppSelector } from '../../../../hooks/redux'
import styles from './styles.module.scss';

export const PlayersName = () => {
  const players = useAppSelector(store => store.game.players);

  return (
    <Box className={styles.content} >

      <Box className={styles.player} >
        <Box className={styles.figure_box} >
          <Pawn fill='white' />
        </Box>

        <Typography>
          {players.white}
        </Typography>
      </Box>

      <Box className={styles.player}>

        <Box className={styles.figure_box} >
          <Pawn fill='#333333' />
        </Box>

        <Typography>
          {players.black}
        </Typography>

      </Box>

    </Box>
  )
}
