// Map.js — poprawiona wersja z obsługą invincibility buff i komentarzami

import { Bird } from "./Bird.js";
import { Pipes } from "./Pipes.js";
import { Buffs } from "./Buffs.js";

class Map {
  // --- inicjalizacja mapy i obiektów gry ---
  constructor(context, canvas) {
    this.ctx = context;
    this.canvas = canvas;

    // --- tło ziemi ---
    this.groundImg = new Image();
    this.groundImg.src = "./assets/Flappy Bird/base.png";
    this.groundOffset = 0;
    this.groundSpeed = 1;

    // --- obiekty gry ---
    this.bird = new Bird(this.canvas.width / 7, this.canvas.height / 3);
    this.pipes = new Pipes(this.canvas);
    this.buffs = new Buffs(this.canvas); // menadżer buffów
  }

  // --- inicjalizacja sterowania ---
  init = () => {
    document.addEventListener("keydown", this.bird.jump);
    document.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
  };

  // --- rysowanie przesuwającego się gruntu ---
  drawGround = () => {
    const img = this.groundImg;
    this.groundOffset -= this.groundSpeed;
    if (this.groundOffset <= -576) this.groundOffset = 0;

    this.ctx.drawImage(img, this.groundOffset, 720, 576, 192);
    this.ctx.drawImage(img, this.groundOffset + 576, 720, 576, 192);
  };

  // --- aktualizacja i rysowanie wszystkich obiektów gry ---
  updateCanvas = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // --- aktualizacja ptaka ---
    this.bird.makeFall();

    // --- aktualizacja rur ---
    this.pipes.update();
    this.pipes.drawPipes(this.ctx);

    // --- aktualizacja buffów ---
    this.buffs.update();
    this.buffs.draw(this.ctx);

    // --- sprawdzenie kolizji ptaka z buffami ---
    if (this.buffs.checkCollisions(this.bird)) {
      this.bird.activateInvincible(); // aktywacja buffa na 5 sekund
    }

    // --- rysowanie ptaka (przezroczystość jeśli invincible) ---
    this.bird.drawBird(this.ctx);

    // --- rysowanie gruntu ---
    this.drawGround();
  };

  // --- sprawdzenie kolizji ptaka z rurami (z uwzględnieniem buffa) ---
  checkPipeCollision = () => {
    return !this.bird.invincible && this.pipes.checkCollisions(this.bird);
  };

  // --- sprawdzenie zdobytego punktu ---
  checkIfScored = () => this.pipes.checkIfPointIsScored(this.bird);
}

export { Map };
