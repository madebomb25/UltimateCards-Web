const demosTemplate = `
    <section class="background-demos scrollbar">
        <div class="bg0"></div>
        <div class="bg1"></div>
        <div class="bg2"></div>
        <div class="bg3"></div>
        <div class="bg4"></div>
        <div class="bg5"></div>
        <div class="bg6"></div>
        <div class="bg7"></div>
        <div class="bg8"></div>
        <div class="bg9"></div>
        <div class="bg10"></div>
    </section>`;

let currentMenu = null;
let menuType = null;

/*
Default data that the card inputs will use on startup. This object will be sent to the database 
on card saving with the updated or current values.
*/

let cardColors = {
    cardBox: {
        foreground: "#aa780e",
        background: "#5F3D0C",
        currentSVGId: "0",
    },
    portrait: {
        foreground: "#aa780e",
        background: "#5F3D0C",
        currentSVGId: "0",
    },
    titleBox: {
        background: "#61e174",
        foreground: "#111111",
    },
    description: {
        background: "#ffffff",
        foreground: "#111111",
    },
};

/*
This also acts as the above object. Default data and will be sent to the database when required.
*/

let cardImgsFile = {
    avatar: "",
    portraitBackground: "",
    cardBackground: "",
};

const defaultPortraitZoomPercentaje = 100; //Default zoom of the Avatar. We store it for resetting the image if needed.
let currentPortraitZoomPercentaje = defaultPortraitZoomPercentaje; //Initialized with the default value

/*
Open the background menu depending of the background that is being edited. If its the background, it just opens the inputs
for editing the background menu. Netherless, if the menu is opened by clicking the Avatar or the 'foreground' part of the card,
we open the foreground editing menu.
*/

