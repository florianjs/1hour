/**
 *
 * @param {number} timeStamp -> global timer in seconds
 * @param {number} delay -> max delay before redirection
 * @returns {string} -> formated string of hours, minutes seconds, each optional
 */
const getTimeLeft = (timeStamp, delay) => {
  let timeLeft = delay - timeStamp;
  const hours = Math.floor(timeLeft / 60 / 60);
  const minutes = Math.floor(timeLeft / 60) - hours * 60;
  const seconds = timeLeft % 60;
  const timeIsUp = timeLeft <= 0;
  return timeIsUp
    ? 'Time is up!'
    : `${hours ? hours + 'h ' : ''}${minutes ? minutes + 'min ' : ''}${
        seconds ? seconds + 's' : ''
      }`;
};

export { getTimeLeft };
