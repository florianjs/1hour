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

  return { getCurrentDate, compare };
};
