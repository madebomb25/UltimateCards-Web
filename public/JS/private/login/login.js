const continueRegister = document.getElementById('continue-register');
const noAccountLogin = document.getElementById('noaccount-login');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');

const lrError = document.getElementById('lr-error');
const termsAndConditions = document.getElementById('terms-conditions');

const loginTitle = document.getElementById('login-title');

// 0. Login, 1. Register
let loginMode = 0;


/*
Managing when buttons should show depending on the page state.
*/
noAccountLogin.addEventListener('click', () => {
    if (loginMode == 0) {
        loginMode = 1;
        loginTitle.textContent = 'REGISTER';
        confirmPassword.style.display = 'flex';
        termsAndConditions.style.display = 'flex';

        continueRegister.textContent = 'REGISTER >';
        noAccountLogin.textContent = 'ALREADY HAVE AN ACCOUNT?';
    } else {
        loginMode = 0;
        loginTitle.textContent = 'LOGIN';
        confirmPassword.style.display = 'none';
        termsAndConditions.style.display = 'none';

        continueRegister.textContent = 'CONTINUE >';
        noAccountLogin.textContent = 'DONT HAVE AN ACCOUNT?';
    }

    lrError.style.display = 'none';
});

/*
The login page has 2 states: login or register. When the user is registing we 
show the input fields related to the register parameters. When login, we show login 
parameters.

Also, depending on the state, we send a register or a login request with the data provided.
*/

continueRegister.addEventListener('click', () => {
    const e = emailInput.value;
    const pass = passwordInput.value;
    const rPassword = confirmPassword.querySelector('input').value;

    const callback = (xhr) => {
        if (xhr.status >= 200 && xhr.status < 300) {
            window.location.href = 'collections.html';
        } else {
            displayError(xhr.responseText, "fa-circle-exclamation", lrError);
        }
    }

    if (e != '' && pass != '') {
        if (loginMode == 0) {
            sendJSONToNode({ email: e, password: pass }, "http://localhost:3000/login", callback);
        } else {
            if (rPassword != '') {
                if (rPassword == pass) {
                    if (termsAndConditions.querySelector('input').checked) {
                        sendJSONToNode({ email: e, password: pass }, "http://localhost:3000/register", callback);
                    } else {
                        displayError("Terms & Conditions are not accepted!", "fa-circle-exclamation", lrError);
                    }

                } else {
                    displayError("Passwords don't match!", "fa-circle-exclamation", lrError);
                }
            } else {
                displayError("Unfilled fields left!", "fa-circle-exclamation", lrError);
            }
        }
    } else {
        displayError("Unfilled fields left!", "fa-circle-exclamation", lrError);
    }
});