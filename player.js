export class Player {
    constructor(game) {
      this.game = game;
      this.width = 50;
      this.height = 50;
      this.x = 0;
      this.currentWireIndex = 0;
      this.y = this.game.wires[this.currentWireIndex].y - this.height;
      this.movingUp = false; // flag for upward movement
      this.movingDown = false; // flag for downward movement
    }
  
    update(input) {
      if (input.includes("ArrowUp") && !this.movingUp) {
          this.currentWireIndex =
              this.currentWireIndex + 1 > 2 ? 0 : this.currentWireIndex + 1;
          this.movingUp = true; // set the flag to true to prevent continuous movement
      } else if (!input.includes("ArrowUp")) {
          this.movingUp = false; // reset the flag when key is released
      }
  
      if (input.includes("ArrowDown") && !this.movingDown) {
        this.currentWireIndex =
          this.currentWireIndex - 1 < 0 ? 2 : this.currentWireIndex - 1;
        this.movingDown = true; // set the flag to true to prevent continuous movement
      } else if (!input.includes("ArrowDown")) {
        this.movingDown = false; // reset the flag when key is released
      }
      
      this.y = this.game.wires[this.currentWireIndex].y - this.height;
    }
  
    draw(context) {
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  