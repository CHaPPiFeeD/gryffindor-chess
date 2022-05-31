import { Box, Button, Modal, Typography } from '@mui/material'
import { useState } from 'react';
import { Bishop } from '../../components/Figure/figures/Bishop';
import { Knight } from '../../components/Figure/figures/Knight';
import { Queen } from '../../components/Figure/figures/Queen';
import { Rook } from '../../components/Figure/figures/Rook';
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setClose } from '../../store/modal/modalSlise';
import styles from './styles.module.scss'

export const ChangeFigureModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modals.changeFigure);
  const colorStore = useAppSelector(state => state.game.color);
  const [stateValue, setStateValue] = useState('');

  const handleClose = () => {
    console.log(stateValue);


    if (!stateValue) return;

    dispatch(setClose('changeFigure'))
  }

  const fill = colorStore === 'white' ? 'white' : '#333333';

  const handleClick = (child: number, figure: string): void => {
    setStateValue(figure)

    const box = document.getElementById('figures_box')

    for (let i = 0; i < 4; i++) {
      box?.children[i].classList.remove(styles.figure_button_active)
    }

    box?.children[child].classList.add(styles.figure_button_active)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box className={styles.modal}>

        <Typography component='h6' variant='h6'>
          Choose figure!
        </Typography>

        <Box
          className={styles.figures_box}
          id='figures_box'
        >
          <Box
            className={styles.figure_button}
            onClick={() => handleClick(0, FIGURES.QUEEN)}
          >
            <Queen fill={fill} />
          </Box>
          <Box
            className={styles.figure_button}
            onClick={() => handleClick(1, FIGURES.BISHOP)}
          >
            <Bishop fill={fill} />
          </Box>
          <Box
            className={styles.figure_button}
            onClick={() => handleClick(2, FIGURES.KNIGHT)}
          >
            <Knight fill={fill} />
          </Box>
          <Box
            className={styles.figure_button}
            onClick={() => handleClick(3, FIGURES.ROOK)}
          >
            <Rook fill={fill} />
          </Box>
        </Box>

        <Button
          variant='contained'
          onClick={handleClose}
        >
          Choose
        </Button>

      </Box>
    </Modal>
  )
}

const FIGURES = {
  QUEEN: 'queen',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  ROOK: 'rook',
}
