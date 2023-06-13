window.onload = function () {
  const gameScreen = document.getElementById("game-screen");
  const ctx = gameScreen.getContext("2d");
  const infoScreen = document.getElementById("info-screen");

  gameScreen.style.display = "flex";
  infoScreen.style.display = "none";
  gameScreen.style.width = `${1863}px`;
  gameScreen.style.height = `${770}px`;
  gameScreen.style.backgroundColor = "blue";

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
  // Oyuncu kontrolü ve özellikleri
  class Player1 {
    constructor(game) {
      this.game = game;
      this.width = 60;
      this.height = 60;
      this.x = 1;
      this.y = 50;
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
      context.fillStyle = "black";
      context.fillRect(this.x, this.y, this.width, this.height);
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

  // For future ( after first player is done)
  class Player2 {}

  // For future (after first player is done )
  class Player3 {}

  // obstacles(enemy in this case)
  class Enemy {}

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
      this.color = "yellow";
    }
    draw(context) {
      //ammo
      context.fillStyle = this.color;
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(1 + 4 * i, 5, 3, 20);
      }
    }
  }

  // tüm logic burada toplanacak projenin beyni
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      // fetching data from Player1 class
      this.player = new Player1(this);

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
    }
    update(timeDiff) {
      // fetching data from Player1 instance player
      this.player.update();
      // triggering ammo
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += timeDiff;
      }
    }

    // fetching data from Player1 instance player
    draw(context) {
      this.player.draw(context);
      this.ui.draw(context);
    }
  }
  const game = new Game(gameScreen.width, gameScreen.height);
  let lastTime = 0;

  // animation loop
  function animate(timer) {
    // line 163 168 169 , now we know how many miliseconds take for a computer to render one animation frame to run one animation loop
    const timeDiff = timer - lastTime;
    lastTime = timer;
    ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
    game.update(timeDiff);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
};
