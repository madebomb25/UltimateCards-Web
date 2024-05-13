
//Checking if device should be considered mobile.
function isMobile() {
    return window.matchMedia("(max-width: 460px), (max-height: 300px)").matches;
}

// Generic function to send data to an endpoint of our backend.

async function sendJSONToNode(data, url, callback = () => { }) {
    let xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        callback(xhr);
    };

    xhr.onerror = function () {
        callback(xhr);
    };

    xhr.send(JSON.stringify(data));
}

// Generic function to get data from an endpoint of our backend.

async function getJSONFromNode(data, url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.statusText);
            }
        };

        xhr.onerror = function () {
            reject("Error de red o de conexión");
        };

        xhr.send(JSON.stringify(data));
    });
}

////////////////// BLACK OR WHITE //////////////////

function whiteOrBlack(hex) {
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

    let color = r * 0.299 + g * 0.587 + b * 0.114;
    // https://stackoverflow.com/a/3943023/112731

    if (color > 140) {
        return "#000000";
    } else {
        return "#FFFFFF";
    }
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join("0");
    return (zeros + str).slice(-len);
}

function hexToRGB(hex) {
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

    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

//////////// SET IMGS ////////////////

const setImg = (img, target) => {
    target.src = window.URL.createObjectURL(img);
};

const setBackgroundImg = (img, target) => {
    let url = window.URL.createObjectURL(img);
    target.style.backgroundImage = `url(${url})`;
    target.style.backgroundSize = "cover";
    target.style.backgroundRepeat = "no-repeat";
    target.style.backgroundPosition = "center";
};

const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });


////////// DISPLAY GENERIC ERRORS ////////////

function displayError(text, icon, target) {
    target.style.display = 'flex';
    target.innerHTML = `
    <i class="fa-solid ${icon} text-[1.3em]"></i>
    <p>${text}</p>
    `;
}
