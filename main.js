import { Game } from './classes/game.js';

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.height = 500;
  canvas.width = 1000;

  const startDialog = document.getElementById("startDialog");
  const startButton = document.getElementById("startButton");
  const gameOverDialog = document.getElementById("gameOverDialog");
  const restartButton = document.getElementById("restartButton");
  const finalScore = document.getElementById("finalScore");
  const highScore = document.getElementById("highScore");

  let game;
  let lastTime = 0;

  function startGame() {
    startDialog.style.display = 'none';
    gameOverDialog.style.display = 'none';
    game = new Game(canvas.width, canvas.height);
    animate(0);
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    } else {
      showGameOver();
    }
  }

  function showGameOver() {
    gameOverDialog.style.display = 'flex';
    finalScore.textContent = `Final Score: ${game.score}`;
    highScore.textContent = `High Score: ${game.highScore}`;
  }

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', startGame);
});
