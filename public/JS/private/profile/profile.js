/////////////////// SWITCHING BETWEEN CARD MODES ///////////////////
let isCustom = false;
switchDeckModeBtn1.addEventListener("click", () => {
    if (isCustom) {
        isCustom = false;
        switchDeckModeBtn1.classList.add("animate__bounceIn");
        switchDeckModeBtn1.style.color = "white";
        switchDeckModeBtn1.classList.add("bg-alternate1");
        switchDeckModeBtn1.style.fontStyle = "italic";

        switchDeckModeBtn2.style.color = "black";
        switchDeckModeBtn2.classList.remove("bg-alternate1");
        switchDeckModeBtn2.style.fontStyle = "normal";
    }
});

switchDeckModeBtn2.addEventListener("click", () => {
    if (!isCustom) {
        isCustom = true;
        switchDeckModeBtn2.classList.add("animate__bounceIn");
        switchDeckModeBtn2.style.color = "white";
        switchDeckModeBtn2.classList.add("bg-alternate1");
        switchDeckModeBtn2.style.fontStyle = "italic";

        switchDeckModeBtn1.style.color = "black";
        switchDeckModeBtn1.classList.remove("bg-alternate1");
        switchDeckModeBtn1.style.fontStyle = "normal";
    }
});

switchDeckModeBtn1.addEventListener("animationend", () => {
    switchDeckModeBtn1.classList.remove("animate__bounceIn");
});

switchDeckModeBtn2.addEventListener("animationend", () => {
    switchDeckModeBtn2.classList.remove("animate__bounceIn");
});

///////////////// CARDS HANDLER /////////////////

let activeGroup = 0; // 0 - Decks, 1 - Designs
let inAnimation = false;

switchToDecks.addEventListener("click", () => {
    console.log(activeGroup);
    if (activeGroup == 1 && !inAnimation) {
        inAnimation = true;
        groupText.textContent = 'YOUR DECKS';
        decksGroup.classList.add("animate__slideInRight");
        designsGroup.classList.add("animate__slideOutLeft");
        decksGroup.style.display = "grid";
        activeGroup = 0;

        switchToDecks.querySelector('span').style.display = 'flex';
        switchToDesigns.querySelector('span').style.display = 'none';
    }
});

switchToDesigns.addEventListener("click", () => {
    console.log(activeGroup);
    if (activeGroup == 0 && !inAnimation) {
        loadDesigns();
        inAnimation = true;
        groupText.textContent = 'YOUR DESIGNS';
        decksGroup.classList.add("animate__slideOutLeft");
        designsGroup.classList.add("animate__slideInRight");
        designsGroup.style.display = "grid";
        activeGroup = 1;

        switchToDesigns.querySelector('span').style.display = 'flex';
        switchToDecks.querySelector('span').style.display = 'none';

    }
});

decksGroup.addEventListener("animationend", () => {
    // Deck group establishes as the actual one
    if (activeGroup == 0) {
        decksGroup.classList.remove("animate__slideInRight");
    } else {
        decksGroup.classList.remove("animate__slideOutLeft");
        decksGroup.style.display = "none";
    }

    inAnimation = false;
});

designsGroup.addEventListener("animationend", () => {
    // Design group establishes as the actual one
    if (activeGroup == 1) {
        designsGroup.classList.remove("animate__slideInRight");
        activeGroup = 1;
    } else {
        designsGroup.classList.remove("animate__slideOutLeft");
        designsGroup.style.display = "none";
    }

    inAnimation = false;
});

////////////////// POPUPS HANDLER ///////////////
function openPopup(id) {
    document.getElementById(id).style.display = 'flex';
}

function closePopup(id) {
    document.getElementById(id).style.display = 'none';
}

////////////// BANNER HANDLER ///////////////
let banner = {};

///////////////// COLOR INPUTS /////////////////

bannerFtColorInput.addEventListener("input", (e) => {
    banner.color = e.target.value;
    profileBannerText.style.color = e.target.value;
    bannerFtColorBox.style.backgroundColor = e.target.value;
    bannerFtColorI.style.color = whiteOrBlack(e.target.value);
});

