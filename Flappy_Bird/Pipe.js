class Pipe {
  // --- initialize pipe position and graphics ---
  constructor(x, canvasHeight) {
    this.x = x;
    this.gap = 160;
    this.speed = 2;
    this.width = 80;
    this.pipeHeight = 600;

    this.topHeight =
      Math.floor(Math.random() * (canvasHeight - this.gap - 200)) + 20;
    this.botY = this.topHeight + this.gap;

    this.botImg = new Image();
    this.botImg.src = "./assets/Flappy Bird/pipe-green.png";
    this.ready = false;
    this.passed = false;

    // create top pipe by flipping bottom pipe
    this.botImg.onload = () => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = this.botImg.width;
      offCanvas.height = this.botImg.height;
      const offCtx = offCanvas.getContext("2d");
      offCtx.translate(0, this.botImg.height);
      offCtx.scale(1, -1);
      offCtx.drawImage(this.botImg, 0, 0);

      this.topImg = new Image();
      this.topImg.src = offCanvas.toDataURL();
      this.ready = true;
    };
  }

  // --- move pipe to the left ---
  update = () => {
    this.x -= this.speed;
  };

  // --- draw top and bottom pipes ---
  drawPipe = (ctx) => {
    if (!this.ready) return;
    ctx.drawImage(
      this.topImg,
      this.x,
      this.topHeight - this.pipeHeight,
      this.width,
      this.pipeHeight
    );
    ctx.drawImage(this.botImg, this.x, this.botY, this.width, this.pipeHeight);
  };

  // --- detect collision with bird ---
  collides = (bird) => {
    if (!this.ready) return false;
    const birdLeft = bird.x,
      birdRight = bird.x + 48,
      birdTop = bird.y,
      birdBottom = bird.y + 36;
    const pipeLeft = this.x,
      pipeRight = this.x + this.width;
    const topPipeBottom = this.topHeight,
      topPipeTop = this.topHeight - this.pipeHeight;
    const bottomPipeTop = this.botY,
      bottomPipeBottom = this.botY + this.pipeHeight;

    const hitTop =
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      birdTop < topPipeBottom &&
      birdBottom > topPipeTop;
    const hitBottom =
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      birdTop < bottomPipeBottom &&
      birdBottom > bottomPipeTop;

    return hitTop || hitBottom;
  };

  // --- check if pipe is off screen ---
  isOffScreen = () => this.x + this.width < 0;

  // --- check if bird passed pipe for scoring ---
  checkIfBirdPassed = (bird) => {
    const center = this.x + this.width / 2;
    if (!this.passed && bird.x > center) {
      this.passed = true;
      return true;
    }
    return false;
  };
}

export { Pipe };
