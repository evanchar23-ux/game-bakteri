/**
 * main.js
 * Entry Point Game Viral Slayer
 */

import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);

  let lastTime = performance.now();

  function gameLoop(now) {
    let dt = (now - lastTime) / 1000;
    // Cap dt to prevent huge jump on tab switch
    if (dt > 0.1) dt = 0.1;
    lastTime = now;

    game.update(dt);
    game.render();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
