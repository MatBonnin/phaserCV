import Phaser from 'phaser';
import { createSprite } from '../utils';

export default class Statue extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.scene = scene;

    const frames = [
      { key: 'tiles', frame: 1248, x: 0, y: 0 },
      { key: 'tiles', frame: 1249, x: 16, y: 0 },
      { key: 'tiles', frame: 1288, x: 0, y: 16 },
      { key: 'tiles', frame: 1289, x: 16, y: 16 },
      { key: 'tiles', frame: 1328, x: 0, y: 32 },
      { key: 'tiles', frame: 1329, x: 16, y: 32 },
    ];

    frames.forEach((frame) => {
      const sprite = scene.add.sprite(frame.x, frame.y, frame.key, frame.frame);
      this.add(sprite);
    });

    scene.physics.world.enable(this);
    this.body.setSize(30, 35);
    this.body.setImmovable(true);
    this.body.setOffset(-6, 0);

    scene.add.existing(this);

    // Créer la porte cachée et ajuster sa position
    this.hiddenDoor = this.createHiddenDoor(x, y - 20);
    this.setDepth(5); // Définir le depth de la statue pour qu'elle soit devant
  }

  createHiddenDoor(x, y) {
    const doorFrames = [155, 156, 195, 196];
    const door = this.scene.add.group();
    doorFrames.forEach((frame, index) => {
      const xOffset = (index % 2) * 16;
      const yOffset = Math.floor(index / 2) * 16;
      // Utiliser createSprite pour chaque frame
      const spriteConfig = {
        x: x + xOffset,
        y: y + 32 + yOffset,
        texture: 'tiles',
        frame: frame,
        width: 16, // La largeur et la hauteur doivent correspondre à celles de tes sprites
        height: 16,
        callback: this.enterRick.bind(this),
      };
      const sprite = createSprite(this.scene, spriteConfig);
      sprite.body.setSize(5, 5);
      sprite.setDepth(1); // Assurez-vous que la porte est derrière la statue
      door.add(sprite);
    });
    return door;
  }

  enterRick() {
    this.scene.acccueilMusic.stop();
    this.scene.scene.start('scene-rick');
  }

  moveLeft(distance) {
    const newX = this.x - distance;
    if (newX >= 0) {
      this.scene.tweens.add({
        targets: this,
        x: newX,
        ease: 'Power1',
        duration: 500,
      });
    } else {
    }
  }
}
