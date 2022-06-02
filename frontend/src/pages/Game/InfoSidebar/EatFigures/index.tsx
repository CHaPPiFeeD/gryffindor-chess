import { Box } from '@mui/material'
import { Figure } from '../../../../components';
import { useAppSelector } from '../../../../hooks/redux'
import styles from './styles.module.scss'

export const EatFigures = () => {
  const { eatFigures: eatFiguresStore } = useAppSelector(store => store.game);

  if (eatFiguresStore === null) return null;

  return (
    <Box className={styles.wrapper}>
      <Box className={styles.figures_container} >

        {eatFiguresStore.map((v, i) => {
          
          return (
            <Box className={styles.figure_box} key={i} >
              <Figure cell={v} />
            </Box>
          )
        })}

      </Box>
    </Box>

  )
}
