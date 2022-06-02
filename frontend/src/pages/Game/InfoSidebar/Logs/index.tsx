import { Box, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { Figure } from '../../../../components'
import { useAppSelector } from '../../../../hooks/redux'
import styles from './styles.module.scss'

export const Logs = () => {
  const { log: logStore } = useAppSelector(store => store.game)
  const logsEndRef = useRef(document.getElementById('logsEnd'))

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logStore]);

  console.log(logStore);
  
  return (
    <Box className={styles.logs}>

      {logStore.map((v: any, i: number) => {
        const letters = v?.log.split('');
        const startPos = '' + letters[1] + letters[2];
        const endPos = '' + letters[3] + letters[4];

        return (
          <Box key={i} className={styles.log_item}>
            <Box className={styles.figure_box}>
              <Figure cell={letters[0]} />
            </Box>

            <Typography >
              {[startPos, endPos].join(' - ')}
            </Typography>
          </Box>
        )
      })}

      <Box ref={logsEndRef} id='logsEnd' />
    </Box>
  )
}
