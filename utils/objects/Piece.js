// utils/Characters/Piece.js

import Phaser from 'phaser';

class Piece {
  constructor(scene, x, y, texture, name) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.name = name;
    // Jouer l'animation de la pièce
    this.sprite.anims.play('piece-spin');
  }

  collect() {
    this.sprite.disableBody(true, true);
  }
}

export default Piece;
