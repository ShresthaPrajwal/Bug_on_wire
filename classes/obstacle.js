export class Obstacle {
  constructor(game, y, speed, type = 'regular') {
    this.game = game;
    
    
    this.speed = speed; 
    this.markedForDeletion = false; 
    this.type = type;

    this.image = new Image();
    if (this.type === 'regular') {
      this.image.src = '../assets/skeleton-idle_0.png'; // Path to regular obstacle image
    } else {
      this.image.src = '../assets/skeleton-walking_0.png'; // Path to invincible obstacle image
    }

    this.width = this.image.width;
    this.height = this.image.height;
    this.x = this.game.width;
    this.y = this.type==='regular'?y - this.height:y-this.height+7;
  }

  update() {
    this.x -= this.speed; 
    if (this.x + this.width < 0) {
      this.markedForDeletion = true; 
    }
  }

  draw(context) {
    if (this.image.complete) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.image.onload = () => {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      };
    }
  }
}
