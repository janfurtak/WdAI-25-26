import { Map } from "./Map.js";

class Game {
  // --- initialize game state ---
  constructor(context, canvas) {
    this.canvas = canvas;
    this.ctx = context;

    this.score = 0;
    this.highScores = JSON.parse(localStorage.getItem("highscores1")) || [];

    this.map = new Map(this.ctx, this.canvas);

    this.fps = 120;
    this.interval = 1000 / this.fps;
    this.last = 0;

    // load images for score display
    this.numberImgs = Array.from({ length: 10 }, (_, i) => {
      const img = new Image();
      img.src = `./assets/UI/Numbers/${i}.png`;
      return img;
    });
  }

  // --- start game handler ---
  startHandler = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.map.init();
    requestAnimationFrame(this.animate);
    this.canvas.removeEventListener("click", this.startHandler);
  };

  // --- reset game handler ---
  resetHandler = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.map = new Map(this.ctx, this.canvas);
    this.map.init();
    this.score = 0;
    requestAnimationFrame(this.animate);
    this.canvas.removeEventListener("click", this.resetHandler);
  };

  // --- show start screen ---
  init = () => {
    const startImage = new Image();
    startImage.src = "./assets/UI/message.png";
    startImage.onload = () => {
      this.ctx.drawImage(
        startImage,
        100,
        100,
        this.canvas.width / 1.5,
        this.canvas.height / 1.5
      );
    };
    this.canvas.addEventListener("click", this.startHandler);
  };

  // --- convert score to images ---
  parseScore = (score) =>
    String(score)
      .split("")
      .map((d) => this.numberImgs[d]);

  // --- draw score images ---
  drawScoreImages = (imgs, x, y, sizeX = 24, sizeY = 36) => {
    imgs.forEach((img, i) =>
      this.ctx.drawImage(img, x + i * sizeX, y, sizeX, sizeY)
    );
  };

  // --- draw text score with outline ---
  drawScoreText = (text, x, y, color = "#000", size = 24) => {
    this.ctx.font = `bold ${size}px Arial`;
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.textAlign = "center";
    this.ctx.strokeText(text, x, y);
    this.ctx.fillText(text, x, y);
  };

  // --- handle game over ---
  gameOver = () => {
    // update top 5 high scores
    this.highScores.push(this.score);
    this.highScores.sort((a, b) => b - a);
    this.highScores = this.highScores.slice(0, 5);
    localStorage.setItem("highscores", JSON.stringify(this.highScores));

    const gameOverImg = new Image();
    gameOverImg.src = "./assets/UI/gameover.png";
    gameOverImg.onload = () => {
      this.ctx.drawImage(
        gameOverImg,
        this.canvas.width / 2 - gameOverImg.width / 2,
        this.canvas.height / 4
      );

      // --- draw current score bigger ---
      this.drawScoreImages(
        this.parseScore(this.score),
        this.canvas.width / 2 - (this.score.toString().length * 30) / 2,
        375,
        40,
        60
      );

      // --- draw top 5 high scores as text ---
      const colors = ["gold", "silver", "sienna", "white", "white"];
      const topTextY = 500; // space after current score
      this.drawScoreText(
        "Top 5 High Scores",
        this.canvas.width / 2,
        topTextY,
        "#000",
        24
      );
      const scoresStartY = topTextY + 40; // space after title
      this.highScores.forEach((score, index) => {
        this.drawScoreText(
          score.toString(),
          this.canvas.width / 2,
          scoresStartY + index * 40,
          colors[index],
          30
        );
      });
    };

    document.removeEventListener("keydown", this.map.bird.jump);
    this.canvas.addEventListener("click", this.resetHandler);
    new Audio("./assets/Sound Efects/hit.ogg").play();
  };

  // --- main game loop ---
  animate = (timestamp) => {
    if (timestamp - this.last >= this.interval) {
      this.last = timestamp;
      this.map.updateCanvas();
      this.map.drawGround();

      if (this.map.checkIfScored()) {
        this.score++;
        new Audio("./assets/Sound Efects/point.ogg").play();
      }

      // --- draw current score in corner ---
      this.drawScoreImages(
        this.parseScore(this.score),
        this.canvas.width / 1.2 - (this.score.toString().length * 24) / 2,
        50
      );

      // --- check collisions or ground hit ---
      if (this.map.checkPipeCollision() || this.map.bird.detectGround()) {
        this.gameOver();
        if (!this.map.bird.invincible && this.map.checkPipeCollision()) {
          this.gameOver();
        }
        if (this.map.checkPipeCollision())
          new Audio("./assets/Sound Efects/die.ogg").play();
        return;
      }
    }

    requestAnimationFrame(this.animate);
  };
}

export { Game };
