import { Pipe } from "./Pipe.js";

class Pipes {
  // --- initialize pipes manager ---
  constructor(canvas) {
    this.canvas = canvas;
    this.pipes = [];

    this.lastSpawn = 0;
    this.spawnInterval = 300;
  }

  // --- update pipes positions and spawn new pipes ---
  update = () => {
    this.pipes.forEach((pipe) => pipe.update());
    this.pipes = this.pipes.filter((pipe) => !pipe.isOffScreen());

    this.lastSpawn += 2;
    if (this.lastSpawn > this.spawnInterval) {
      this.pipes.push(new Pipe(this.canvas.width, this.canvas.height));
      this.lastSpawn = 0;
    }
  };

  // --- draw all pipes ---
  drawPipes = (ctx) => {
    this.pipes.forEach((pipe) => pipe.drawPipe(ctx));
  };

  // --- check for collision with bird ---
  checkCollisions = (bird) => this.pipes.some((pipe) => pipe.collides(bird));

  // --- check if bird passed any pipe for scoring ---
  checkIfPointIsScored = (bird) =>
    this.pipes.some((pipe) => pipe.checkIfBirdPassed(bird));
}

export { Pipes };
