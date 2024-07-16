import Phaser from 'phaser';

export default class Enemy {
  constructor(scene, x, y, texture, frame, config) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture, frame);
    this.sprite.setCollideWorldBounds(true);

    // Configurations spécifiques à l'ennemi
    this.health = config.health || 100;
    this.speed = config.speed || 100;
    this.attackPower = config.attackPower || 10;
    this.animationKey = config.animationKey || 'default';
    this.animationStart = config.animationStart || 0;
    this.animationEnd = config.animationEnd || 0;

    this.target = null; // La cible de l'ennemi, par exemple le joueur

    this.createAnimations();
    this.sprite.anims.play(this.animationKey);
  }

  setTarget(target) {
    this.target = target;
  }

  update() {
    if (this.target) {
      this.scene.physics.moveToObject(
        this.sprite,
        this.target.sprite,
        this.speed
      );

      // Ajoutez ici la logique d'attaque, par exemple lorsque l'ennemi est proche du joueur
      if (
        Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          this.target.sprite.x,
          this.target.sprite.y
        ) < 10
      ) {
        this.attack();
      }
    }
  }

  attack() {
    if (this.target) {
      // Logique d'attaque, par exemple réduire la santé du joueur
      this.target.health -= this.attackPower;
      console.log(
        `Attaque ! La santé du joueur est maintenant de ${this.target.health}`
      );
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.sprite.destroy();
    console.log("L'ennemi est mort");
  }

  createAnimations() {
    // Définir les animations pour chaque type d'ennemi
    if (!this.scene.anims.exists(this.animationKey)) {
      this.scene.anims.create({
        key: this.animationKey,
        frames: this.scene.anims.generateFrameNumbers('enemies', {
          start: this.animationStart,
          end: this.animationEnd,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }
}
