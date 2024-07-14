import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(this.sprite.width / 1.2, this.sprite.height / 2);
    this.sprite.body.setOffset(1.2, this.sprite.height / 3);
    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    this.sprite.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.sprite.body.setVelocityX(-160);
      this.sprite.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.sprite.body.setVelocityX(160);
      this.sprite.anims.play('right', true);
    } else if (this.cursors.up.isDown) {
      this.sprite.body.setVelocityY(-160);
      this.sprite.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.sprite.body.setVelocityY(160);
      this.sprite.anims.play('down', true);
    } else {
      this.sprite.anims.stop();
    }
  }

  setDepth(value) {
    this.sprite.setDepth(value);
  }

  setCollideWorldBounds(value) {
    this.sprite.setCollideWorldBounds(value);
  }

  body() {
    return this.sprite.body;
  }

  // Ajouter des méthodes proxy pour toutes les méthodes de Phaser.Sprite que vous souhaitez utiliser
}
