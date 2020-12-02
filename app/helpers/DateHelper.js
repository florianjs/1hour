/**
 * Abstracting the Chrome Storage.
 */
const DateHelper = () => {

    /**
     * Get today's date.
     */
    const getCurrentDate = () => {
        console.log(new Date().toLocaleDateString());
        return new Date().toLocaleDateString();
    };

    /**
     * Compare today to another date
     * @param {string} date
     */
    const compare = (date) => {
        return date === getCurrentDate();
    };

    return { getCurrentDate, compare }

}