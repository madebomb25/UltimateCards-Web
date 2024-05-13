//// MAX SIZES FOR FIELDS & DEFAULT BEHAVIOUR PREVENTION ////
textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
    }
});

////// MAX SIZES FOR FIELDS & DEFAULT BEHAVIOUR PREVENTION //////
function modifyEditableContent(e, maxLength) {
    if (e.key == "Enter") {
        e.preventDefault();
    } else {
        if (e.target.innerText.length > maxLength && e.key != "Backspace") {
            e.preventDefault();
        }
    }
}

/////////////////// ALTERNATE OPENERS ////////////////////////

alternateForegroundOpener.addEventListener("click", () => {
    openBackgroundMenu(1);
});

alternateBackgroundOpener.addEventListener("click", () => {
    openBackgroundMenu(0);
});

alternateSkillOpener.addEventListener("click", () => {
    openSkillMenu();
});

alternateTitleOpener.addEventListener("click", () => {
    openTitleMenu();
});

alternateDescOpener.addEventListener("click", () => {
    openDescMenu();
});

/////////////////// MANAGE CARD MENUS ///////////////////

document.body.addEventListener("click", (event) => {
    if (currentMenu != null) {
        if (menuType == 0 && !currentMenu.contains(event.target) && !event.target.classList.contains("card-box") && !alternateBackgroundOpener.contains(event.target)) {
            alternateBackgroundOpener.style.backgroundColor = "transparent";
            alternateBackgroundOpener.firstElementChild.style.color = "#4B448B";
            closeMenu();
        } else if (menuType == 1 && !portraitBackground.contains(event.target) && !currentMenu.contains(event.target) && !alternateForegroundOpener.contains(event.target)) {
            alternateForegroundOpener.style.backgroundColor = "transparent";
            alternateForegroundOpener.firstElementChild.style.color = "#4B448B";
            closeMenu();
        } else if (menuType == 2 && !currentMenu.contains(event.target) && !titleBox.contains(event.target) && !alternateTitleOpener.contains(event.target)) {
            alternateTitleOpener.style.backgroundColor = "transparent";
            alternateTitleOpener.firstElementChild.style.color = "#4B448B";
            closeMenu();
        } else if (menuType == 3 && !currentMenu.contains(event.target) && !skillIcon.contains(event.target) && !alternateSkillOpener.contains(event.target)) {
            closeSkillMenu();
        } else if (menuType == 4 && !currentMenu.contains(event.target) && !textarea.contains(event.target) && !alternateDescOpener.contains(event.target)) {
            alternateDescOpener.style.backgroundColor = "transparent";
            alternateDescOpener.firstElementChild.style.color = "#4B448B";
            closeDescMenu();
        }
    }
});

closeSkillButton.addEventListener("click", () => {
    closeSkillMenu();
});

skillTower.addEventListener("animationend", () => {
    if (menuType != 3) {
        skillTower.classList.remove("flex", "animate__slideOutDown");
        skillTower.classList.add("hidden");
    }
});

////////////////////// LOGOUT /////////////////////

logoutButton.addEventListener("click", () => {
    sendJSONToNode({}, "http://localhost:3000/logout", (xhr) => {
        if (xhr.status >= 200 && xhr.status < 300) {
            let logoutError = xhr.responseText === "true";

            if (logoutError) {
                console.log("Error on logout!");
            } else {
                loginButton.style.display = "flex";
                logoutButton.style.display = "none";
                console.log("Sucessful logout!");
            }
        } else {
            console.error("Error sending data for logout.");
        }
    });
});

//////// SWITCHING BETWEEN CARD MODES ////////

let isCustom = false;
switchCardModeBtn1.addEventListener("click", () => {
    if (isCustom) {
        isCustom = false;
        switchCardModeBtn1.classList.add("animate__animated", "animate__bounceIn");
        switchCardModeBtn1.style.color = "white";
        switchCardModeBtn1.style.background = "#524AA6";
        switchCardModeBtn1.style.fontStyle = "italic";

        switchCardModeBtn2.style.color = "black";
        switchCardModeBtn2.style.background = "transparent";
        switchCardModeBtn2.style.fontStyle = "normal";
    }
});

switchCardModeBtn2.addEventListener("click", () => {
    if (!isCustom) {
        isCustom = true;
        switchCardModeBtn2.classList.add("animate__animated", "animate__bounceIn");
        switchCardModeBtn2.style.color = "white";
        switchCardModeBtn2.style.background = "#524AA6";
        switchCardModeBtn2.style.fontStyle = "italic";

        switchCardModeBtn1.style.color = "black";
        switchCardModeBtn1.style.background = "transparent";
        switchCardModeBtn1.style.fontStyle = "normal";
    }
});

switchCardModeBtn1.addEventListener("animationend", () => {
    switchCardModeBtn1.classList.remove("animate__animated", "animate__bounceIn");
});

switchCardModeBtn2.addEventListener("animationend", () => {
    switchCardModeBtn2.classList.remove("animate__animated", "animate__bounceIn");
});

///////////// UPLOAD CARD DATA /////////////

cardUpload.addEventListener('click', async () => {

    const data = {
        name: titleBoxTextInput.value,
        render: await htmlToImage.toPng(card),
    }

    if (skill) {
        data.type = skill.type;
        data.color = skill.color;
    } else {
        data.type = 0;
    }

    console.log('Intentando guardar la carta...');

    sendJSONToNode(data, "http://localhost:3000/save-card", (xhr) => {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Successfully send card data')
        } else {
            console.error("Error on sending card data");
        }
    });

});

///////////// DOWNLOAD CARD /////////////

cardDownload.addEventListener('click', async () => {
    //Using html2image library to convert the card to a PNG file.
    htmlToImage.toPng(card)
        .then(function (dataUrl) {
            console.log(dataUrl);
            downloader.href = dataUrl;
            downloader.download = `${titleBoxTextInput.value.toLowerCase().replace(" ", "")}.png`;
            downloader.click();

        })
        .catch(function (error) {
            console.error('Error on image convertion:', error);
        }
        );
});

////////// HELP BOX HOVERS //////////

helpIcon.addEventListener("mouseover", () => {
    helpBox.style.display = "flex";
    helpBox.classList.add("animate__animated", "animate__headShake");
});

helpIcon.addEventListener("mouseout", () => {
    helpBox.style.display = "none";
    helpBox.classList.remove("animate__animated", "animate__headShake");
});

helpBox.addEventListener("animationend", () => {
    helpBox.classList.remove("animate__animated", "animate__headShake");
});


/////////// ON PAGE LOAD /////////////

document.addEventListener("DOMContentLoaded", function () {
    sendJSONToNode({}, "http://localhost:3000/is-logged", (xhr) => {
        if (xhr.status >= 200 && xhr.status < 300) {
            let isLogged = xhr.responseText === "true";

            if (isLogged) {
                console.log("Is logged!");
                logoutButton.style.display = "flex";
                loginButton.style.display = "none";
            } else {
                console.log("Not logged!");

                loginButton.style.display = "flex";
                logoutButton.style.display = "none";
            }
        } else {
            console.error("Error checking if user is logged.");
        }
    });
});
