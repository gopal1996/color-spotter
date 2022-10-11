function ColorSpotter(element, row, col) {
  // Initialize variable
  this.rootElement = document.querySelector(element);
  this.row = row;
  this.col = col;
  this.activeColor = "#000";
  this.eraserColor = "#fff";
  this.activeOddColor = "";
  this.cellTrack = [];
  this.cellCount = 1;
  this.score = 0;
  this.highScore = 0;

  this.boundGameMouseDownListener = gameMouseDown.bind(this);

  // flag mode
  this.isGameMenuEnabled = true;

  // get highscore
  this.getHighScore();

  // pixelart default mode
  this.gameMode();
}

function gameMouseDown(event) {
  let bgColor = event.target.style.backgroundColor;
  if (bgColor === this.activeOddColor) {
    this.score++;
    this.col++;
    this.row++;
    this.resetGrid();
    this.setScore();
    this.init();
  } else {
    this.rootElement.classList.add("shake");
    setTimeout(
      function () {
        this.rootElement.classList.remove("shake");
        this.setHighScore();
        this.getHighScore();
        this.score = 0;
        this.col = 4;
        this.row = 4;
        this.resetGrid();
        this.setScore();
        this.init();
      }.bind(this),
      800
    );
  }
}

ColorSpotter.prototype.init = function () {
  let { color, oddColor } = this.generateRandomColor();
  this.rootElement.innerHTML = "";
  let fragmentElement = document.createDocumentFragment();
  for (let i = 0; i < this.row; i++) {
    let rowElement = document.createElement("div");
    rowElement.classList.add("row");
    for (let j = 0; j < this.col; j++) {
      let colElement = document.createElement("div");
      colElement.classList.add("cell");
      // Game logic
      if (this.isGameMenuEnabled) {
        colElement.style.backgroundColor = color;
      }

      colElement.dataset["cord"] = `col-${i}-${j}`;
      rowElement.appendChild(colElement);
    }
    fragmentElement.appendChild(rowElement);
  }
  this.rootElement.appendChild(fragmentElement);
  this.isGameMenuEnabled && this.addOddColorCell(oddColor);
};

// Color Spotter Game
// Bind Event
ColorSpotter.prototype.addBindGameEvent = function () {
  this.rootElement.addEventListener(
    "mousedown",
    this.boundGameMouseDownListener
  );
};

ColorSpotter.prototype.removeBindGameEvent = function () {
  this.rootElement.removeEventListener(
    "mousedown",
    this.boundGameMouseDownListener
  );
};

ColorSpotter.prototype.gameMode = function () {
  document
    .querySelectorAll(".title")
    .forEach((value) => (value.innerText = "Color Spotter Game"));
  this.row = 4;
  this.col = 4;
  this.init();
  this.addBindGameEvent();
};

ColorSpotter.prototype.generateRandomColor = function () {
  let ratio = 0.618033988749895;

  let hue = (Math.random() + ratio) % 1;
  let saturation = Math.round(Math.random() * 100) % 85;
  let lightness = Math.round(Math.random() * 100) % 85;

  let color =
    "hsl(" + Math.round(360 * hue) + "," + saturation + "%," + lightness + "%)";
  let oddColor =
    "hsl(" +
    Math.round(360 * hue) +
    "," +
    saturation +
    "%," +
    (lightness + 5) +
    "%)";

  return {
    color,
    oddColor,
  };
};

ColorSpotter.prototype.setHighScore = function () {
  if (this.score >= this.highScore) {
    this.highScore = this.score;
  }
  window.localStorage.setItem("highscore", this.highScore);
};

ColorSpotter.prototype.getHighScore = function () {
  let high = window.localStorage.getItem("highscore");
  document.querySelector(".highscorecount").innerText = high;
};

ColorSpotter.prototype.setScore = function () {
  document.querySelector(".score").innerHTML = this.score;
};

ColorSpotter.prototype.resetGrid = function () {
  this.rootElement.innerHTML = "";
};

ColorSpotter.prototype.getRandomCell = function () {
  let row = Math.floor(Math.random() * Number(this.row));
  let col = Math.floor(Math.random() * Number(this.col));
  return { row, col };
};

ColorSpotter.prototype.addOddColorCell = function (oddColor) {
  let { row, col } = this.getRandomCell();
  let uniqueCell = document.querySelector(`div[data-cord='col-${row}-${col}']`);
  // uniqueCell.dataset['gamecell']="correct";

  uniqueCell.style.backgroundColor = oddColor;
  this.activeOddColor = uniqueCell.style.backgroundColor;
};

// Helper function
// Convert rgb to hex
var hexDigits = new Array(
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f"
);

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
  try {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  } catch (error) {}
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - (x % 16)) / 16] + hexDigits[x % 16];
}

// Initilaize Pixelart
new ColorSpotter(".mainboard", 20, 20);
