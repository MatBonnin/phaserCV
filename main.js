import './style.css';

import CaveScene from './scenes/CaveScene';
import GameScene from './scenes/GameScene';
import HouseScene from './scenes/HouseScene';
import Level1Scene from './scenes/Level1Scene';
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
  scene: [GameScene, HouseScene, CaveScene, Level1Scene],
  scale: {
    zoom: 3, // Désactivez le redimensionnement automatique
  },
};

const game = new Phaser.Game(config);
