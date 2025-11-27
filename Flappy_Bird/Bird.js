class Bird {
  // --- inicjalizacja ptaka ---
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.fallSpeed = 0;
    this.rotation = 0;

    // --- obrazki ptaka i animacja skrzydeł ---
    this.birdImg = new Image();
    this.wingFrames = [
      "./assets/Flappy Bird/yellowbird-midflap.png",
      "./assets/Flappy Bird/yellowbird-upflap.png",
      "./assets/Flappy Bird/yellowbird-downflap.png",
      "./assets/Flappy Bird/yellowbird-midflap.png",
    ];
    this.currentFrame = 0;

    // --- buff nieśmiertelności ---
    this.invincible = false;
    this.invincibleEndTime = 0; // czas zakończenia buffa
  }

  // --- skok ptaka ---
  jump = (e) => {
    if (e.code === "Space") {
      this.fallSpeed = -8;
      new Audio("./assets/Sound Efects/wing.ogg").play();
    }
  };

  // --- obrót ptaka w zależności od prędkości ---
  updateRotation = () => {
    const maxDown = Math.PI / 2;
    const maxUp = -Math.PI / 6;
    const rotationSpeed = 0.05;

    if (this.fallSpeed > 0) {
      this.rotation += rotationSpeed;
      if (this.rotation > maxDown) this.rotation = maxDown;
    } else if (this.fallSpeed < 0) {
      this.rotation = maxUp;
    }
  };

  // --- rysowanie ptaka ---
  drawBird = (ctx) => {
    const img = this.birdImg;
    const width = 48;
    const height = 36;
    const centerX = this.x + width / 2;
    const centerY = this.y + height / 2;

    this.updateWing();
    this.updateRotation();

    // --- ustawienie przezroczystości ---
    ctx.save();
    ctx.globalAlpha = this.invincible ? 0.5 : 1;
    ctx.translate(centerX, centerY);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();

    // --- sprawdzenie końca buffa ---
    if (this.invincible && Date.now() > this.invincibleEndTime) {
      this.invincible = false;
    }
  };

  // --- animacja skrzydeł ---
  updateWing = () => {
    this.birdImg.src = this.wingFrames[this.currentFrame];
    this.currentFrame = (this.currentFrame + 1) % 4;
  };

  // --- sprawdzenie kolizji z ziemią ---
  detectGround = () => this.y >= 684;

  // --- grawitacja i upadek ptaka ---
  makeFall = () => {
    const gravity = 0.4;
    const ground = 684;
    const top = 0;

    this.fallSpeed += gravity;
    this.y += this.fallSpeed;

    if (this.detectGround()) {
      this.y = ground;
      this.fallSpeed = 0;
      this.currentFrame = 0;
    }

    if (this.y < top) this.y = top;
  };

  // --- aktywacja buffa invincibility na 5 sekund ---
  activateInvincible = () => {
    this.invincible = true;
    this.invincibleEndTime = Date.now() + 5000; // 5 sekund
  };
}

export { Bird };
