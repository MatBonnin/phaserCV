import './style.css';

import GameScene from './scenes/GameScene';
import HouseScene from './scenes/HouseScene';
import Phaser from 'phaser';

const config = {
  type: Phaser.WEBGL,
  parent: 'gameCanvas',
  width: 600, // Taille initiale de votre jeu
  height: 600, // Taille initiale de votre jeu
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [GameScene, HouseScene],
  scale: {
    zoom: 3, // Désactivez le redimensionnement automatique
  },
};

const game = new Phaser.Game(config);
