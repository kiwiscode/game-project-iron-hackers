const hackerHistory = document.querySelector(".char-story");
const wHacker = document.querySelector(".hacker-play");
const newGameBtn = document.querySelector(".new-game");
const infoScreen = document.querySelector("#info-screen");
const gameScreen = document.querySelector("#game-screen");
const canvasContainer = document.getElementById("canvas-container");
const guessMyNumber = document.querySelector(".guess-my-number");
const pauseBtn = document.querySelector("#pause-button");

hackerHistory.addEventListener("click", function () {
  gameScreen.style.display = "none";
  infoScreen.style.display = "flex";
});

wHacker.addEventListener("click", function () {
  gameScreen.style.display = "flex";
  infoScreen.style.display = "none";
  canvasContainer.style.display = "flex";
  pauseBtn.style.display = "flex";
});
//
hackerHistory.addEventListener("click", () => {
  canvasContainer.style.display = "none";
});
