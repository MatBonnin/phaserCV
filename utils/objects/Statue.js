import Phaser from 'phaser';

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
    this.body.setSize(25, 30);
    this.body.setImmovable(true);

    scene.add.existing(this);

    // Créer la porte cachée et ajuster sa position
    this.hiddenDoor = this.createHiddenDoor(330, 100);
    this.setDepth(7); // Définir le depth de la statue pour qu'elle soit devant
  }

  createHiddenDoor(x, y) {
    const door = this.scene.add.group();
    const doorFrames = [155, 156, 195, 196];
    doorFrames.forEach((frame, index) => {
      const xOffset = (index % 2) * 16;
      const yOffset = Math.floor(index / 2) * 16;
      const sprite = this.scene.add.sprite(
        x + xOffset,
        y + 32 + yOffset,
        'tiles',
        frame
      );
      sprite.setDepth(1); // Assurez-vous que la porte est derrière la statue
      door.add(sprite);
    });
    return door;
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
