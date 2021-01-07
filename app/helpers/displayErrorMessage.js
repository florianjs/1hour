function displayErrorMessage (message) {
    let errorMessage = document.getElementById('errorMessage')
    errorMessage.classList.remove('hidden');
    errorMessage.innerHTML = message;
}

export { displayErrorMessage };