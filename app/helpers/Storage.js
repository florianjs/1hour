/**
 * Abstracting the Chrome Storage.
 */
const Storage = () => {

    /**
     * Get an item from the Chrome Local Storage.
     * @param {string} key 
     */
    const getItem = (key) => new Promise((resolve) => {
        chrome.storage.local.get(null, (data) => {
            resolve(data[key] || undefined)
        })
    })

    /**
     * Set an item in the Chrome Local Storage.
     * @param {string} key 
     * @param {any} value 
     */
    const setItem = (key, value) => new Promise((resolve) => {
        chrome.storage.local.set({[key]: value}, () => {
            resolve(value)
        });
    })

    return { getItem, setItem }

}