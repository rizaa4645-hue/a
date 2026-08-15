const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

const backgroundInput = document.getElementById("backgroundInput");
const secondaryInput = document.getElementById("secondaryInput");

const scaleSlider = document.getElementById("scale");
const scaleValue = document.getElementById("scaleValue");

const xInput = document.getElementById("x");
const yInput = document.getElementById("y");

const shadowToggle = document.getElementById("shadow");

const shadowOpacitySlider =
    document.getElementById("shadowOpacity");

const shadowOpacityValue =
    document.getElementById("shadowOpacityValue");

const shadowXInput =
    document.getElementById("shadowX");

const shadowYInput =
    document.getElementById("shadowY");

const shadowBlurSlider =
    document.getElementById("shadowBlur");

const shadowBlurValue =
    document.getElementById("shadowBlurValue");

const resetButton =
    document.getElementById("reset");

const downloadButton =
    document.getElementById("download");


let backgroundImage = null;
let secondaryImage = null;


// ========================================
// SETTINGS
// ========================================

const settings = {

    secondary: {
        scale: 1,
        x: 0,
        y: 0
    },

    shadow: {
        enabled: false,
        opacity: 60,
        x: 20,
        y: 20,
        blur: 30
    }

};


// ========================================
// LOAD IMAGE
// ========================================

function loadImage(file, callback) {

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {

        const image = new Image();

        image.onload = function () {

            callback(image);
            draw();

        };

        image.src = event.target.result;

    };

    reader.readAsDataURL(file);

}


// ========================================
// BACKGROUND
// ========================================

backgroundInput.addEventListener("change", function (event) {

    loadImage(
        event.target.files[0],
        function (image) {
            backgroundImage = image;
        }
    );

});


// ========================================
// SECONDARY
// ========================================

secondaryInput.addEventListener("change", function (event) {

    loadImage(
        event.target.files[0],
        function (image) {
            secondaryImage = image;
        }
    );

});


// ========================================
// SECONDARY SCALE
// ========================================

scaleSlider.addEventListener("input", function () {

    settings.secondary.scale = Number(this.value);

    scaleValue.textContent =
        settings.secondary.scale.toFixed(2);

    draw();

});


// ========================================
// SECONDARY X
// ========================================

xInput.addEventListener("input", function () {

    settings.secondary.x =
        Number(this.value) || 0;

    draw();

});


// ========================================
// SECONDARY Y
// ========================================

yInput.addEventListener("input", function () {

    settings.secondary.y =
        Number(this.value) || 0;

    draw();

});


// ========================================
// SHADOW TOGGLE
// ========================================

shadowToggle.addEventListener("change", function () {

    settings.shadow.enabled = this.checked;

    draw();

});


// ========================================
// SHADOW OPACITY
// ========================================

shadowOpacitySlider.addEventListener("input", function () {

    settings.shadow.opacity = Number(this.value);

    shadowOpacityValue.textContent =
        settings.shadow.opacity + "%";

    draw();

});


// ========================================
// SHADOW X
// ========================================

shadowXInput.addEventListener("input", function () {

    settings.shadow.x =
        Number(this.value) || 0;

    draw();

});


// ========================================
// SHADOW Y
// ========================================

shadowYInput.addEventListener("input", function () {

    settings.shadow.y =
        Number(this.value) || 0;

    draw();

});


// ========================================
// SHADOW BLUR
// ========================================

shadowBlurSlider.addEventListener("input", function () {

    settings.shadow.blur = Number(this.value);

    shadowBlurValue.textContent =
        settings.shadow.blur;

    draw();

});


// ========================================
// DRAW BACKGROUND
// ========================================

function drawBackground() {

    if (!backgroundImage) {

        ctx.fillStyle = "#202020";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        return;
    }

    const canvasRatio =
        canvas.width / canvas.height;

    const imageRatio =
        backgroundImage.width /
        backgroundImage.height;

    let width;
    let height;
    let x;
    let y;

    if (imageRatio > canvasRatio) {

        height = canvas.height;
        width = height * imageRatio;

        x = (canvas.width - width) / 2;
        y = 0;

    } else {

        width = canvas.width;
        height = width / imageRatio;

        x = 0;
        y = (canvas.height - height) / 2;

    }

    ctx.drawImage(
        backgroundImage,
        x,
        y,
        width,
        height
    );

}


