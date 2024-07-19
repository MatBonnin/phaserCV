import Phaser from 'phaser';

export default class Player {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body.setSize(this.sprite.width / 1.2, this.sprite.height / 2);
    this.sprite.body.setOffset(1.2, this.sprite.height / 3);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.F
    );
    this.direction = 'right';
    this.attacking = false;
    this.attackPower = 10; // Puissance de l'attaque du joueur
    this.health = 100;
    this.attackKey.on('down', () => {
      this.attacking = true;
      this.scene.time.delayedCall(300, () => {
        this.attacking = false;
      });
    });
  }

  update(cursors) {
    this.sprite.body.setVelocity(0);

    if (this.attacking) {
      switch (this.direction) {
        case 'left':
          this.sprite.anims.play('attack-left', true);
          break;
        case 'right':
          this.sprite.anims.play('attack-right', true);
          break;
        case 'up':
          this.sprite.anims.play('attack-up', true);
          break;
        case 'down':
          this.sprite.anims.play('attack-down', true);
          break;
      }
    } else {
      if (cursors.left.isDown) {
        this.sprite.body.setVelocityX(-160);
        this.sprite.anims.play('left', true);
        this.direction = 'left';
      } else if (cursors.right.isDown) {
        this.sprite.body.setVelocityX(160);
        this.sprite.anims.play('right', true);
        this.direction = 'right';
      } else if (cursors.up.isDown) {
        this.sprite.body.setVelocityY(-160);
        this.sprite.anims.play('up', true);
        this.direction = 'up';
      } else if (cursors.down.isDown) {
        this.sprite.body.setVelocityY(160);
        this.sprite.anims.play('down', true);
        this.direction = 'down';
      } else {
        this.sprite.anims.stop();
      }
    }
  }

  setHealth(value) {
    if (value > 100) {
      this.health = 100;
      return;
    } else if (this.health <= 0) {
      this.health = 0;
      this.scene.events.emit('playerDied');
    } else {
      this.health = value;
    }
  }

  collectHeart(playerSprite, heart) {
    if (heart.getData('type') === 'heart') {
      this.setHealth(this.getHealth() + heart.getData('healAmount'));
      heart.destroy();
    }
  }

  getHealth() {
    return this.health;
  }

  isAttacking() {
    return this.attacking;
  }

  getAttackPower() {
    return this.attackPower;
  }
}
