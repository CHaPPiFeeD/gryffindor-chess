import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import styles from './styles.module.scss';

export const RatingBar = () => {
  const [stateRaiting, setStateRaitin] = useState([
    { name: 'Chapka', parties: 65, partiesWon: 5 },
    { name: 'Ill', parties: 78, partiesWon: 9 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
    { name: 'Dmitry', parties: 84, partiesWon: 8 },
  ]);

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
        {stateRaiting.map((user, i) => {
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
