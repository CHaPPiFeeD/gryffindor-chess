import { Box, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Figure } from '../../../../components';
import { useAppSelector } from '../../../../hooks/redux';
import styles from './styles.module.scss';

export const Logs = () => {
  const { log: logStore } = useAppSelector(store => store.game);
  const logsEndRef = useRef(document.getElementById('logsEnd'));
  const [stateWhiteLog, setStateWhiteLog] = useState<LogType[]>([]);
  const [stateBlackLog, setStateBlackLog] = useState<LogType[]>([]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();

    setStateWhiteLog([]);
    setStateBlackLog([]);

    logStore?.forEach((v: LogType) => {
      if (v?.color === 'white') setStateWhiteLog([...stateWhiteLog, v]);
      if (v?.color === 'black') setStateBlackLog([...stateBlackLog, v]);
      console.log('working');
      
    });

    console.log(logStore);
    console.log(stateWhiteLog);
    console.log(stateBlackLog);
    
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
  console.log('work');
  

  return (
    <Box className={styles.logs_column}>
      {logStore?.map((v: any, i: number) => {
        if (v?.color !== props.color) return;
        const letters = v?.log.split('');
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

type LogType = {
  color: string,
  log: string,
}
