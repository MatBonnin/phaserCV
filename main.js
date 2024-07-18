import './style.css';

import CaveScene from './scenes/CaveScene';
import GameScene from './scenes/GameScene';
import HouseScene from './scenes/HouseScene';
import Level1Scene from './scenes/Level1Scene';
import Phaser from 'phaser';

// Fonction pour calculer la taille idéale du jeu
const calculateIdealSize = (screenWidth, screenHeight) => {
  const idealWidth = 600;
  const idealHeight = 600;
  const referenceWidth = 2560;
  const referenceHeight = 1271;

  // Calculer le ratio
  const widthRatio = screenWidth / referenceWidth;
  const heightRatio = screenHeight / referenceHeight;

  // Utiliser le plus petit ratio pour maintenir l'aspect
  const ratio = Math.min(widthRatio, heightRatio);

  // Calculer les dimensions idéales
  const gameWidth = Math.floor(idealWidth * ratio);
  const gameHeight = Math.floor(idealHeight * ratio);
  console.log(gameWidth, gameHeight);
  return { gameWidth, gameHeight };
};

// Obtenir la taille de l'écran
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Calculer la taille idéale du jeu
const { gameWidth, gameHeight } = calculateIdealSize(screenWidth, screenHeight);

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
  scene: [GameScene, HouseScene, CaveScene, Level1Scene],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 3, // Désactivez le redimensionnement automatique
  },
};

const game = new Phaser.Game(config);

// Ajouter un écouteur d'événement pour redimensionner le jeu lorsque la fenêtre est redimensionnée
window.addEventListener('resize', () => {
  const { gameWidth, gameHeight } = calculateIdealSize(
    window.innerWidth,
    window.innerHeight
  );
  game.scale.resize(gameWidth, gameHeight);
});
