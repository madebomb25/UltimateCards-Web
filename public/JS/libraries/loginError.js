function deployLoginError(element) {
    let menuExists = document.querySelector('.login-error-box');
    if (!menuExists) {
        let errorBox = document.createElement('div');
        errorBox.classList.add('login-error-box');

        errorBox.innerHTML = `
        <h1><i class="fa-solid fa-circle-exclamation"></i>Incorrect credentials!</h1>
        <button>CLOSE</button>
    `;

        element.appendChild(errorBox);

        const closeButton = document.querySelector('.login-error-box button');

        closeButton.addEventListener('click', () => {
            errorBox.remove();
        });
    }
}