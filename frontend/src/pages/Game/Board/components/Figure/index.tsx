import { Box, style } from '@mui/system'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../store'
import styles from './styles.module.scss'

export const Figure = (props: coordinateType) => {
  const { row, col } = props;
  const boardState = useSelector((state: RootState) => state.board.board);
  const cell = boardState[row][col];

  switch (true) {
    case cell === FIGURES.FOG:
      return <img src={require('./img/fog.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.KING:
      return <img src={require('./img/white_king.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.QUEEN:
      return <img src={require('./img/white_queen.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.BISHOP:
      return <img src={require('./img/white_bishop.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.KNIGHT:
      return <img src={require('./img/white_knight.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.ROOK:
      return <img src={require('./img/white_rook.png')} className={styles.figure} />

    case cell === FIGURES.WHITE.PAWN:
      return <img src={require('./img/white_pawn.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.KING:
      return <img src={require('./img/black_king.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.QUEEN:
      return <img src={require('./img/black_queen.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.BISHOP:
      return <img src={require('./img/black_bishop.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.KNIGHT:
      return <img src={require('./img/black_knight.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.ROOK:
      return <img src={require('./img/black_rook.png')} className={styles.figure} />

    case cell === FIGURES.BLACK.PAWN:
      return <img src={require('./img/black_pawn.png')} className={styles.figure} />

    default:
      return null;
  }
}

const FIGURES = {
  WHITE: {
    KING: 'K',
    QUEEN: 'Q',
    BISHOP: 'B',
    KNIGHT: 'N',
    ROOK: 'R',
    PAWN: 'P',
  },
  BLACK: {
    KING: 'k',
    QUEEN: 'q',
    BISHOP: 'b',
    KNIGHT: 'n',
    ROOK: 'r',
    PAWN: 'p',
  },
  FOG: '~',
}

type coordinateType = {
  row: number;
  col: number;
}
