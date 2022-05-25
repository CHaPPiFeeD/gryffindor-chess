import { Box } from '@mui/system'
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Figure } from './components/Figure';
import { GorizontallAxis } from './components/GorizontalAxis';
import { VerticalAxis } from './components/VerticalAxis';
import styles from './styles.module.scss';

export const Board = () => {
  const start = new Date()

  const boardState = useSelector((state: RootState) => state.board.board)
  const waysState = useSelector((state: RootState) => state.board.ways)
  const colorState = useSelector((state: RootState) => state.board.color)
  const boardRef = useRef(document.getElementById('board'))

  // console.log(boardRef.current?.children[0].children[0]);



  const handleClick = (e: any) => {
    const start = new Date()

    const row = +e.currentTarget.attributes.getNamedItem('data-row')?.value
    const col = +e.currentTarget.attributes.getNamedItem('data-col')?.value

    // waysState.forEach((v) => {
    //   const way = v.split('')

    //   const startPos = colorState === 'black'
    //     ? [Math.abs(+way[0] - 7), Math.abs(+way[1] - 7)]
    //     : [+way[0], +way[1]]

    //   const endPos = colorState === 'black'
    //     ? [Math.abs(+way[2] - 7), Math.abs(+way[3] - 7)]
    //     : [+way[2], +way[3]]

    //   const isStartPos = startPos[0] === row && startPos[1] === col;

    //   if (isStartPos) {
    //     const startCell: any = boardRef.current?.children[startPos[0]].children[startPos[1]];
    //     const endCell: any = boardRef.current?.children[endPos[0]].children[endPos[1]];

    //     endCell.classList.toggle(styles.active)
    //     endCell.addEventListener('click', (e: any) => {
    //       console.log(startCell);

    //       const figure = startCell.removeChild();
    //       endCell.appendChild(figure)
    //     })
    //   }
    // })

    console.log(e.currentTarget.attributes.getNamedItem('data-row')?.value);
    console.log(e.currentTarget.attributes.getNamedItem('data-col')?.value);

    e.currentTarget.classList.toggle(styles.active)

    const end = new Date()

    console.log(+end - +start);
  }

  const board: any[] = renderBoard(boardState, colorState, handleClick)


  const end = new Date()

  console.log(+end - +start);

  return (
    <Box className={styles.wrapper}>
      <GorizontallAxis style={{ transform: 'rotate(-180deg)' }} />

      <Box className={styles.vericalAxisBox}>
        <VerticalAxis />

        <Box className={styles.board} ref={boardRef} id='board'>
          {board}
        </Box>

        <VerticalAxis style={{ transform: 'rotate(-180deg)' }} />
      </Box>

      <GorizontallAxis />
    </Box>
  )
}

const renderBoard = (boardState: string[][], colorState: string, handleClick: any) => {
  const board: any = []

  boardState.forEach((v, i) => {

    const elementsRow: any = [];

    v.forEach((v, j) => {
      let row = i;
      let col = j;
      const number = i + j;

      if (colorState === 'black') {
        row = Math.abs(row - 7);
        col = Math.abs(col - 7);
      }

      const figure = (
        <Box
          className={number % 2 === 0 ? styles.cell_white : styles.cell_black}
          key={`${row}${col}`}
          id={`${row}${col}`}
          data-row={row}
          data-col={col}
          onClick={handleClick}
        >
          <Figure row={row} col={col} />
        </Box>
      )

      elementsRow.push(figure)
    })

    board.push(<Box style={{ display: 'flex' }}>{elementsRow}</Box>)
  })

  return board;
}
