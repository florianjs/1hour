/**
 * Abstracting the Chrome Storage.
 */
const Storage = () => {

    const getItem = (key) => new Promise((resolve) => {
        chrome.storage.local.get(null, (data) => {
            resolve(data[key] || undefined)
        })
    })

    const setItem = (key, value) => new Promise((resolve) => {
        chrome.storage.sync.set({key: value}, () => {
            resolve(value)
        });
    })

    return { getItem, setItem }

}