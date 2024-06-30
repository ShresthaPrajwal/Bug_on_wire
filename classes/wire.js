export class Wire {
    constructor(game, y) {
        this.game = game;
        this.y = y;
        this.width = this.game.width;
    }

    draw(context) {
        context.beginPath();
        context.moveTo(0, this.y);
        context.lineTo(this.width, this.y);
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    }
}
