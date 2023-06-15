window.onload = function () {
  const restartBtn = document.querySelector(".restart-game");
  const canvas = document.getElementById("game-screen");
  const ctx = gameScreen.getContext("2d");
  const canvasContainer = document.getElementById("canvas-container");
  canvasContainer.appendChild(canvas);
  // Rest of your existing code...
  ctx.imageSmoothingEnabled = true;

  const infoScreen = document.getElementById("info-screen");

  canvasContainer.style.display = "none";
  canvas.style.display = "none";
  infoScreen.style.display = "flex";
  // canvas.width = `${1863}px`;
  // canvas.height = `${770}px`;
  // canvas.style.backgroundColor = "blue";
  canvas.width = 1000;
  canvas.height = 500;
  canvas.style.backgroundColor = "white";

  restartBtn.addEventListener("click", function () {
    game.restart();
  });

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
      this.image1 = document.getElementById("layer1");
      this.image2 = document.getElementById("layer2");
      this.image3 = document.getElementById("layer3");
      this.image4 = document.getElementById("layer4");
      // this.image5 = document.getElementById("layer5");
      this.layer1 = new Layer(this.game, this.image1, 0.2);
      this.layer2 = new Layer(this.game, this.image2, 0.4);
      this.layer3 = new Layer(this.game, this.image3, 1);
      this.layer4 = new Layer(this.game, this.image4, 3);
      // this.layer5 = new Layer(this.game, this.image5, 1);
      this.layers = [
        this.layer1,
        this.layer2,
        this.layer3,
        // this.layer5,
      ];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }
  // Oyuncu kontrolü ve özellikleri
  class IronHacker {
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

      // handle projectile
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
      // manipulating the projectiles animation
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
    }
  }

  // Player hareketleri
  class InputHandler {
    // -1 arrow up
    // 1 arrow down
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === " ") {
          e.preventDefault();
        }
        if (
          (e.key === "ArrowUp" || e.key === "ArrowDown") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          // activating projectile hit
          this.game.player.shootTop();
        }
      });
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) !== -1) {
          // removing last element in the array with splice method
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  // projectiles coming out from players
  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 9;
      this.markedForDeletion = false;
    }

    // positioning the projectile
    update() {
      // arranging the projectile speed and visibility range
      this.x += this.speed;
      if (this.x > this.game.width * 0.9) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "yellow";
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  // Kurşun yiyen Enemylerden düşecek parçalar
  class Particle {}

  // obstacles(enemy in this case) Paren
  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 1;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      // context.fillRect(this.x, this.y, this.width, this.height);
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
      context.fillText(this.lives, this.x, this.y);
    }
  }

  class Drone extends Enemy {
    constructor(game) {
      super(game);
      this.width = 110;
      this.height = 95;
      // this is for top to bottom movements of enemy
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
      this.image = document.getElementById("enemy");
    }
  }

  // score timer other infos
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "white";
    }
    draw(context) {
      // save and restore method works together and saving the changes only for this class content
      context.save();
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";

      context.fillStyle = this.color;
      context.font = this.fontSize + "px" + this.fontFamily;

      context.fillText("Score :" + this.game.score, 1, 15);
      //ammo

      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(1 + 4 * i, 20, 3, 20);
      }
      //timer
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText("Timer :" + formattedTime, 1, 60);
      // game over messages
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
      context.restore();
    }
  }

  // tüm logic burada toplanacak projenin beyni
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      // fetching data from Player1 class
      this.player = new IronHacker(this);

      this.background = new Background(this);
      // fetching data from child of Enemy class (FirstEnemy)
      this.firstEnemy = new Drone(this);
      // enemy objects array
      this.enemies = [];
      // +1 enemy in each 1000 miliseconds
      this.enemyTimer = 0;
      this.enemyInterval = 3000;

      // fetching data from InputHandler class
      this.input = new InputHandler(this);

      // fetching data from UI class
      this.ui = new UI(this);

      // data coming from InputHandler class
      this.keys = [];

      // data getting manipuleted from Player class
      this.ammo = 20;
      // while loop turn max ammo you can get
      this.maxAmmo = 50;
      // +1 ammo in each 500 miliseconds and while it reach that point store 0 back again.
      this.ammoTimer = 0;
      this.ammoInterval = 500;

      // game over true/false
      this.gameOver = false;

      this.lives = 5;
      this.score = 0;
      this.winningScore = 50;

      // after 5 seconds the game will end depending our score
      this.gameTime = 0;
      this.timeLimit = 30000;

      this.speed = 1;
    }
    update(deltaTime) {
      if (!this.gameOver) {
        this.gameTime += deltaTime;
      }
      if (this.gameTime > this.timeLimit) {
        this.gameOver = true;
      }
      this.background.update();
      this.background.layer4.update();
      // fetching data from Player1 instance player
      this.player.update();
      // triggering ammo
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      this.enemies.forEach((enemy) => {
        enemy.update();
        if (this.checkCollision(this.player, enemy)) {
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

    // fetching data from Player1 instance player
    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.ui.draw(context);
      // drawing each enemy to canvas
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.background.layer4.draw(context);
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
      this.player = new IronHacker(this);
      this.enemies = [];
      this.enemyTimer = 0;
      this.ammo = 20;
      this.ammoTimer = 0;
      this.gameOver = false;
      this.score = 0;
      this.gameTime = 0;
    }
  }
  const game = new Game(gameScreen.width, gameScreen.height);
  let lastTimestamp = 0;

  // animation loop
  function animate(timeStamp) {
    // Perform animation logic here
    // line 163 168 169 , now we know how many miliseconds take for a computer to render one animation frame to run one animation loop
    const deltaTime = timeStamp - lastTimestamp;
    lastTimestamp = timeStamp;
    ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
    game.update(deltaTime);
    game.draw(ctx);

    // schedule the next animation frame
    window.requestAnimationFrame(animate);
  }

  // start the animation loop
  window.requestAnimationFrame(animate(0));
};
