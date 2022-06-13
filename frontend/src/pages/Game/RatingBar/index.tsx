import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import API from '../../../api';
import styles from './styles.module.scss';

export const RatingBar = () => {
  const [stateRaiting, setStateRaiting] = useState<any>([]);

  useEffect(() => {
    API.getRate()
      .then((payload) => setStateRaiting(payload));
  }, []);

  return (
    <Box className={styles.content}>

      <Box className={styles.top_bar}>
        <Box>
          Parties
        </Box>
        <Box>
          Parties won
        </Box>
        <Box>
          Win rate
        </Box>
      </Box>

      <Box className={styles.rate_list}>
        {stateRaiting?.map((user: any, i: number) => {
          const rate = (user.partiesWon / user.parties * 100).toFixed(1);

          return (
            <Box key={i} className={styles.rate_item}>
              <Typography className={styles.name}>
                {`${i}. ${user.name}`}
              </Typography>

              <Box className={styles.statistic}>
                <Box className={styles.parameter}>
                  {user.parties}
                </Box>
                <Box className={styles.parameter}>
                  {user.partiesWon}
                </Box>
                <Box className={styles.parameter}>
                  {`${rate}%`}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

    </Box>
  );
};
