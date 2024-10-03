"use strict";

window.onload = function () {
  const newGameBtn = document.querySelector(".new-game");
  const guessMyNumber = document.querySelector(".guess-my-number");
  const sunIcon = document.querySelector(".sun-icon");
  const playSpaceStrikeBtn = document.querySelector(".play");
  const parentHomeBtn = document.querySelector(".home-btn-parent");
  const homeBtn = document.querySelector(".home-btn");

  // İlk başta pencere genişliğini almak
  let currentWidth = window.innerWidth;
  console.log("Başlangıç genişliği:", currentWidth);

  // Pencere boyutu değiştiğinde genişliği güncellemek için event listener
  window.addEventListener("resize", () => {
    currentWidth = window.innerWidth;
    console.log("Güncellenen genişlik:", currentWidth);
  });

  const pauseButton = document.querySelector("#pause-button button");

  pauseButton.addEventListener("click", function () {
    game.paused = !game.paused;
  });

  localStorage.setItem("theme", "dark-theme");
  sunIcon.style.display = "none";
  document.body.style.backgroundColor = "#1c1c1c";
  newGameBtn.style.color = "white";
  guessMyNumber.style.color = "white";
  playSpaceStrikeBtn.style.color = "white";
  homeBtn.style.color = "white";
  parentHomeBtn.style.display = "none";
  const restartBtn = document.querySelector(".restart-game");
  const parentRestartBtn = document.querySelector(".parent-restart-game-btn");
  const canvas = document.getElementById("game-screen");
  const ctx = canvas.getContext("2d");
  const canvasContainer = document.getElementById("canvas-container");
  canvasContainer.appendChild(canvas);
  ctx.imageSmoothingEnabled = true;

  canvasContainer.style.display = "none";
  canvas.style.display = "none";

  canvas.width = 1000;
  canvas.height = 500;
  canvas.style.backgroundColor = "white";

  parentRestartBtn.style.display = "none";

  restartBtn.addEventListener("click", function () {
    game.restart();
    game.paused = false;
  });

  newGameBtn.addEventListener("click", function () {
    game.restart();
    game.paused = false;
  });
  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 1;
      this.y = 60;
      this.frameX = 0;
      this.frameY = 0;
      this.speedY = 0;
      this.maxSpeed = 4;
      this.projectiles = [];
      this.image = document.getElementById("player");
      this.shootSound = new Audio("./game-assets/laser.wav");
    }
    update() {
      if (this.game.keys.includes("ArrowUp")) {
        this.speedY = -this.maxSpeed;
      } else if (this.game.keys.includes("ArrowDown")) {
        this.speedY = this.maxSpeed;
      } else {
        this.speedY = 0;
      }
      this.y += this.speedY;

      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );

      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }

    shootTop() {
      if (this.game.ammo > 0) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        const offsetX = 80;
        const offsetY = 0;

        this.projectiles.push(
          new Projectile(this.game, centerX + offsetX, centerY + offsetY)
        );
        this.game.ammo--;

        this.shootSound.currentTime = 0; // Ses efektini sıfırdan başlatır
        this.shootSound.play(); // Ses efektini oynatır
      }
    }
  }

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (e.key === "p" || e.key === "P") {
          this.pauseGame();
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
          game.paused = false;
        }
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootTop();
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) !== -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
    pauseGame() {
      this.game.paused = !this.game.paused;
    }
  }
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 28;
      this.height = 10;
      this.speed = 9;
      this.markedForDeletion = false;
      this.image = new Image();
      this.image.src = "./game-assets/projectile.png";
    }

    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.9) this.markedForDeletion = true;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = currentWidth > 1440 ? -2.75 : -4;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0 && !this.game.gameOver) {
        this.markedForDeletion = true;
        this.game.score -= 5;
      }
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      context.font = "20px Helvetica";
      context.fillStyle = "red";
      context.fillText(this.lives, this.x, this.y);
    }
  }

  class Drone extends Enemy {
    constructor(game) {
      super(game);
      this.width = 110;
      this.height = 95;
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("enemy");
    }
  }

  class Layer {
    constructor(game, image, speedModifier) {
      (this.game = game), (this.image = image);
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width, this.y);
    }
  }

  class Background {
    constructor(game) {
      this.game = game;

      this.image1 = document.getElementById("layer");
      this.layer = new Layer(this.game, this.image1, 1);
      this.layers = [this.layer];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "white";
    }
    draw(context) {
      context.save();
      if (this.game.paused) {
        context.fillStyle = "white";
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "black";
        const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText("Timer :" + formattedTime, 1, 60);

        context.fillText("Score :" + this.game.score, 1, 15);
        for (let i = 0; i < this.game.ammo; i++) {
          context.fillRect(1 + 4 * i, 20, 3, 20);
        }
        context.textAlign = "center";
        context.font = this.fontSize + "px" + this.fontFamily;
        context.fillText(
          "Game paused",
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );
      } else if (!this.game.paused) {
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "black";

        context.fillStyle = this.color;
        context.font = this.fontSize + "px" + this.fontFamily;

        context.fillText("Score :" + this.game.score, 1, 15);

        for (let i = 0; i < this.game.ammo; i++) {
          context.fillRect(1 + 4 * i, 20, 3, 20);
        }

        const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText("Timer :" + formattedTime, 1, 60);
        if (this.game.gameOver) {
          context.textAlign = "center";
          let message1;
          let message2;
          if (this.game.score > this.game.winningScore) {
            message1 = "You Win!";
            message2 = "Well done!";
          } else {
            message1 = "You lose!";
            message2 = "Try again next time !";
          }
          context.font = "75px" + this.fontFamily;
          context.fillText(
            message1,
            this.game.width * 0.5,
            this.game.height * 0.5 - 40
          );

          context.font = "50px" + this.fontFamily;
          context.fillText(
            message2,
            this.game.width * 0.5,
            this.game.height * 0.5 + 40
          );
        }
      }
      context.restore();
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      this.player = new Player(this);
      this.background = new Background(this);
      this.firstEnemy = new Drone(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);

      this.enemies = [];
      this.keys = [];

      this.enemyTimer = 0;
      this.enemyInterval = 1000;

      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 500;

      this.lives = 5;
      this.score = 0;
      this.winningScore = 50;

      this.gameTime = 0;
      this.timeLimit = 30000;

      this.speed = 1;
      this.gameOver = false;

      this.paused = false;
    }
    update(deltaTime) {
      if (!this.paused) {
        if (!this.gameOver) {
          this.gameTime += deltaTime;
        }
        if (this.gameTime > this.timeLimit) {
          this.gameOver = true;
        }
        this.background.update();
        this.player.update();
        if (this.ammoTimer > this.ammoInterval) {
          if (this.ammo < this.maxAmmo) this.ammo++;
          this.ammoTimer = 0;
        } else {
          this.ammoTimer += deltaTime;
        }
        this.enemies.forEach((enemy) => {
          enemy.update();
          if (this.checkCollision(this.player, enemy) && !this.gameOver) {
            enemy.markedForDeletion = true;
            this.score -= 5;
          }
          this.player.projectiles.forEach((projectile) => {
            if (this.checkCollision(projectile, enemy)) {
              enemy.lives--;
              projectile.markedForDeletion = true;
              if (enemy.lives === 0) {
                enemy.markedForDeletion = true;
                if (!this.gameOver) this.score += 10;
                if (this.score > this.winningScore) {
                  this.gameOver = true;
                }
              }
            }
          });
        });
        this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
        if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
          this.addEnemy();
          this.enemyTimer = 0;
        } else {
          this.enemyTimer += deltaTime;
        }
      }
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.enemies.push(new Drone(this));
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
    }
    restart() {
      this.player = new Player(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.ammo = 20;
      this.ammoTimer = 0;
      this.gameOver = false;
      this.score = 0;
      this.gameTime = 0;
    }
    togglePause() {
      this.paused = !this.paused;
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTimestamp = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTimestamp;
    lastTimestamp = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate(0));
};
