const raverHistory = document.querySelector(".raver");
const veganHistory = document.querySelector(".vegan");
const ironHackerHistory = document.querySelector(".iron-hacker");
const raverHistoryLorem = document.querySelector(".raver-history ");
const veganHistoryLorem = document.querySelector(".vegan-history ");
const ironHackerHistoryLorem = document.querySelector(".iron-hacker-history");
const raverProto = document.querySelector(".raver-proto");
const veganProto = document.querySelector(".vegan-proto");
const ironHackerProto = document.querySelector(".iron-hacker-proto");
const newGameBtn = document.querySelector(".new-game");
const infoScreen = document.querySelector("#info-screen");
const gameScreen = document.querySelector("#game-screen");

// Simplicity optimization functionality for character infos
function handleClick(
  historyElement,
  displayElement,
  hideElement1,
  hideElement2
) {
  historyElement.addEventListener("click", () => {
    displayElement.classList.remove("display");
    gameScreen.style.display = "none";
    infoScreen.style.display = "flex";
    if (
      !hideElement2.classList.contains("display") ||
      !hideElement1.classList.contains("display")
    ) {
      hideElement2.classList.add("display");
      hideElement1.classList.add("display");
    }
  });
}

function addHistoryEventListener(historyButton, historyInfo, proto1, proto2) {
  historyButton.addEventListener("click", () => {
    historyInfo.classList.remove("display");
    gameScreen.style.display = "none";
    infoScreen.style.display = "flex";
    if (
      !proto1.classList.contains("display") ||
      !proto2.classList.contains("display")
    ) {
      proto1.classList.add("display");
      proto2.classList.add("display");
    }
  });
}

handleClick(
  ironHackerHistory,
  ironHackerHistoryLorem,
  raverHistoryLorem,
  veganHistoryLorem
);
handleClick(
  veganHistory,
  veganHistoryLorem,
  raverHistoryLorem,
  ironHackerHistoryLorem
);
handleClick(
  raverHistory,
  raverHistoryLorem,
  ironHackerHistoryLorem,
  veganHistoryLorem
);
addHistoryEventListener(
  ironHackerHistory,
  ironHackerProto,
  raverProto,
  veganProto
);
addHistoryEventListener(raverHistory, raverProto, ironHackerProto, veganProto);
addHistoryEventListener(veganHistory, veganProto, ironHackerProto, raverProto);

// W/Raver , W/Vegan , W/IronHacker
const raverPlay = document.querySelector(".raver-play");
const veganPlay = document.querySelector(".vegan-play");
const ironHackerPlay = document.querySelector(".iron-hacker-play");

raverPlay.addEventListener("click", function () {
  infoScreen.style.display = "none";
  gameScreen.style.display = "flex";
  if (!veganPlay.classList("display") && !ironHackerPlay.classList("display")) {
    veganPlay.classList.add("display");
    ironHackerPlay.classList.add("display");
  }
});

veganPlay.addEventListener("click", function () {
  infoScreen.style.display = "none";
  gameScreen.style.display = "flex";
  if (!raverPlay.classList("display") && !ironHackerPlay.classList("display")) {
    raverPlay.classList.add("display");
    ironHackerPlay.classList.add("display");
  }
});

ironHackerPlay.addEventListener("click", function () {
  infoScreen.style.display = "none";
  gameScreen.style.display = "flex";
  if (!raverPlay.classList("display") && !veganPlay.classList("display")) {
    raverPlay.classList.add("display");
    veganPlay.classList.add("display");
  }
});