// ========================================
// SECONDARY SIZE
// ========================================

function getSecondarySize() {

    return 1200 * settings.secondary.scale;

}


// ========================================
// SECONDARY POSITION
// ========================================

function getSecondaryPosition() {

    const size = getSecondarySize();

    return {

        x:
            canvas.width / 2 -
            size / 2 +
            settings.secondary.x,

        y:
            canvas.height / 2 -
            size / 2 +
            settings.secondary.y,

        size: size

    };

}


// ========================================
// DRAW BLACK SHADOW
// ========================================

function drawShadow() {

    if (!secondaryImage) return;

    if (!settings.shadow.enabled) return;

    const position = getSecondaryPosition();

    const shadowCanvas =
        document.createElement("canvas");

    shadowCanvas.width = canvas.width;
    shadowCanvas.height = canvas.height;

    const shadowCtx =
        shadowCanvas.getContext("2d");


    // Draw the secondary as an alpha mask

    shadowCtx.drawImage(
        secondaryImage,
        position.x,
        position.y,
        position.size,
        position.size
    );


    // Turn the image into solid black
    // while keeping its transparency

    shadowCtx.globalCompositeOperation =
        "source-in";

    shadowCtx.fillStyle = "black";

    shadowCtx.fillRect(
        0,
        0,
        shadowCanvas.width,
        shadowCanvas.height
    );


    // Draw shadow with settings

    ctx.save();

    ctx.globalAlpha =
        settings.shadow.opacity / 100;

    ctx.filter =
        `blur(${settings.shadow.blur * 0.5}px)`;


    ctx.drawImage(
        shadowCanvas,
        settings.shadow.x,
        settings.shadow.y
    );

    ctx.restore();

}


// ========================================
// DRAW SECONDARY
// ========================================

function drawSecondary() {

    if (!secondaryImage) return;

    const position =
        getSecondaryPosition();

    ctx.save();

    // Secondary is unaffected
    // by shadow settings

    ctx.globalAlpha = 1;
    ctx.filter = "none";

    ctx.drawImage(
        secondaryImage,
        position.x,
        position.y,
        position.size,
        position.size
    );

    ctx.restore();

}


// ========================================
// DRAW EVERYTHING
// ========================================

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    // Shadow behind image
    drawShadow();

    // Image above shadow
    drawSecondary();

}


// ========================================
// RESET EVERYTHING
// ========================================

resetButton.addEventListener("click", function () {

    backgroundImage = null;
    secondaryImage = null;


    // Secondary

    settings.secondary.scale = 1;
    settings.secondary.x = 0;
    settings.secondary.y = 0;


    // Shadow

    settings.shadow.enabled = false;
    settings.shadow.opacity = 60;
    settings.shadow.x = 20;
    settings.shadow.y = 20;
    settings.shadow.blur = 30;


    // Files

    backgroundInput.value = "";
    secondaryInput.value = "";


    // Secondary UI

    scaleSlider.value = 1;
    scaleValue.textContent = "1.00";

    xInput.value = 0;
    yInput.value = 0;


    // Shadow UI

    shadowToggle.checked = false;

    shadowOpacitySlider.value = 60;
    shadowOpacityValue.textContent = "60%";

    shadowXInput.value = 20;
    shadowYInput.value = 20;

    shadowBlurSlider.value = 30;
    shadowBlurValue.textContent = "30";


    draw();

});


// ========================================
// DOWNLOAD PNG
// ========================================

downloadButton.addEventListener("click", function () {

    const link =
        document.createElement("a");

    link.download =
        "Velvet Product.png";

    link.href =
        canvas.toDataURL("image/png");

    link.click();

});


// ========================================
// INITIAL DRAW
// ========================================

draw();