function openBackgroundMenu(type) {
    if (currentMenu == null) {
        currentMenu = document.createElement("div");

        if (type == 0) {
            menuType = 0;

            alternateBackgroundOpener.style.backgroundColor = "#4B448B";
            alternateBackgroundOpener.firstElementChild.style.color = "white";

            portraitAvatar.style.cursor = "cell";
            currentMenu.innerHTML = `
                <div class="color-holder scrollbar">
                    <div class="foreground">
                        <input type="color" value="${cardColors.cardBox.foreground}">
                        <i class="fa-solid fa-paintbrush"></i>
                    </div>
                    <div class="background">
                        <input type="color" value="${cardColors.cardBox.background}">
                        <i class="fa-solid fa-brush"></i>
                    </div>
                    <div class="background-picker">
                        <i class="fa-solid fa-image"></i>
                        <input class="file" type="file" accept="image/png, image/jpeg, image/jpg">
                    </div>
                </div>
                <span></span>
            `;
        } else if (type == 1) {
            menuType = 1;
            alternateForegroundOpener.style.backgroundColor = "#4B448B";
            alternateForegroundOpener.firstElementChild.style.color = "white";
            currentMenu.innerHTML = `
                <div class="color-holder extended scrollbar">
                    <div class="foreground">
                        <input type="color" value="${cardColors.portrait.foreground}">
                        <i class="fa-solid fa-paintbrush"></i>
                    </div>
                    <div class="background">
                        <input type="color" value="${cardColors.portrait.background}">
                        <i class="fa-solid fa-brush"></i>
                    </div>
                    <div class="background-picker">
                        <i class="fa-solid fa-image"></i>
                        <input type="file" accept="image/png, image/jpeg, image/jpg">
                    </div>
                    <div class="portrait-picker">
                        <i class="fa-solid fa-user"></i>
                        <input type="file" accept="image/png, image/jpeg, image/jpg">
                    </div>
                    <button class="toggle-portrait">
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                    <button class="reset-portrait">
                        <i class="fa-solid fa-rotate-left"></i>
                    </button>
                    <button class="zoom-in-portrait">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                    </button>
                    <button class="zoom-out-portrait">
                        <i class="fa-solid fa-magnifying-glass-minus"></i>
                    </button>
                </div>
                <span></span>
            `;
        }

        currentMenu.innerHTML += demosTemplate; //Adding the existing possible backgrounds
        currentMenu.classList.add("background-manager");
        mainHolder.appendChild(currentMenu);

        if (isMobile()) {
            currentMenu.style.width = cardBackground.offsetWidth - 2 + "px";
            currentMenu.style.height = cardBackground.offsetHeight - 2 + "px";
            mainHolder.classList.add("mobile-background-settings");
        } else {
            currentMenu.style.width = cardBackground.offsetWidth + "px";
            //Having in count the extra border pixel of card-box.
            currentMenu.style.height = cardBackground.offsetHeight + "px";
            currentMenu.style.transform = "translateX(" + (card.offsetWidth + 10) + "px)";
            mainHolder.style.transform = "translateX(-" + (mainHolder.offsetWidth / 2 + 10) + "px)";
        }

        //mainHolder.style.transform = 'translateX(0px)' Truco para arreglar errores de renderizado con z-index al hacer click en cosas.

        //EVENT LISTENERS OF THE DIFFERENT OPTIONS

        //Color pickers
        const foregroundInput = document.querySelector(".color-holder .foreground input");
        const backgroundInput = document.querySelector(".color-holder .background input");

        //Image picker
        const backgroundImgInput = document.querySelector(".background-picker input");

        //Background demos box
        const backgroundDemos = document.querySelector(".background-demos");

        const SVGs = getSVGs();

        setCurrentColors(backgroundInput.value, foregroundInput.value, SVGs);

        if (menuType == 1) {
            const portraitImgInput = document.querySelector(".color-holder .portrait-picker input");
            portraitImgInput.addEventListener("input", (event) => {
                setImg(event.target.files[0], portraitAvatar);
                portraitAvatar.style.display = "flex";
                cardImgsFile.avatar = event.target.files[0];
            });

            const togglePortraitButton = document.querySelector(".color-holder .toggle-portrait");
            togglePortraitButton.addEventListener("click", () => {
                portraitAvatar.style.display = "none";
            });

            const resetPortrait = document.querySelector(".color-holder .reset-portrait");

            resetPortrait.addEventListener("click", () => {
                portraitAvatar.style.left = "";
                portraitAvatar.style.top = "";
                portraitAvatar.style.width = `${defaultPortraitZoomPercentaje}%`;
            });

            const zoomInPortraitButton = document.querySelector(".color-holder .zoom-in-portrait");

            zoomInPortraitButton.addEventListener("click", () => {
                currentPortraitZoomPercentaje += 10;
                portraitAvatar.style.width = `${currentPortraitZoomPercentaje}%`;
            });

            const zoomOutPortraitButton = document.querySelector(".color-holder .zoom-out-portrait");

            zoomOutPortraitButton.addEventListener("click", () => {
                currentPortraitZoomPercentaje -= 10;
                portraitAvatar.style.width = `${currentPortraitZoomPercentaje}%`;
            });
        }

        backgroundInput.addEventListener("input", () => {
            if (menuType == 1) {
                updateBackgroundColors(backgroundInput.value, portraitBackground);
                cardColors.portrait.background = backgroundInput.value;
            } else {
                updateBackgroundColors(backgroundInput.value, cardBackground);
                cardColors.cardBox.background = backgroundInput.value;
            }
            circles.forEach((e) => {
                e.style.backgroundColor = `${backgroundInput.value}`;
            });
        });

        foregroundInput.addEventListener("input", () => {
            if (menuType == 1) {
                updateSVGColors(foregroundInput.value, portraitBackground, SVGs, cardColors.portrait.currentSVGId);
                cardColors.portrait.foreground = foregroundInput.value;
            } else {
                updateSVGColors(foregroundInput.value, cardBackground, SVGs, cardColors.cardBox.currentSVGId);
                cardColors.cardBox.foreground = foregroundInput.value;
            }
        });

        backgroundImgInput.addEventListener("input", async (event) => {
            let img = event.target.files[0];
            if (menuType == 1) {
                setBackgroundImg(img, portraitBackground);
                cardImgsFile.portraitBackground = img;
            } else {
                setBackgroundImg(img, cardBackground);
                cardImgsFile.cardBackground = img;
            }

            event.target.value = ""; //Reset in the case the user selects the same file
        });

        backgroundDemos.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() == "div") {
                let clases = event.target.classList;
                let bgNum = null;

                for (let i = 0; i < clases.length; i++) {
                    if (clases[i].startsWith("bg")) {
                        //.match() is also a good alternative
                        bgNum = clases[i].substring(2);
                        break;
                    }
                }
                if (menuType == 1) {
                    if (bgNum == "0") {
                        applyBackgroundDemo(backgroundInput.value, foregroundInput.value, portraitBackground, null);
                    } else {
                        applyBackgroundDemo(backgroundInput.value, foregroundInput.value, portraitBackground, SVGs[bgNum - 1]);
                    }
                    cardColors.portrait.currentSVGId = bgNum;
                } else {
                    if (bgNum == "0") {
                        applyBackgroundDemo(backgroundInput.value, foregroundInput.value, cardBackground, null);
                    } else {
                        applyBackgroundDemo(backgroundInput.value, foregroundInput.value, cardBackground, SVGs[bgNum - 1]);
                    }
                    cardColors.cardBox.currentSVGId = bgNum;
                }
            }
        });
    }
}

// 

cardBackground.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-box") || (portraitBackground.contains(event.target) && !event.target.classList.contains("avatar"))) {
        if (event.target.classList.contains("card-box")) {
            openBackgroundMenu(0);
        } else {
            openBackgroundMenu(1);
        }
    }
});

