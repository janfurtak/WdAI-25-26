import { Buff } from "./Buff.js";

class Buffs {
  // --- inicjalizacja menadżera buffów ---
  constructor(canvas) {
    this.canvas = canvas;
    this.buffs = [];
    this.spawnTimer = 0;
    this.spawnInterval = 250 + Math.random() * 500; // co ile klatek generujemy nowego buffa
  }

  // --- aktualizacja pozycji buffów i generowanie nowych ---
  update = () => {
    // przesuwanie buffów
    this.buffs.forEach((buff) => buff.update());

    // usuwanie buffów poza ekranem
    this.buffs = this.buffs.filter((buff) => !buff.isOffScreen());

    // generowanie nowego buffa w losowym Y co spawnInterval
    this.spawnTimer++;
    if (this.spawnTimer > this.spawnInterval) {
      const y = Math.random() * (this.canvas.height - 300) + 100; // losowa wysokość
      this.buffs.push(new Buff(this.canvas.width, y));
      this.spawnTimer = 0;
    }
  };

  // --- rysowanie wszystkich buffów na ekranie ---
  draw = (ctx) => {
    this.buffs.forEach((buff) => buff.draw(ctx));
  };

  // --- sprawdzenie kolizji ptaka z buffami ---
  checkCollisions = (bird) => {
    for (let i = 0; i < this.buffs.length; i++) {
      if (this.buffs[i].collides(bird)) {
        this.buffs.splice(i, 1);
        return true;
      }
    }
    return false;
  };
}

export { Buffs };
