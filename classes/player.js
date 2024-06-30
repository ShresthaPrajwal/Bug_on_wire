export class Player {
  constructor(game) {
    this.game = game;

    this.x = 10;
    this.currentWireIndex = 0;
    this.y = this.game.wires[this.currentWireIndex].y - this.height;
    this.projectiles = [];
    this.projectileImage = new Image();
    this.projectileImage.src = '../assets/bullet.png'; 
    this.maxProjectiles = 5; // Max projectiles at a time
    this.currentProjectiles = this.maxProjectiles;
    this.canShoot = true;
    this.shootCooldown = 200; // Half a second cooldown between shots

    this.canMove = true;
    this.moveCooldown = 200; // 200 ms cooldown between movements
    this.rechargeCooldown = 2000; // 2 seconds to recharge one projectile
    this.rechargeTimer = 0;

    this.img = new Image();
    this.img.src = "../assets/bug_51.4x40.png";
    this.width = this.img.width / 15;
    this.height = this.img.height;

    this.frame = 0;

    this.img.onload = () => {
      this.width = this.img.width / 15;
      this.height = this.img.height;
      this.y = this.game.wires[this.currentWireIndex].y - this.height; // Update y based on loaded image height
    };
  }

  update(input, deltaTime) {
    if (input.includes("ArrowUp") && this.canMove) {
      this.currentWireIndex =
        (this.currentWireIndex + 1) % this.game.wires.length;
      this.canMove = false;
      setTimeout(() => (this.canMove = true), this.moveCooldown);
    }
    if (input.includes("ArrowDown") && this.canMove) {
      this.currentWireIndex =
        (this.currentWireIndex - 1 + this.game.wires.length) %
        this.game.wires.length;
      this.canMove = false;
      setTimeout(() => (this.canMove = true), this.moveCooldown);
    }
    if (input.includes(" ")) {
      this.shoot();
    }
    this.y = this.game.wires[this.currentWireIndex].y - this.height;

    this.projectiles.forEach((projectile) => projectile.update());
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );

    // Recharge projectiles
    this.rechargeTimer += deltaTime;
    if (this.rechargeTimer > this.rechargeCooldown) {
      if (this.currentProjectiles < this.maxProjectiles) {
        this.currentProjectiles++;
        this.rechargeTimer = 0;
      }
    }
  }

  draw(context) {
    if (this.img.complete) { // Ensure image is loaded
      context.drawImage(
        this.img,
        this.frame * this.width,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      this.frame++;
      if (this.frame >= 15) this.frame = 0;
    }

    // Draw projectiles
    this.projectiles.forEach((projectile) => projectile.draw(context));
  }

  shoot() {
    if (this.canShoot && this.currentProjectiles > 0) {
      this.projectiles.push(
        new Projectile(this.game, this.x + this.width, this.y + this.height / 2)
      );
      this.currentProjectiles--;
      this.canShoot = false;
      this.game.projectileLaunchSound.play();
      setTimeout(() => (this.canShoot = true), this.shootCooldown);
    }
  }
}

class Projectile {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 3;
    this.speed = 5;
    this.markedForDeletion = false;
  }

  update() {
    this.x += this.speed;
    if (this.x > this.game.width) this.markedForDeletion = true;
  }

  draw(context) {
    context.fillStyle = "black";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