/*
Tried to make the movement of the avatar using the transform property. Is easier to just calculate
the difference in the left/top properties, and it's efficient to do so because the image is centered
with position absolute inside of a div element (with position relative), so it does not take the 
whole screen coordinates to operate.

In any case (using left/top or transform properties), both solutions require to keep track of the current
position of the container and clear its position if a reset is requested from the reset button. That can be
done by resetting the left/top properties or to set the transform property to 0 (depending on the approach used).

Anyway, moving the element with a transform property requires an extra step, which is to calculate the center of the
image (because the movement in this case would be realted to the center of the element).
*/

let isDragging = false;

let initialX;
let initialY;

let currentPortraitX;
let currentPortraitY;


////////// CARD AVATAR DRAGGING FUNCTIONS //////////

portraitAvatar.addEventListener("click", () => {
    openBackgroundMenu(1);
});

portraitAvatar.addEventListener("dragstart", (event) => {
    event.preventDefault();
});

const startDragging = (event) => {
    isDragging = true;
    portraitAvatar.style.cursor = "grabbing";

    if (event.type === "mousedown") {
        initialX = event.clientX;
        initialY = event.clientY;
    } else if (event.type === "touchstart") {
        initialX = event.touches[0].clientX;
        initialY = event.touches[0].clientY;
    }

    currentPortraitX = portraitAvatar.offsetLeft;
    currentPortraitY = portraitAvatar.offsetTop;
};

const drag = (event) => {
    if (isDragging) {
        /*
        Expected to work only using the touchstart preventDefault(), but adding it again secures that wont
        fail on different browsers.
        */
        event.preventDefault();
        /*
        If the user isnt using a mouse (meaning that is on mobile) we take the inputs from the mobile events.
        */
        const deltaX = (event.type === "mousemove" ? event.clientX : event.touches[0].clientX) - initialX;
        const deltaY = (event.type === "mousemove" ? event.clientY : event.touches[0].clientY) - initialY;

        portraitAvatar.style.left = `${currentPortraitX + deltaX}px`;
        portraitAvatar.style.top = `${currentPortraitY + deltaY}px`;
    }
};

const stopDragging = () => {
    isDragging = false;
    portraitAvatar.style.cursor = "grab";
};

portraitAvatar.addEventListener("mousedown", (event) => {
    startDragging(event);
});
portraitAvatar.addEventListener("touchstart", (event) => {
    /*
    Evading page scroll while using touch events to move the avatar.
    */
    event.preventDefault();
    startDragging(event);
});

document.addEventListener("mousemove", (event) => {
    drag(event);
});

document.addEventListener("touchmove", (event) => {
    drag(event);
});

document.addEventListener("mouseup", stopDragging);
document.addEventListener("touchend", stopDragging);


////////////// CARD COLOR INPUT FUNCTIONS /////////////////

//Called for setting up the current card colors for the color inputs when the page loads.

const setCurrentColors = (backgroundColor, foregroundColor, SVGs) => {
    document.querySelector(".color-holder .background i").style.color = `${invertColor(backgroundColor, true, document.querySelector(".color-holder .background"))}`;
    document.querySelector(".color-holder .background").style.backgroundColor = `${backgroundColor}`;

    document.querySelector(".color-holder .foreground i").style.color = `${invertColor(foregroundColor, true, document.querySelector(".color-holder .foreground"))}`;
    document.querySelector(".color-holder .foreground").style.backgroundColor = `${foregroundColor}`;

    for (i = 0; i <= 10; i++) {
        document.querySelector(`.bg${i}`).style.backgroundColor = `${backgroundColor}`;
        if (i != 0) {
            document.querySelector(`.bg${i}`).style.backgroundImage = SVGs[i - 1].replace(/fill='%23[0-9A-Fa-f]{6}'/, `fill='%23${foregroundColor.replace("#", "")}'`);
        }
    }
};

const updateSVGColors = (foregroundColor, target, SVGs, SVGId) => {
    document.querySelector(".color-holder .foreground i").style.color = `${invertColor(foregroundColor, true, document.querySelector(".color-holder .foreground"))}`;
    document.querySelector(".color-holder .foreground").style.backgroundColor = `${foregroundColor}`;

    if (SVGId != "0") {
        /*
        If the styles are applied to a background without a SVG and there is currently an image, 
        it will deform itself due to the styles.
        */
        target.style.backgroundSize = "auto";
        target.style.backgroundRepeat = "repeat";

        target.style.backgroundImage = SVGs[SVGId - 1].replace(/fill='%23[0-9A-Fa-f]{6}'/, `fill='%23${foregroundColor.replace("#", "")}'`);
    }

    for (i = 1; i <= 10; i++) {
        document.querySelector(`.bg${i}`).style.backgroundImage = SVGs[i - 1].replace(/fill='%23[0-9A-Fa-f]{6}'/, `fill='%23${foregroundColor.replace("#", "")}'`);
    }
};

