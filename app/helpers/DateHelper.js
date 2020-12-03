/**
 * DateHelper
 */
const DateHelper = () => {

    /**
     * Get today's date.
     */
    const getCurrentDate = () => {
        return new Date().toLocaleDateString();
    };

    /**
     * Compare today to another date
     * @param {string} date
     */
    const compare = (date) => {
        return date === getCurrentDate();
    };

    /**
     *
     * @param {number} timer
     * @param {number} delay
     */
    const getTimeLeft = (timer, delay) => {
      const timeLeft = delay -timer;
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor(timeLeft % 60);
      const seconds = timeLeft - minutes * 60;
      return `${hours ? hours + "h " : ""}${minutes ? minutes + "min " : ""}${seconds}s`

    }


    return { getCurrentDate, compare, getTimeLeft }

}
