window.onload = function () {
  const gameScreen = document.getElementById("game-screen");
  const ctx = gameScreen.getContext("2d");
  const infoScreen = document.getElementById("info-screen");

  gameScreen.style.display = "flex";
  infoScreen.style.display = "none";
  gameScreen.style.width = `${1863}px`;
  gameScreen.style.height = `${770}px`;

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

  // Oyuncudan çıkacak olan kurşunlar
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
    update() {
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
      context.fillStyle = "green";
      context.fillRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
    }
  }

  // Oyuncu kontrolü
  //   class Player2 {}

  //   // Oyuncu kontrolü
  //   class Player3 {}

  // Engeller
  class Enemy {}

  // Arka plan individually
  class Layer {}

  // Arka plan görüntülerin tamamı toplam
  class Background {}

  // score timer other infos
  class UI {}

  // tüm logic burada toplanacak projenin beyni
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player1(this);
      this.input = new InputHandler(this);
      this.keys = [];
      this.ammo = 20;
    }
    update() {
      this.player.update();
    }
    draw(context) {
      this.player.draw(context);
    }
  }
  const game = new Game(gameScreen.width, gameScreen.height);

  // animation loop
  function animate() {
    ctx.clearRect(0, 0, gameScreen.width, gameScreen.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate();
};
