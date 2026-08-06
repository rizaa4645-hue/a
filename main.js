const canvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");

const backgroundInput = document.getElementById("backgroundInput");
const secondaryInput = document.getElementById("secondaryInput");

const scaleSlider = document.getElementById("scale");
const scaleValue = document.getElementById("scaleValue");

const xInput = document.getElementById("x");
const yInput = document.getElementById("y");

const resetButton = document.getElementById("reset");
const downloadButton = document.getElementById("download");

let backgroundImage = null;
let secondaryImage = null;

const settings = {

    scale: 1,

    x: 0,
    y: 0

};

function loadImage(file, callback){

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        const img = new Image();

        img.onload = function(){

            callback(img);

            draw();

        }

        img.src = e.target.result;

    }

    reader.readAsDataURL(file);

}

backgroundInput.addEventListener("change", e=>{

    loadImage(e.target.files[0], img=>{

        backgroundImage = img;

    });

});

secondaryInput.addEventListener("change", e=>{

    loadImage(e.target.files[0], img=>{

        secondaryImage = img;

    });

});

scaleSlider.addEventListener("input", ()=>{

    settings.scale = Number(scaleSlider.value);

    scaleValue.textContent = settings.scale.toFixed(2);

    draw();

});

xInput.addEventListener("input", ()=>{

    settings.x = Number(xInput.value);

    draw();

});

yInput.addEventListener("input", ()=>{

    settings.y = Number(yInput.value);

    draw();

});

resetButton.addEventListener("click", () => {

    backgroundImage = null;
    secondaryImage = null;

    settings.scale = 1;
    settings.x = 0;
    settings.y = 0;

    backgroundInput.value = "";
    secondaryInput.value = "";

    scaleSlider.value = 1;
    scaleValue.textContent = "1.00";

    xInput.value = 0;
    yInput.value = 0;

    draw();

});

downloadButton.addEventListener("click", ()=>{

    const link = document.createElement("a");

    link.download = "Velvet Product.png";

    link.href = canvas.toDataURL("image/png");

    link.click();

});

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(backgroundImage){

        ctx.drawImage(

            backgroundImage,

            0,
            0,

            canvas.width,
            canvas.height

        );

    }else{

        ctx.fillStyle="#2b2b2b";
        ctx.fillRect(0,0,canvas.width,canvas.height);

    }

    if(secondaryImage){

        const baseSize = 1200;

        const size = baseSize * settings.scale;

        const x = canvas.width/2 - size/2 + settings.x;

        const y = canvas.height/2 - size/2 + settings.y;

        ctx.drawImage(

            secondaryImage,

            x,
            y,

            size,
            size

        );

    }

}

draw();