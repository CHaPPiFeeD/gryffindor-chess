import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { getUsers } from '../../../api/socket';
import { UsersQueueType } from '../../../api/types';
import styles from './styles.module.scss';
import { useAppDispatch } from '../../../hooks/redux';
import { CheckPawn } from './CheckPawn';

export const QueueList = () => {
  const dispatch = useAppDispatch();
  const [stateQueue, setStateQueue] = useState<UsersQueueType[]>([]);

  getUsers((queue: UsersQueueType[]) => {
    dispatch(setStateQueue(queue));
  });

  if (!stateQueue) return null;

  return (
    <Box className={styles.list}>

      {stateQueue?.map((value, index) => {

        return (
          <Box key={index} className={styles.item}>

            <Typography className={styles.name}>
              {value.name}
            </Typography>

            <Box className={styles.figure_box}>
              {value.color.map((v: string, i: number) => {

                return (<CheckPawn key={i} color={v} />);

              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
