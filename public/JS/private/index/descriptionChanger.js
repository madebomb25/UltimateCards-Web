let currentDescDispersion = 0;
let currentOpacity = 1;

const descColorBackgroundInput = document.getElementById("desc-background-color");
const descColorBackground = document.querySelector(".desc-background");

const descExpandBackground = document.getElementById("desc-expand");
const descContractBackground = document.getElementById("desc-contract");

const descFontColorInput = document.getElementById("desc-font-color");
const descFontColorBackground = document.querySelector(".desc-foreground");

const descIncreaseFont = document.getElementById("desc-increase-font");
const descDecreaseFont = document.getElementById("desc-decrease-font");

/////////// DESCRIPTION CARD INPUTS MANAGEMENT //////////////

descColorBackgroundInput.addEventListener("input", () => {
    updateTextareaBackground();
});

descExpandBackground.addEventListener("click", () => {
    currentDescDispersion++;
    updateTextareaBackground();
});

descContractBackground.addEventListener("click", () => {
    currentDescDispersion--;
    updateTextareaBackground();
});

descFontColorInput.addEventListener("input", () => {
    cardColors.description.foreground = descFontColorInput.value;
    textarea.style.color = descFontColorInput.value;
    descFontColorBackground.style.background = cardColors.description.foreground;
});

descIncreaseFont.addEventListener("click", () => {
    if (currentOpacity.toFixed(1) < 1) {
        currentOpacity += 0.1;
        updateTextareaBackground();
    }
});

descDecreaseFont.addEventListener("click", () => {
    if (currentOpacity.toFixed(1) > 0) {
        currentOpacity -= 0.1;
        updateTextareaBackground();
    }
});

/*
Controls the color of the description background. There must exist a current background dispersion value in order to
apply the color. The dispersion controls how much color is dispersed around the background and how smooth it is.
*/

function updateTextareaBackground() {
    let rgb = hexToRGB(descColorBackgroundInput.value);
    cardColors.description.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${currentOpacity})`;
    descColorBackground.style.backgroundColor = cardColors.description.background;
    if (currentDescDispersion > 0) {
        textarea.style.backgroundColor = cardColors.description.background;
        textarea.style.boxShadow = `0px 0px 8px ${currentDescDispersion}px ${cardColors.description.background}`;
    } else {
        textarea.style.backgroundColor = "transparent";
        textarea.style.boxShadow = "none";
    }
}

/*
Opening the card description menu. It has functionalities to work on mobile, but due to the update to the
Tailwind framework it wont work as expected, only will work properly for computer screens.
*/

function openDescMenu() {
    if (currentMenu == null) {
        menuType = 4;
        currentMenu = descriptionMenu;
        currentMenu.style.display = 'flex';

        alternateDescOpener.style.backgroundColor = "#4B448B";
        alternateDescOpener.firstElementChild.style.color = "white";


        if (isMobile()) {
            mainHolder.classList.add("mobile-desc-settings");
        } else {
            currentMenu.style.transform = "translateX(" + (currentMenu.offsetWidth + 24) + "px)";
            mainHolder.style.transform = "translateX(-" + (mainHolder.offsetWidth / 2 + 10) + "px)";
        }

    }
}

///// DESCRIPTION CONTROL //////

textarea.addEventListener("click", (event) => {
    if (event.target.classList.contains("description")) {
        openDescMenu();
    }
});

descTextArea.addEventListener('input', function (event) {
    textarea.textContent = event.target.value;
    if (!textarea.classList.contains('italic')) {
        textarea.classList.add('italic');
    }

    /*
    This is a provisional fix for a bug that makes the menu to not close. This fix works properly but
    we want to find a better solution when we get some more time.
    */
    if (skill) {
        selectSkill(null, false);
    }
});
