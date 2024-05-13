const deckColorSelector = document.getElementById("deck-color-selector");

let searchDeckDesignQuery = {
    name: '',
    color: null,
    type: null,
}

const designSearchBar = document.getElementById('deck-search-bar');

/*
Filtering by name after typing a name on the search bar. We also set a timeout ensuring
the user has already stopped typing before doing the request.
*/
let designSearchTemp;

designSearchBar.addEventListener('keyup', (e) => {
    clearTimeout(designSearchTemp);

    designSearchTemp = setTimeout(() => {
        searchSkillQuery.name = e.target.value;
        loadChooseDeckDesigns()
    }, 300);
});

/*
Allows switching between button for card colors in decks.
*/
function updateDeckColorBtns(id) {
    const elements = Array.from(deckColorSelector.children);

    if (id == searchDeckDesignQuery.color) {
        searchDeckDesignQuery.color = null;
        elements[id].classList.remove("border-[.3em]");
    } else {
        searchDeckDesignQuery.color = id;
        elements[id].classList.add("border-[.3em]");
    }

    for (let i = 0; i < elements.length; i++) {
        if (i != searchDeckDesignQuery.color) {
            elements[i].classList.remove("border-[.3em]");
        }
    }

    loadChooseDeckDesigns()
}

/*
Allows switching between button for card types in decks.
*/

const deckTypeSelector = document.getElementById("deck-type-selector");

function updateDeckTypeBtns(id) {
    const elements = Array.from(deckTypeSelector.children);

    if (id == searchDeckDesignQuery.type) {
        searchDeckDesignQuery.type = null;
    } else {
        searchDeckDesignQuery.type = id;
    }

    for (let i = 0; i < elements.length; i++) {
        if (i != searchDeckDesignQuery.type) {
            elements[i].classList.remove("bg-alternate1", "text-white");
        } else {
            elements[i].classList.add("bg-alternate1", "text-white");
        }
    }

    loadChooseDeckDesigns();
}

const deckList = document.getElementById('deck-list');

let chooseDesigns = [];

/*
Loads all the available cards and the selected ones for that deck. This function needs to be improved to
select deck cards apart from the first deck of the user.
*/

async function loadChooseDeckDesigns() {
    deckList.innerHTML = "";

    chooseDesigns = await getJSONFromNode({}, "http://localhost:3000/get-cards");
    console.log(chooseDesigns);
    for (let i = 0; i < chooseDesigns.length; i++) {
        const design = chooseDesigns[i];

        deckList.innerHTML += `
        <img onclick="selectDesign(${i})" src="${design.render}" class="cursor-pointer h-[24em]"/>
        `;
    }
}

let viewMode = false;
const modeText = document.getElementById("deck-mode-text");

/*
Allows switching from the view mode to the edit mode and viceversa on the deck editor.
After each mode change the deck cards relative to the mode are retrieved.
*/
function viewOrEdit(button) {
    viewMode = !viewMode;
    const icon = button.querySelector("i");

    if (viewMode) {
        loadDeckCards();
        button.classList.remove("bg-alternate1", "text-white");
        icon.classList.add("fa-eye");
        icon.classList.remove("fa-pen-to-square");
        modeText.textContent = "view mode";
    } else {
        loadChooseDeckDesigns();
        button.classList.add("bg-alternate1", "text-white");
        icon.classList.add("fa-pen-to-square");
        icon.classList.remove("fa-eye");
        modeText.textContent = "editing mode";
    }
}

/*
Only loads the current cards that are present on the deck.
*/
async function loadDeckCards() {
    deckList.innerHTML = "";

    const cards = await getJSONFromNode({ search: { num: currentDeckNum }, filter: searchDeckDesignQuery }, "http://localhost:3000/get-cards");

    for (let i = 0; i < cards.length; i++) {
        const design = cards[i];

        deckList.innerHTML += `
        <img onclick="selectDesign(${i})" src="${design.render}" class="cursor-pointer h-[24em]"/>
        `;
    }
}

const deckNumSelector = document.getElementById("deck-num-selector");

let currentDeckNum = 0;

/*
Allows switching decks on the deck editing menu.
*/
function updateDeckNumBtns(id) {
    const elements = Array.from(deckNumSelector.children);

    currentDeckNum = id;
    elements[id].classList.add("bg-alternate1", "text-white");

    for (let i = 0; i < elements.length; i++) {
        if (i != currentDeckNum) {
            elements[i].classList.remove("bg-alternate1", "text-white");
        }
    }
}

/*
Opens the deck editing menu and loads a deck depending on the deck selected on the page.
*/
async function updateAndOpenDeckManager(id) {
    updateDeckNumBtns(id);
    openPopup('deck-manager');
    loadChooseDeckDesigns();
}
