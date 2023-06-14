window.onload = function () {
  const gameScreen = document.getElementById("game-screen");
  const ctx = gameScreen.getContext("2d");

  const infoScreen = document.getElementById("info-screen");
  infoScreen.style.display = "flex";

  gameScreen.style.display = "none";
  gameScreen.style.width = `${1863}px`;
  gameScreen.style.height = `${770}px`;
  gameScreen.style.backgroundColor = "blue";

  // Oyuncu kontrolü ve özellikleri
  class Raver {
    constructor(game) {
      this.game = game;
      this.width = 60;
      this.height = 60;
      this.x = 1;
      this.y = 60;
      this.speedY = 0;
      this.maxSpeed = 1;
      this.projectiles = [];
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
      const imgRaver = new Image();
      imgRaver.src = "/assets/raver.png";
      // context.fillStyle = "Green";
      // context.fillRect(this.x, this.y, this.width, this.height);
      context.drawImage(imgRaver, this.x, this.y, this.width, this.height);
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

  class Vegan {}

  class IronHacker {}

  // Player hareketleri
  class InputHandler {
    // -1 arrow up
    // 1 arrow down
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
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
      this.speed = 3;
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
      this.speedX = Math.random() * -0.2 - 0.5;
      this.markedForDeletion = false;
      this.lives = 5;
      this.score = this.lives;
    }
    update() {
      this.x += this.speedX;
      if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context) {
      context.fillStyle = "red";
      context.fillRect(this.x, this.y, this.width, this.height);
      context.fillStyle = "black";
      context.font = "10px Helvetica";
      context.fillText(this.lives, this.x, this.y);
    }
  }

  class FirstEnemy extends Enemy {
    constructor(game) {
      super(game);
      this.width = 10;
      this.height = 10;
      // this is for top to bottom movements of enemy
      this.y = Math.random() * (this.game.height * 0.9 - this.height);
    }
  }

  // background images individually
  class Layer {}

  // background images plan
  class Background {}

  // score timer other infos
  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Helvetica";
      this.color = "white";
    }
    draw(context) {
      // save and restore method works together and saving the changes only for this method
      context.save();
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";

      context.fillStyle = this.color;
      context.font = this.fontSize + "px" + this.fontFamily;
      // fillText first argument : "textContent" , second argument : x , third argument : y
      // score
      context.fillText("Score :" + this.game.score, 1, 15);
      //ammo

      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(1 + 4 * i, 20, 3, 20);
      }
      //timer
      const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      context.fillText("Timer :" + formattedTime, 1, 50);
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
        context.font = "50px" + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 40
        );

        context.font = "25px" + this.fontFamily;
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
      this.player = new Raver(this);

      // fetching data from child of Enemy class (FirstEnemy)
      this.firstEnemy = new FirstEnemy(this);
      // enemy objects array
      this.enemies = [];
      // +1 enemy in each 1000 miliseconds
      this.enemyTimer = 0;
      this.enemyInterval = 1000;

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
    }
    update(deltaTime) {
      if (!this.gameOver) {
        this.gameTime += deltaTime;
      }
      if (this.gameTime > this.timeLimit) {
        this.gameOver = true;
      }
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
              if (this.score > this.winningScore) this.gameOver = true;
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
      this.player.draw(context);
      this.ui.draw(context);
      // drawing each enemy to canvas
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
    }
    addEnemy() {
      this.enemies.push(new FirstEnemy(this));
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
      );
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
