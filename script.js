const play = document.querySelector(".play");
const newGameBtn = document.querySelector(".new-game");
const guessMyNumber = document.querySelector(".guess-my-number");
const gameScreen = document.querySelector("#game-screen");
const canvasContainer = document.getElementById("canvas-container");
const pauseBtn = document.querySelector("#pause-button");
const themeToggleBtn = document.querySelector(".swap-rotate");
const homeBtn = document.querySelector(".home-btn");
const parentHomeBtn = document.querySelector(".home-btn-parent");
const navBar = document.querySelector("#nav-list");
const parentRestartBtn = document.querySelector(".parent-restart-game-btn");
const parentNewGameBtn = document.querySelector(".parent-new-game-btn");

play.addEventListener("click", function () {
  const anchorTags = document.querySelectorAll("#nav-list a");
  for (let i = 0; i < anchorTags.length; i++) {
    anchorTags[i].style.color = "white";
  }

  document.body.style.backgroundColor = "white";
  homeBtn.style.display = "initial";
  parentHomeBtn.style.display = "initial";
  parentRestartBtn.style.display = "initial";
  themeToggleBtn.style.display = "none";
  newGameBtn.style.display = "none";
  parentNewGameBtn.style.display = "none";
  navBar.style.top = "0px";
  navBar.style.left = "0px";
  navBar.style.transform = "initial";
  navBar.style.position = "absolute";
  gameScreen.style.display = "flex";
  canvasContainer.style.display = "flex";
  pauseBtn.style.display = "flex";
});

// theme listener
const sunIcon = document.querySelector(".sun-icon");
const moonIcon = document.querySelector(".moon-icon");

sunIcon.addEventListener("click", () => {
  console.log("sun is active");
  localStorage.setItem("theme", "dark-theme");
  sunIcon.style.fill = "white";
  moonIcon.style.fill = "white";
  newGameBtn.style.color = "white";
  guessMyNumber.style.color = "white";
  document.body.style.backgroundColor = "#1c1c1c";
  sunIcon.style.display = "none";
  moonIcon.style.display = "initial";
});

moonIcon.addEventListener("click", function () {
  console.log("moon is active");
  localStorage.setItem("theme", "light-theme");
  sunIcon.style.fill = "#1c1c1c";
  moonIcon.style.fill = "#1c1c1c";
  newGameBtn.style.color = "#1c1c1c";
  guessMyNumber.style.color = "#1c1c1c";
  document.body.style.backgroundColor = "white";
  moonIcon.style.display = "none";
  sunIcon.style.display = "initial";
});

parentHomeBtn.addEventListener("click", function () {
  homeBtn.style.display = "none";
  parentHomeBtn.style.display = "none";
  gameScreen.style.display = "none";
  document.body.style.backgroundColor = "#1c1c1c";
  navBar.style.top = "50%";
  navBar.style.left = "50%";
  navBar.style.transform = "translate(-50%, -50%)";
  navBar.style.position = "absolute";
  themeToggleBtn.style.display = "initial";
  newGameBtn.style.display = "initial";
  parentNewGameBtn.style.display = "initial";
  parentRestartBtn.style.display = "none";
  pauseBtn.style.display = "none";
});
