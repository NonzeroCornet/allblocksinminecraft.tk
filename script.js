document.location.toString().split(":")[0] == "http"
  ? (document.location.href = "https://allblocksinminecraft.tk/")
  : document.location;

if (document.location.toString().split("/")[3] == "experimental.html") {
  let p = prompt(
    "Experimental mode is now turned on. Click OK to continue, or type 'back' to return to stable version."
  );
  p == "back"
    ? (document.location.href = "https://allblocksinminecraft.tk/")
    : p;
}

var blockID = 1;
var row = 1;
var random = new Math.seedrandom("");
var previous = [];
const canvas = document.getElementById("images");
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(16, 16);
var rowSpacing = 32;
canvas.width = window.innerWidth/1.2;

const deviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};
if (deviceType() == "mobile" || deviceType() == "tablet") {
  rowSpacing = 8;
  canvas.height = 32;
  canvas.width = window.innerWidth;
}

function generatePixil(pixil, initial) {
  let newPixil = initial;
  let r = random();
  let g = random();
  let b = random();
  let a = random();
  pixil = (pixil - 1) * 4;
  newPixil[pixil] = r;
  newPixil[pixil + 1] = g;
  newPixil[pixil + 2] = b;
  newPixil[pixil + 3] = a;
  return newPixil;
}

function scaleImageData(imageData, scale) {
  var scaled = ctx.createImageData(
    imageData.width * scale,
    imageData.height * scale
  );

  for (var row = 0; row < imageData.height; row++) {
    for (var col = 0; col < imageData.width; col++) {
      var sourcePixel = [
        imageData.data[(row * imageData.width + col) * 4 + 0],
        imageData.data[(row * imageData.width + col) * 4 + 1],
        imageData.data[(row * imageData.width + col) * 4 + 2],
        imageData.data[(row * imageData.width + col) * 4 + 3],
      ];
      for (var y = 0; y < scale; y++) {
        var destRow = row * scale + y;
        for (var x = 0; x < scale; x++) {
          var destCol = col * scale + x;
          for (var i = 0; i < 4; i++) {
            scaled.data[(destRow * scaled.width + destCol) * 4 + i] =
              sourcePixel[i];
          }
        }
      }
    }
  }

  return scaled;
}

function generateImage() {
  for (let i = 1; i <= 256; i++) {
    previous = generatePixil(i, previous);
  }
  for (let i = 0; i < imageData.data.length; i += 4) {
    let x = ((i % 400) / 400) * 255;
    let y = (Math.ceil(i / 400) / 100) * 255;

    imageData.data[i + 0] = previous[i] * 255;
    imageData.data[i + 1] = previous[i + 1] * 255;
    imageData.data[i + 2] = previous[i + 2] * 255;
    imageData.data[i + 3] = previous[i + 3] * 255;
  }

  ctx.putImageData(imageData, blockID * 32, row * rowSpacing);
  blockID++;
  if (blockID > 48) {
    blockID = 1;
  }
}
function generateRow() {
  if (deviceType() == "desktop") {
    for (let i = 1; i <= 48; i++) {
      generateImage();
    }
  } else {
    for (let i = 1; i <= 12; i++) {
      generateImage();
    }
  }
  row++;
}
generateRow();

var inMemCanvas = document.createElement("canvas");
var inMemCtx = inMemCanvas.getContext("2d");
inMemCanvas.width = window.innerWidth;
function resizeCanvas() {
  inMemCanvas.height = canvas.height;
  inMemCtx.drawImage(canvas, 0, 0);
  canvas.height += 32;
  ctx.drawImage(inMemCanvas, 0, 0);
}

setInterval(function () {
  if (
    window.scrollY + window.innerHeight >= document.body.scrollHeight + 5 &&
    deviceType() == "desktop"
  ) {
    resizeCanvas();
    generateRow();
  } else if (
    window.scrollY + window.innerHeight >=
    document.body.scrollHeight + 5
  ) {
    resizeCanvas();
    generateRow();
    generateRow();
    generateRow();
    generateRow();
  }
  document.getElementById("scrollCounter").innerHTML =
    "ScrollY: " + Math.floor(window.scrollY);
}, 100);