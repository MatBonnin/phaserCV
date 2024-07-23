import Axe from '../objects/Axe';
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
    this.speed = 160;
    this.attackDistance = 40;
    this.attackKey.on('down', () => {
      this.attacking = true;
      this.sprite.body.setOffset(9, 10);
      this.scene.time.delayedCall(300, () => {
        this.attacking = false;
        // this.sprite.body.setOffset(1.2, this.sprite.height / 3);
        switch (this.direction) {
          case 'left':
            this.sprite.anims.play('left', true);
            break;
          case 'right':
            this.sprite.anims.play('right', true);
            break;
          case 'up':
            this.sprite.anims.play('up', true);
            break;
          case 'down':
            this.sprite.anims.play('down', true);
            break;
        }
        this.sprite.body.setOffset(1.2, this.sprite.height / 3);
      });
    });

    this.axe = new Axe(scene, x, y, 'dungeon'); // Ajouter une hache
    this.throwKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    ); // Touche pour lancer la hache
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
        this.sprite.body.setVelocityX(-this.speed);
        this.sprite.anims.play('left', true);
        this.direction = 'left';
      } else if (cursors.right.isDown) {
        this.sprite.body.setVelocityX(this.speed);
        this.sprite.anims.play('right', true);
        this.direction = 'right';
      } else if (cursors.up.isDown) {
        this.sprite.body.setVelocityY(-this.speed);
        this.sprite.anims.play('up', true);
        this.direction = 'up';
      } else if (cursors.down.isDown) {
        this.sprite.body.setVelocityY(this.speed);
        this.sprite.anims.play('down', true);
        this.direction = 'down';
      } else {
        this.sprite.anims.stop();
      }
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.throwKey) &&
      !this.axe.sprite.active
    ) {
      this.axe.throw(this.sprite.x, this.sprite.y, this.direction);
    }
  }

  setSize(width, height) {
    this.sprite.body.setSize(width, height);
  }

  setSpeed(speed) {
    this.speed = speed;
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
