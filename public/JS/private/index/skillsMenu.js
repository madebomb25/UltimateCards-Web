let skill = null; // Current selected skill object.

let skills = []; // Skills downloaded from the database.

let currentSkillId = null; // Current selected skill ID,.

let currentIcon;

let currentFilter = -1; // By default, there is no color filter.

/*
TYPES:
0 - Legend
1 - Champion
2 - Object/Spells
*/

let currentType = 0; // By default, the card type and skill is a 'Legend'

// Current parameters set to filter skills in the database by the search bar or the color selecting menu.
let searchSkillQuery = {
    name: '',
    color: null,
    type: null,
}

function openSkillMenu() {
    if (currentMenu == null) {
        menuType = 3;
        currentMenu = skillTower;

        alternateSkillOpener.style.backgroundColor = "#4B448B";
        alternateSkillOpener.firstElementChild.style.color = "white";

        switchCardTypeMenu(currentType);

        skillTower.classList.remove("hidden");
        skillTower.classList.add("flex", "animate__slideInUp");
    }
}

skillIcon.addEventListener("click", (event) => {
    openSkillMenu();
});

skillSwitchLegend.addEventListener("click", () => {
    switchCardTypeMenu(0);
});

skillSwitchChampion.addEventListener("click", () => {
    switchCardTypeMenu(1);
});

skillSwitchObject.addEventListener("click", () => {
    switchCardTypeMenu(2);
});

function switchCardTypeMenu(type = 0) {

    currentType = type;
    searchSkillQuery.type = type;

    loadSkills(searchSkillQuery);

    skillTowerText.classList.remove("bg-red-500", "bg-yellow-300", "bg-green-500");

    if (currentType == 0) {
        skillTowerText.textContent = "LEGEND SKILLS";
        rankbox2.textContent = "LEGEND";
        skillTowerText.classList.add("bg-yellow-300");
    } else if (currentType == 1) {
        skillTowerText.textContent = "CHAMPION SKILLS";
        rankbox2.textContent = "CHAMPION";
        skillTowerText.classList.add("bg-red-500");
    } else if (currentType == 2) {
        skillTowerText.textContent = "OBJECT SKILLS";
        rankbox2.textContent = "OBJECT";
        skillTowerText.classList.add("bg-green-500");
    }
}

////////////// SEARCH BAR ///////////////

let skillSearchTemp;

skillSearchInput.addEventListener('keyup', (e) => {
    clearTimeout(skillSearchTemp);
    // Inicia un nuevo temporizador
    skillSearchTemp = setTimeout(() => {
        searchSkillQuery.name = e.target.value;
        loadSkills(searchSkillQuery);
    }, 300);
});

function updateBarColorBtns(id) {
    const elements = Array.from(filterByColor.children);

    if (id == searchSkillQuery.color) {
        searchSkillQuery.color = null;
    } else {
        searchSkillQuery.color = id;
    }

    for (let i = 0; i < elements.length; i++) {
        if (i != searchSkillQuery.color) {
            elements[i].classList.remove("border-[.3em]");
        } else {
            elements[id].classList.add("border-[.3em]");
        }
    }

    loadSkills(searchSkillQuery);
}

/*
We get the skills from the database and load them into the menu. We also load them into the 'skill'
variable to get their data when clicked.
*/

async function loadSkills(filter = {}) {
    skillList.innerHTML = "";

    skills = await getJSONFromNode(filter, "http://localhost:3000/get-skills");

    skillList.innerHTML += `
        <button onclick="selectSkill(${null})" class="flex items-end justify-end rounded-[50%]">
            <i class="fa-solid fa-ban text-[4.8em] text-red-600"></i>
        </button>`;

    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        let color;

        if (skill.color == 0) {
            color = "bg-yellow-400";
        } else if (skill.color == 1) {
            color = "bg-green-400";
        } else if (skill.color == 2) {
            color = "bg-yellow-400";
        } else if (skill.color == 3) {
            color = "bg-yellow-400";
        }

        skillList.innerHTML += `
            <button onclick="selectSkill(${i})" class="relative flex min-h-[5em] min-w-[5em]  cursor-pointer items-end justify-end rounded-[50%] bg-primaryPurple">
                <div class="absolute h-full w-full overflow-hidden border-[.4em] rounded-[50%] border-primaryPurple">
                    <img class="object-cover" src="${skill.img}"/>
                </div>
                <span class="absolute flex justify-center items-center h-[1.5em] w-[1.5em] rounded-[50%] ${color}">
                    <p>${skill.power}</p>
                </span>
            </button>`;
    }
};

/*
We select an specific skill by his ID. We currently added the 'dontClose' parameter to fix a bug about menu closing
when using this function.
*/
async function selectSkill(id, dontClose = true) {

    if (id != null) {

        skill = skills[id];

        if (skill) {
            skillIcon.style.backgroundImage = `url(${skill.img})`;
            textarea.textContent = skill.desc;

            if (textarea.classList.contains('italic')) {
                textarea.classList.remove('italic');
            }

            closeSkillMenu();
            calculatePower();
        }
    } else {
        skill = null;

        skillIcon.style.backgroundImage = `url('')`;
        textarea.textContent = '';

        if (textarea.classList.contains('italic')) {
            textarea.classList.remove('italic');
        }

        calculatePower();

        if (dontClose) {
            closeSkillMenu();
        }
    }
}

//Checking that there is no illegal value placed in the stats.

function checkStatInput(target) {
    target.value = target.value.replace(/[^0-9]/g, '0');
    calculatePower();
}

function checkStatBlur(target) {
    if (target.value == '') {
        target.value = '0';
    }
    calculatePower();
}

////// STATS INPUT LISTENERS //////

damageElement.addEventListener('input', (e) => {
    checkStatInput(e.target);
});

healthElement.addEventListener('input', (e) => {
    checkStatInput(e.target);
});

damageElement.addEventListener('blur', (e) => {
    checkStatBlur(e.target);
});

healthElement.addEventListener('blur', (e) => {
    checkStatBlur(e.target);
});

// Calculating the current power and the card tier by that power.

function calculatePower() {

    let power;
    if (skill) {
        power = Number(damageElement.value) + Number(healthElement.value) + skill.power;
    }

    else {
        power = Number(damageElement.value) + Number(healthElement.value);
    }

    let tier;

    if (power >= 0) {
        tier = 'TIER I'
    }

    if (power >= 4) {
        tier = 'TIER II'
    }

    if (power >= 8) {
        tier = 'TIER III'
    }

    if (power >= 12) {
        tier = 'TIER IV'
    }

    rankbox1.textContent = tier;

    return power;
}
