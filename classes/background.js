export class Background {
    constructor(game) {
      this.game = game;
      this.width = 1000;
      this.height = 500;
  
      this.layers = [
        { imageSrc: '../assets/background.jpg', speed: 1 },
        { imageSrc: '../assets/background.jpg', speed: 2 },
      ];
  
      this.layerImages = this.layers.map(layer => {
        const image = new Image();
        image.src = layer.imageSrc;
        return { image, speed: layer.speed, x: 0 };
      });
    }
  
    update() {
      this.layerImages.forEach(layer => {
        layer.x -= layer.speed;
        if (layer.x <= -this.width) layer.x = 0;
      });
    }
  
    draw(context) {
      this.layerImages.forEach(layer => {
        context.drawImage(layer.image, layer.x, 0, this.width, this.height);
        context.drawImage(layer.image, layer.x + this.width, 0, this.width, this.height);
      });
    }
  }
  