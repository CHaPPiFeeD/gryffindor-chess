import { Box, Typography } from '@mui/material';
import { Figure } from '../../../../components';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss';

export const EatFigures = () => {
  const {
    eatFigures: eatFiguresStore,
    color: colorStore,
  } = useAppSelector(store => store.game);

  if (eatFiguresStore === null) return null;

  let youEaten, opponentsEaten;

  if (colorStore === 'white') {
    youEaten = eatFiguresStore.white;
    opponentsEaten = eatFiguresStore.black;
  }

  if (colorStore === 'black') {
    youEaten = eatFiguresStore.black;
    opponentsEaten = eatFiguresStore.white;
  }

  return (
    <Box className={styles.wrapper}>

      <Box style={{ width: '100%', height: '220px' }}>
        <Typography className={styles.title}>
          You eated:
        </Typography>

        <Box className={styles.figures_container}>
          {youEaten?.map((v: string, i) => {
            return (

              <Box className={styles.figure_box} key={i} >
                <Figure cell={v} />
              </Box>

            );
          })}
        </Box>
      </Box>

      <Box style={{ width: '100%', height: '220px' }}>

        <Typography className={styles.title}>
          Opponent eated:
        </Typography>

        <Box className={styles.figures_container}>
          {opponentsEaten?.map((v: string, i) => {
            return (

              <Box className={styles.figure_box} key={i} >
                <Figure cell={v} />
              </Box>
            );

          })}
        </Box>
      </Box>

    </Box>
  );
};
