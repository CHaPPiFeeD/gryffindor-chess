import { Box } from '@mui/material'
import { WHITE_FIGURES, BLACK_FIGURES, FIGURES } from '../../constants'
import { Bishop } from './figures/Bishop'
import { King } from './figures/King'
import { Knight } from './figures/Knight'
import { Pawn } from './figures/Pawn'
import { Queen } from './figures/Queen'
import { Rook } from './figures/Rook'
import styles from './styles.module.scss'

export const Figure = (props: figurePropsType) => {
  const { cell } = props;

  let fill;

  if (WHITE_FIGURES.includes(cell)) fill = 'white'
  if (BLACK_FIGURES.includes(cell)) fill = '#333333'

  switch (true) {
    case cell === FIGURES.FOG:
      return (
        <Box className={styles.fog_wrapper}>
          <img src={require('./figures/fog.gif')} className={styles.figure} />
        </Box>
      )

    case cell.toLowerCase() === FIGURES.KING:
      return <King fill={fill} />

    case cell.toLowerCase() === FIGURES.QUEEN:
      return <Queen fill={fill} />

    case cell.toLowerCase() === FIGURES.BISHOP:
      return <Bishop fill={fill} />

    case cell.toLowerCase() === FIGURES.KNIGHT:
      return <Knight fill={fill} />

    case cell.toLowerCase() === FIGURES.ROOK:
      return <Rook fill={fill} />

    case cell.toLowerCase() === FIGURES.PAWN:
      return <Pawn fill={fill} />

    default:
      return null;
  }
}

type figurePropsType = {
  cell: string;
}