const updateBackgroundColors = (backgroundColor, target) => {
    document.querySelector(".color-holder .background i").style.color = `${invertColor(backgroundColor, true, document.querySelector(".color-holder .background"))}`;
    document.querySelector(".color-holder .background").style.backgroundColor = `${backgroundColor}`;
    target.style.backgroundColor = `${backgroundColor}`;

    for (i = 0; i <= 10; i++) {
        document.querySelector(`.bg${i}`).style.backgroundColor = `${backgroundColor}`;
    }
};

const applyBackgroundDemo = (backgroundColor, foregroundColor, target, SVG) => {
    target.style.backgroundColor = backgroundColor;
    if (SVG == null) {
        target.style.backgroundImage = "none";
    } else {
        target.style.backgroundSize = "auto";
        target.style.backgroundRepeat = "repeat";
        target.style.backgroundPosition = "initial";

        target.style.backgroundImage = SVG.replace(/fill='%23[0-9A-Fa-f]{6}'/, `fill='%23${foregroundColor.replace("#", "")}'`);
    }
};

const getSVGs = () => {
    let svgList = [];
    for (i = 1; i <= 10; i++) {
        const SVG = window.getComputedStyle(document.querySelector(`.bg${i}`)).backgroundImage;
        svgList.push(SVG);
    }
    return svgList;
};

/////////////////////////// MENU CLOSER /////////////////////////////

//Was used for mobile responsive, they do not have a use now until we fix responsive on those devices.
const temporalMenuClasses = ["mobile-title-settings", "mobile-background-settings", "mobile-desc-settings"];

const closeMenu = () => {
    currentMenu.style.transform = "translate(0, 0)";
    mainHolder.style.transform = "translate(0, 0)";
    /*removing any transformations in all axis*/

    //The limitation of this checkout is if we need to add more than one class to the element
    if (currentMenu != null) {
        if (mainHolder.classList.length < 2) {
            //We are on a PC

            //Doesn't halt the web, it's async.
            setTimeout(() => {
                currentMenu.remove();
                currentMenu = null;
            }, 100);
        } else {
            //We are on mobile
            currentMenu.remove();
            currentMenu = null;
            //Parses all the elements in the array as arguments to remove them one by one
            mainHolder.classList.remove(...temporalMenuClasses);
        }
    }
};

const closeDescMenu = () => {
    currentMenu.style.transform = "translate(0, 0)";
    mainHolder.style.transform = "translate(0, 0)";
    /*removing any transformations in all axis*/

    //The limitation of this checkout is if we need to add more than one class to the element
    if (currentMenu != null) {
        if (mainHolder.classList.length < 2) {
            //We are on a PC

            //Doesn't halt the web, it's async.
            setTimeout(() => {
                currentMenu = null;
            }, 100);
        } else {
            //We are on mobile
            currentMenu = null;
            //Parses all the elements in the array as arguments to remove them one by one
            mainHolder.classList.remove(...temporalMenuClasses);
        }
    }
};

function closeSkillMenu() {
    menuType = null;
    currentMenu = null;
    skillTower.classList.remove("animate__slideInUp");
    skillTower.classList.add("animate__slideOutDown");

    alternateSkillOpener.style.backgroundColor = "transparent";
    alternateSkillOpener.firstElementChild.style.color = "#4B448B";
}

/*
If we close the menu on resize and the current device is mobile and the menu includes any text input, 
it will close the menu due to the page resize when the mobile keyboard is displayed. If the device is
mobile, it wont resize and so we dont need to close any menu.

Will be off until we fix responsive on Tailwind.

window.addEventListener("resize", () => {
    if (currentMenu != null && !isMobile()) {
        if (menuType != 3 || menuType != 4) {
            closeMenu();
        } else if (menuType == 3) {
            closeSkillMenu();
        } else if (menuType == 4) {
            closeDescMenu();
        }
    }
});
*/

/*
Takes a color and converts it to his opposite value on the color wheel.

Used to know if we need a black or white color to make a perfect contrast with the icons.
*/

// Taken from Stackoverflow. Funtions made by Onur Yildirim. Adapted by Alex.
function invertColor(hex, bw, inputUsing = null) {
    if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    if (bw) {
        let color = r * 0.299 + g * 0.587 + b * 0.114;
        // https://stackoverflow.com/a/3943023/112731

        if (color > 186) {
            if (color == 255 && inputUsing != null) {
                inputUsing.style.border = "2px solid black";
            } else if (inputUsing != null) {
                inputUsing.style.border = "transparent";
            }

            return "#000000";
        } else {
            if (inputUsing != null) {
                inputUsing.style.border = "transparent";
            }
            return "#FFFFFF";
        }
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}
