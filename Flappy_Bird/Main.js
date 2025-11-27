import { Game } from "./Game.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// initialize and start the game
const game = new Game(ctx, canvas);
game.init();
