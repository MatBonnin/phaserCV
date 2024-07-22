import './style.css';

import CaveScene from './scenes/CaveScene';
import GameScene from './scenes/GameScene';
import HouseScene from './scenes/HouseScene';
import Level1Scene from './scenes/Level1Scene';
import Phaser from 'phaser';
import rickScene from './scenes/rickScene';

const config = {
  type: Phaser.WEBGL,
  parent: 'gameCanvas',
  width: 480,
  height: 320,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [GameScene, HouseScene, CaveScene, Level1Scene, rickScene],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 3, // Désactivez le redimensionnement automatique
  },
};

const game = new Phaser.Game(config);

// Ajouter un écouteur d'événement pour redimensionner le jeu lorsque la fenêtre est redimensionnée
// window.addEventListener('resize', (gameWidth, gameHeight) => {
//   game.scale.resize(gameWidth, gameHeight);
// });
