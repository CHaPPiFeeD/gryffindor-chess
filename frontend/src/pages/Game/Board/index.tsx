import { Box } from '@mui/system';
import { GorizontallAxis } from './GorizontalAxis';
import { RenderBoard } from './RenderBoard';
import { VerticalAxis } from './VerticalAxis';
import styles from './styles.module.scss';


export const Board = () => {

  return (
    <Box className={styles.board}>
      <GorizontallAxis reverse />

      <Box className={styles.vericalAxisBox}>
        <VerticalAxis />

        <RenderBoard />

        <VerticalAxis reverse />
      </Box>

      <GorizontallAxis />
    </Box>
  );
};
