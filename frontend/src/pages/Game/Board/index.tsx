import { Box } from '@mui/system'
import { GorizontallAxis } from './GorizontalAxis';
import { RenderBoard } from './RenderBoard';
import { VerticalAxis } from './VerticalAxis';
import styles from './styles.module.scss';

export const Board = () => {

  return (
    <Box className={styles.wrapper}>
      <GorizontallAxis style={{ transform: 'rotate(-180deg)' }} />

      <Box className={styles.vericalAxisBox}>
        <VerticalAxis />

        <RenderBoard />

        <VerticalAxis style={{ transform: 'rotate(-180deg)' }} />
      </Box>

      <GorizontallAxis />
    </Box>
  )
}
