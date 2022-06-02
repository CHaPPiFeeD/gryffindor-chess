export const getDifferenceTime = (time: Date | null, endTime: Date | null) => {

  if (!time) time = new Date();
  if (!endTime) endTime = new Date();

  const currentTime = new Date(endTime);

  const gameStart = new Date(time);

  const diffMls = currentTime.getTime() - gameStart.getTime();

  return formatBalanceInTime(diffMls);
}

const formatBalanceInTime = (ms: number): string => {
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const seconds = Math.floor((ms / 1000) % 60)

  const daysF = (days < 10) ? '0' + days : days
  const hoursF = (hours < 10) ? '0' + hours : hours
  const minutesF = (minutes < 10) ? '0' + minutes : minutes
  const secondsF = (seconds < 10) ? '0' + seconds : seconds

  const mm_ss = `${minutesF}:${secondsF}`
  const hh_mm_ss = `${hoursF}:${minutesF}:${secondsF}`
  const dd_hh_mm_ss = `${daysF}:${hoursF}:${minutesF}:${secondsF}`
  return !days ? !hours ?
    mm_ss :
    hh_mm_ss :
    dd_hh_mm_ss
}
