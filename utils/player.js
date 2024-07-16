import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(this.sprite.width / 1.2, this.sprite.height / 2.5);
    this.sprite.body.setOffset(1.2, this.sprite.height / 3);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.F
    );
    this.direction = 'right';
    this.isAttacking = false;
    this.lastAttackTime = 0;
    this.attackCooldown = 500; // cooldown in ms

    this.sprite.on('animationcomplete', (animation, frame) => {
      if (animation.key.startsWith('attack-')) {
        this.isAttacking = false;
        // this.sprite.setSize(this.sprite.width / 1.2, this.sprite.height / 2);
        // this.sprite.setOffset(1.2, this.sprite.height / 3);
      }
    });
  }

  update() {
    const currentTime = this.scene.time.now;

    if (
      this.attackKey.isDown &&
      !this.isAttacking &&
      currentTime - this.lastAttackTime > this.attackCooldown
    ) {
      this.isAttacking = true;
      this.lastAttackTime = currentTime;
      this.sprite.anims.play(`attack-${this.direction}`, true);
    }

    if (!this.isAttacking) {
      this.sprite.body.setVelocity(0);

      if (this.cursors.left.isDown) {
        this.sprite.body.setVelocityX(-160);
        this.sprite.anims.play('left', true);
        this.direction = 'left';
      } else if (this.cursors.right.isDown) {
        this.sprite.body.setVelocityX(160);
        this.sprite.anims.play('right', true);
        this.direction = 'right';
      } else if (this.cursors.up.isDown) {
        this.sprite.body.setVelocityY(-160);
        this.sprite.anims.play('up', true);
        this.direction = 'up';
      } else if (this.cursors.down.isDown) {
        this.sprite.body.setVelocityY(160);
        this.sprite.anims.play('down', true);
        this.direction = 'down';
      } else {
        this.sprite.anims.stop();
      }
    } else {
      // Permettre le mouvement pendant l'attaque sans forcer l'animation de déplacement
      if (this.cursors.left.isDown) {
        this.sprite.body.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.sprite.body.setVelocityX(160);
      } else if (this.cursors.up.isDown) {
        this.sprite.body.setVelocityY(-160);
      } else if (this.cursors.down.isDown) {
        this.sprite.body.setVelocityY(160);
      }
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
}