bannerBgColorInput.addEventListener("input", (e) => {
    banner.bgColor = e.target.value;
    profileBanner.style.borderColor = e.target.value;
    profileBannerTextBg.style.backgroundColor = e.target.value;
    bannerBgColorBox.style.backgroundColor = e.target.value;
    bannerBgColorI.style.color = whiteOrBlack(e.target.value);
});


///////////////// BANNER IMAGE INPUTS /////////////////

profileImgInput.addEventListener("input", (e) => {
    setImg(e.target.files[0], profileBannerImg);
    profileBannerImg.style.backgroundColor = "transparent";
});

profileBackgroundInput.addEventListener("input", (e) => {
    profileBanner.style.backgroundImage = `url(${window.URL.createObjectURL(e.target.files[0])})`;
});



////////////// ON PAGE LOAD ///////////////

async function getUserData() {
    return new Promise((resolve, reject) => {
        console.log("Pidiendo renders!");
        let xhr = new XMLHttpRequest();

        xhr.open("POST", "http://localhost:3000/get-userdata", true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                let data = JSON.parse(xhr.response);
                resolve(data);
            } else {
                console.error("Error al pedir los datos del usuario");
            }
        };

        xhr.send(null);
    });
}

/*
Takes the requested card PNG render from the current render list and 
downloads it as PNG.
*/
async function aDownloader(id) {
    const dataUrl = allDesigns[id].render;
    downloader.href = dataUrl;
    downloader.download = `card.png`;
    downloader.click();
}

let allDesigns = [];

/*
Loads all the cards the user owns and attatchs a reference to the "aDownloader" function
to download the selected card on click.
*/
async function loadDesigns() {
    designsGroup.innerHTML = "";

    designsGroup.innerHTML += `
    <a href="index.html#card" class="flex h-[23em] w-[15em] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1em] border-[.4em] border-dashed border-alternate1 bg-white">
        <i class="fa-solid fa-square-plus text-[5em] text-alternate1"></i>
    </a>
    `;

    allDesigns = await getJSONFromNode({}, "http://localhost:3000/get-cards");

    for (let i = 0; i < allDesigns.length; i++) {
        const design = allDesigns[i];

        designsGroup.innerHTML += `
        <img onclick="aDownloader(${i})" src="${design.render}" class="h-[23em] w-[15em] cursor-pointer"/>
        `;
    }
}


/*
Gets and loads the profile banner data of the user. If no data is found, the page loads
the default banner.
*/
async function loadBanner(nickname) {
    banner = await getJSONFromNode({}, "http://localhost:3000/get-banner");

    if (banner.profileImg) {
        profileBannerImg.src = banner.profileImg;
    }
    else {
        profileBannerImg.src = './styles/img/genericProfile.jpg';
    }

    if (banner.backgroundImg) {
        profileBanner.style.backgroundImage = `url(${banner.backgroundImg})`;
    } else {
        profileBanner.style.backgroundImage = `url(./styles/img/genericBg.jpg)`;
    }


    profileBannerText.value = nickname;
    profileBannerText.style.color = banner.color;

    profileBanner.style.borderColor = banner.bgColor;
    profileBannerTextBg.style.backgroundColor = banner.bgColor;
}

/*
Updates the banner data. The server will handle if a change on the database is needed
or not depending if the data has changed.
*/
async function saveBanner() {

    if (profileImgInput.files.length != 0) {
        banner.profileImg = await toBase64(profileImgInput.files[0]);
    } else {
        delete banner.profileImg;
    }

    if (profileBackgroundInput.files.length != 0) {
        banner.backgroundImg = await toBase64(profileBackgroundInput.files[0]);
    } else {
        delete banner.backgroundImg;
    }

    banner.nickname = profileBannerText.value;

    sendJSONToNode(banner, "http://localhost:3000/save-banner");
}

/*
To do on page load.
*/
async function onPageLoad() {
    let userData = await getUserData();

    loadBanner(userData.nickname);

    //printRenders(designsGroup, userCards);
    console.log(userData);
}

onPageLoad();
