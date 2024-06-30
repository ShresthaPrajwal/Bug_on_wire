export class InputHandler {
    constructor() {
      this.keys = [];
      this.keyStates = {}; // to track if the key is currently pressed or not

      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" || e.key === "ArrowUp") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
          this.keyStates[e.key] = true; // set key state to pressed
        }
        console.log(this.keys);
      });

      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          this.keys.splice(this.keys.indexOf(e.key), 1);
          this.keyStates[e.key] = false; // set key state to not pressed
        }
        console.log(this.keys);
      });
    }
  }
