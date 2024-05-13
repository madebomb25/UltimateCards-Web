const deleteUserError = document.getElementById('delete-user-error');
const resetPasswordError = document.getElementById('reset-password-error');

/*
Closers for closing popups of the options in the settings menu.
*/
function closeDeletePopup() {
    closePopup('delete-user-popup');
    closePopup('delete-user-error');
}

function closeResetPopup() {
    closePopup('reset-password-popup');
    closePopup('reset-password-error');
}

/*
Sends a request to terminate the users account. The server will check if the password
provided is correct and if a session cookie is active. In case everything goes well, the user
will be deleted and the browser will load the home page.

Any errors during the process will be notified to the user by an alert box.
*/
async function deleteAccount() {
    const pass = document.getElementById('delete-password').value;

    if (document.getElementById('delete-accept').checked) {
        if (pass != '') {
            await sendJSONToNode({ password: pass }, "http://localhost:3000/delete-user", (xhr) => {
                const xhrCode = xhr.status;

                if (xhrCode >= 200 && xhrCode < 300) {
                    console.log(`${xhrCode} - ${xhr.responseText}`);
                    window.location.href = "index.html";

                } else {
                    console.error(`${xhrCode} - ${xhr.responseText}`);
                    displayError(xhr.responseText, "fa-circle-exclamation", deleteUserError);
                }
            });
        } else {
            displayError("Password is empty!", "fa-circle-exclamation", deleteUserError);
        }
    } else {
        displayError("Terms not accepted!", "fa-circle-exclamation", deleteUserError);
    }
}


/*
Sends a request to 
*/
async function resetPassword() {
    await sendJSONToNode({ password: resetPasswordPopup.querySelector('input').value }, "http://localhost:3500/delete-account", (xhr) => {
        const xhrCode = xhr.status;

        xhr.onload = function () {
            if (xhrCode >= 200 && xhrCode < 300) {
                console.log(`${xhrCode} - ${xhr.responseText}`);

            } else {
                console.error(`${xhrCode} - ${xhr.responseText}`);
            }
        };
    });
}

async function resetPassword() {
    const pass = document.getElementById('reset-password').value;
    const newPass = document.getElementById('reset-new-password').value;
    const newPassCopy = document.getElementById('reset-new-password-copy').value;

    if (pass != '' && newPass != '' && newPassCopy != '') {
        if (newPass == newPassCopy) {
            await sendJSONToNode({ password: pass, newpass: newPass }, "http://localhost:3500/reset-password", (xhr) => {
                const xhrCode = xhr.status;

                xhr.onload = function () {
                    if (xhrCode >= 200 && xhrCode < 300) {
                        console.log(`${xhrCode} - ${xhr.responseText}`);
                        closeResetPopup('reset-password-popup');

                    } else {
                        console.error(`${xhrCode} - ${xhr.responseText}`);
                        displayError(xhr.responseText, "fa-circle-exclamation", resetPasswordError);
                    }
                };

                xhr.onerror = function () {
                    displayError('Error on sending request', "fa-circle-exclamation", resetPasswordError);
                }
            });
        } else {
            displayError("Passwords dont match!", "fa-circle-exclamation", resetPasswordError);
        }
    } else {
        displayError("Unfilled fields!", "fa-circle-exclamation", resetPasswordError);
    }
}