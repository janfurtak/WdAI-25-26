class Buff {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = 2; // przesuwanie w lewo, tak jak rury
    this.active = true;
  }

  // --- przesuwanie buffa ---
  update = () => {
    this.x -= this.speed;
  };

  // --- rysowanie buffa ---
  draw = (ctx) => {
    ctx.save();
    ctx.fillStyle = "rgb(0, 167, 0)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  // --- kolizja z ptakiem ---
  collides = (bird) => {
    const birdCenterX = bird.x + 24;
    const birdCenterY = bird.y + 18;
    const dx = birdCenterX - this.x;
    const dy = birdCenterY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + 18; // ptak ma ok 36x36
  };

  // --- sprawdzanie czy buff wyszedł z ekranu ---
  isOffScreen = () => this.x + this.radius < 0;
}

export { Buff };
