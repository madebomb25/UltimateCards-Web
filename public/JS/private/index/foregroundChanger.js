let currentTitleBoxWidthPercentaje = 75;
let currentTitleFontSize = 23;

/*
Creates and opens the title menu. It uses the older system to create menus, but due to time
reasons we had to leave it this way.
*/

function openTitleMenu() {
    if (currentMenu == null) {
        menuType = 2;
        alternateTitleOpener.style.backgroundColor = "#4B448B";
        alternateTitleOpener.firstElementChild.style.color = "white";
        currentMenu = document.createElement("div");
        currentMenu.innerHTML = `
        <div class="title-box-options scrollbar">
            <div class="background">
                <input type="color" value="${cardColors.titleBox.background}">
                <i class="fa-solid fa-brush"></i>
            </div>
            <button class="decrease-box-width">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
            <button class="increase-box-width">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
            <div class="foreground">
                <input type="color" value="${cardColors.titleBox.foreground}">
                <i class="fa-solid fa-font"></i>
            </div>
            <button class="decrease-font-size">
                <i class="fa-solid fa-arrow-down"></i>
            </button>
            <button class="increase-font-size">
                <i class="fa-solid fa-arrow-up"></i>
            </button>
        </div>
        `;

        mainHolder.appendChild(currentMenu);
        currentMenu.classList.add("title-box-manager");


        //Mobile settings wont work properly due to the change to the Tailwind framework
        if (isMobile()) {
            currentMenu.style.width = cardBackground.offsetWidth + "px";
            currentMenu.style.height = cardBackground.offsetHeight / 3 + "px";
            mainHolder.classList.add("mobile-title-settings");
        } else {
            currentMenu.style.transform = `translateY(-${card.offsetHeight / 2 + 37}px)`;
            currentMenu.style.width = cardBackground.clientWidth / 1.1 + "px";
        }

        const titleBoxColorInput = document.querySelector(".title-box-manager .background input");
        const titleBoxColorBackground = document.querySelector(".title-box-manager .background");
        const titleBoxColorIcon = document.querySelector(".title-box-manager .background i");

        const titleBoxFontColorInput = document.querySelector(".title-box-manager .foreground input");
        const titleBoxFontColor = document.querySelector(".title-box-manager .foreground");
        const titleBoxFontColorIcon = document.querySelector(".title-box-manager .foreground i");

        //Applying default colors
        titleBoxColorBackground.style.backgroundColor = `${cardColors.titleBox.background}`;
        titleBoxColorIcon.style.color = `${invertColor(titleBoxColorInput.value, true)}`;

        titleBoxFontColor.style.backgroundColor = `${cardColors.titleBox.foreground}`;
        titleBoxFontColorIcon.style.color = `${invertColor(titleBoxFontColorInput.value, true)}`;

        /////// MENU INPUT MANAGEMENT ///////

        titleBoxColorInput.addEventListener("input", () => {
            titleBox.style.backgroundColor = `${titleBoxColorInput.value}`;
            titleBoxColorBackground.style.backgroundColor = `${titleBoxColorInput.value}`;
            titleBoxColorIcon.style.color = `${invertColor(titleBoxColorInput.value, true)}`;
            cardColors.titleBox.background = titleBoxColorInput.value;
        });

        const titleBoxDecreaseWidth = document.querySelector(".title-box-manager .decrease-box-width");

        titleBoxDecreaseWidth.addEventListener("click", () => {
            if (currentTitleBoxWidthPercentaje - 5 >= 50) {
                currentTitleBoxWidthPercentaje -= 5;
                titleBox.style.width = `${currentTitleBoxWidthPercentaje}%`;
            }
        });

        const titleBoxIncreaseWidth = document.querySelector(".title-box-manager .increase-box-width");

        titleBoxIncreaseWidth.addEventListener("click", () => {
            if (currentTitleBoxWidthPercentaje + 5 <= 100) {
                currentTitleBoxWidthPercentaje += 5;
                titleBox.style.width = `${currentTitleBoxWidthPercentaje}%`;
            }
        });

        titleBoxFontColorInput.addEventListener("input", () => {
            titleBoxFontColor.style.backgroundColor = `${titleBoxFontColorInput.value}`;
            titleBoxTextInput.style.color = `${titleBoxFontColorInput.value}`;
            titleBoxFontColorIcon.style.color = `${invertColor(titleBoxFontColorInput.value, true)}`;

            cardColors.titleBox.foreground = titleBoxFontColorInput.value;
        });

        const titleBoxIncreaseFontSize = document.querySelector(".title-box-manager .increase-font-size");

        titleBoxIncreaseFontSize.addEventListener("click", () => {
            currentTitleFontSize += 1;
            titleBoxTextInput.style.fontSize = `${currentTitleFontSize}px`;
        });

        const titleBoxDecreaseFontSize = document.querySelector(".title-box-manager .decrease-font-size");

        titleBoxDecreaseFontSize.addEventListener("click", () => {
            currentTitleFontSize -= 1;
            titleBoxTextInput.style.fontSize = `${currentTitleFontSize}px`;
        });
    }
}

titleBox.addEventListener("click", (event) => {
    if (titleBox.contains(event.target)) {
        openTitleMenu();
    }
});

statsColorInput.addEventListener("input", () => {
    let color = statsColorInput.value;
    document.querySelector(".card-footer .stats-box").style.backgroundColor = `${color}`;
});
