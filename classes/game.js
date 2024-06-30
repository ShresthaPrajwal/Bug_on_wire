import { Obstacle } from "./obstacle.js";
import { Player } from "./player.js";
import { Wire } from "./wire.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";

export class Game {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.score = 0;
    this.highScore = this.getHighScore();
    this.gameOver = false;
    this.obstacleSpeed = 5; // Initial speed of the obstacles
    this.obstacleSpeedIncrement = 0.05; // Speed increment factor
    this.obstacleInterval = 2000; // Initial interval between obstacles
    this.obstacleIntervalDecrement = 20; // Interval decrement factor
    this.minObstacleInterval = 500; // Minimum interval between obstacles
    this.wires = [
      new Wire(this, height - 50),
      new Wire(this, height - 200),
      new Wire(this, height - 350)
    ];
    this.player = new Player(this);
    this.input = new InputHandler();
    this.obstacles = [];
    this.obstacleTimer = 0;

    this.background = new Background(this);

    // Background sound 
    this.backgroundSound = new Audio('../assets/audio/music.wav'); 
    this.backgroundSound.loop = true; 
    this.backgroundSound.volume = 0.5; 
    this.backgroundSound.play();
    
    // Projectile launch sound
    this.projectileLaunchSound = new Audio('../assets/audio/shoot.wav'); 
    this.projectileLaunchSound.volume = 0.5; 

    // Obstacle hit sound
    this.obstacleHitSound = new Audio('../assets/audio/hit.wav'); 
    this.obstacleHitSound.volume = 0.5; 

    // Failed hit sound
    this.failedHitSound = new Audio('../assets/audio/fail.wav');
    this.failedHitSound.volume = 0.5;

    //Game over sound
    this.gameoverSound = new Audio('../assets/audio/game-over.wav');
    this.gameoverSound.volume = 0.5;  
  }

  update(deltaTime) {
    if (this.gameOver) return;

    this.background.update();
    this.player.update(this.input.keys, deltaTime);
    this.obstacleTimer += deltaTime;
    if (this.obstacleTimer > this.obstacleInterval) {
      this.addObstacle();
      this.obstacleTimer = 0;
      // Decrease the interval between obstacles over time
      if (this.obstacleInterval > this.minObstacleInterval) {
        this.obstacleInterval -= this.obstacleIntervalDecrement;
      }
    }

    this.obstacles.forEach(obstacle => {
      obstacle.update();
      if (this.checkCollision(this.player, obstacle)) {
        this.gameOver = true;
        this.saveHighScore();
        this.backgroundSound.pause();
        this.gameoverSound.play();
      }
    });

    this.obstacles = this.obstacles.filter(obstacle => {
      if (obstacle.markedForDeletion && obstacle.type === 'regular') {
        this.score += 1;
        this.obstacleSpeed += this.obstacleSpeedIncrement; // Increase obstacle speed
      }
      return !obstacle.markedForDeletion;
    });

    // Check projectile collisions
    this.player.projectiles.forEach(projectile => {
      this.obstacles.forEach(obstacle => {
        if (obstacle.type === 'regular' && this.checkCollision(projectile, obstacle)) {
          obstacle.markedForDeletion = true;
          projectile.markedForDeletion = true;
          this.score += 2; // Shooting an obstacle gives twice the score
          this.obstacleHitSound.play();

        }
        if(obstacle.type === 'invincible' && this.checkCollision(projectile, obstacle)) {
            projectile.markedForDeletion = true;
            this.failedHitSound.play();
          }
      });
    });
  }

  draw(context) {
    this.background.draw(context);
    this.player.draw(context);
    this.wires.forEach(wire => wire.draw(context));
    this.obstacles.forEach(obstacle => obstacle.draw(context));

    context.fillStyle = "black";
    context.font = "30px 'Reggae One', cursive, sans-serif"; 
    context.textAlign = "left";
    context.fillText("Score: " + this.score, 10, 40);
    context.shadowColor = "rgba(0, 0, 0, 0.5)";
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 5;
    context.fillStyle = "white";
    context.fillText("Score: " + this.score, 10, 40);


    const iconSize = 30;
    const iconMargin = 5;
    const startX = this.width - (this.player.maxProjectiles * (iconSize + iconMargin)) - 10;
    const startY = 10;
    for (let i = 0; i < this.player.currentProjectiles; i++) {
      context.drawImage(this.player.projectileImage, startX + i * (iconSize + iconMargin), startY, iconSize, iconSize);
    }
  }

  addObstacle() {
    const randomWire = this.wires[Math.floor(Math.random() * this.wires.length)];
    const type = Math.random() < 0.3 ? 'invincible' : 'regular'; // 30% chance to create an invincible obstacle
    this.obstacles.push(new Obstacle(this, randomWire.y, this.obstacleSpeed, type));
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  restart() {
    this.score = 0;
    this.gameOver = false;
    this.obstacles = [];
    this.obstacleSpeed = 5; // Reset obstacle speed
    this.obstacleInterval = 2000; // Reset obstacle interval
    this.obstacleTimer = 0;
    this.player = new Player(this);
    this.backgroundSound.currentTime = 0;
    this.backgroundSound.play();
  }

  getHighScore() {
    return localStorage.getItem('highScore') || 0;
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      localStorage.setItem('highScore', this.score);
      this.highScore = this.score;
    }
  }
}
