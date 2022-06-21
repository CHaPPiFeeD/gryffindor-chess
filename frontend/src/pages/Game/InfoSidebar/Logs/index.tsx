import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Figure } from '../../../../components';
import { BLACK_FIGURES, WHITE_FIGURES } from '../../../../constants';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss';

export const Logs = () => {
  const { log: logStore } = useAppSelector(store => store.game);
  const logsEndRef = useRef(document.getElementById('logsEnd'));
  const [stateWhiteLog, setStateWhiteLog] = useState<string[]>([]);
  const [stateBlackLog, setStateBlackLog] = useState<string[]>([]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

    setStateWhiteLog([]);
    setStateBlackLog([]);

    logStore?.forEach((v: string) => {
      if (WHITE_FIGURES.includes(v.split('')[0]))
        setStateWhiteLog([...stateWhiteLog, v]);

      if (BLACK_FIGURES.includes(v.split('')[0]))
        setStateBlackLog([...stateBlackLog, v]);
    });
  }, [logStore]);

  return (
    <Box className={styles.logs}>
      <Box className={styles.logs_container} >

        {stateWhiteLog.length ? <LogsColumn color='white' /> : null}
        {stateBlackLog.length ? <LogsColumn color='black' /> : null}

      </Box>

      <Box ref={logsEndRef} id='logsEnd' />
    </Box>
  );
};

const LogsColumn = (props: { color: string }) => {
  const { log: logStore } = useAppSelector(store => store.game);
  const FIGURES = props.color === 'white' ? WHITE_FIGURES : BLACK_FIGURES;

  return (
    <Box className={styles.logs_column}>
      {logStore?.map((v: any, i: number) => {
        const letters = v?.split('');
        if (!FIGURES.includes(letters[0])) return;
        const startPos = '' + letters[1] + letters[2];
        const endPos = '' + letters[3] + letters[4];

        return (
          <Box key={i} className={styles.log_item}>
            <Box className={styles.figure_box}>
              <Figure cell={letters[0]} />
            </Box>

            <Typography >
              {[startPos, endPos].join('-')}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
