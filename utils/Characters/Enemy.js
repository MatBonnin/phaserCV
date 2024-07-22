import Phaser from 'phaser';

export default class Enemy {
  constructor(scene, x, y, texture, frame, config) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture, frame);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setData('ref', this); // Référence à cet objet Enemy

    // Configurations spécifiques à l'ennemi
    this.health = config.health || 100;
    this.speed = config.speed || 100;
    this.attackPower = config.attackPower || 10;
    this.animationKey = config.animationKey || 'default';
    this.animationStart = config.animationStart || 0;
    this.animationEnd = config.animationEnd || 0;
    this.attackRange = config.attackRange || 20; // rayon d'attaque
    this.attackTimer = null; // Timer pour l'attaque
    this.dropRate = config.dropRate || 0.3; // Taux de drop
    this.target = null;

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
      let distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        this.target.sprite.x,
        this.target.sprite.y
      );

      if (distance < this.attackRange) {
        this.startAttacking();
      } else {
        this.stopAttacking();
      }
    }
  }

  attack() {
    if (this.target) {
      this.target.setHealth((this.target.health -= this.attackPower));
      this.showDamageText(this.target.sprite, 'yellow', this.attackPower);
    }
  }

  startAttacking() {
    if (!this.attackTimer) {
      this.attackTimer = this.scene.time.addEvent({
        delay: 500, // attaque toutes les secondes
        callback: this.attack,
        callbackScope: this,
        loop: true,
      });
    }
  }

  stopAttacking() {
    if (this.attackTimer) {
      this.attackTimer.remove();
      this.attackTimer = null;
    }
  }

  takeDamage(amount, attacker) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    } else {
      // Afficher le texte de dégât
      this.showDamageText(this.sprite, '#ff0000', amount);

      // Interrompre la poursuite et l'attaque
      this.setTarget(null); // Arrêter de suivre l'attaquant

      // Calcul de l'angle de l'attaque pour le recul
      const angleFromAttacker = Phaser.Math.Angle.Between(
        attacker.sprite.x,
        attacker.sprite.y,
        this.sprite.x,
        this.sprite.y
      );
      const coef = 200;

      // Appliquer une interpolation pour un recul plus doux et plus prononcé
      const velocityX = coef * Math.cos(angleFromAttacker); // Force du recul sur l'axe X
      const velocityY = coef * Math.sin(angleFromAttacker); // Force du recul sur l'axe Y
      this.scene.tweens.add({
        targets: this.sprite.body.velocity,
        props: {
          x: { value: velocityX, duration: 300, ease: 'Power0' },
          y: { value: velocityY, duration: 300, ease: 'Power0' },
        },
        onComplete: () => {
          if (this.sprite.body) {
            this.sprite.body.setVelocity(0); // Arrêter le mouvement après le recul
          }
        },
      });

      // Reprendre la poursuite après un délai si nécessaire
      this.scene.time.delayedCall(500, () => {
        this.setTarget(this.scene.player); // Supposons que le joueur est la cible
      });
    }
  }

  showDamageText(entity, color, amount) {
    const damageText = this.scene.add
      .text(entity.x, entity.y - 20, `${amount}`, {
        font: '18px Arial',
        fill: color,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: damageText,
      y: entity.y - 50,
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 500,
      onComplete: () => {
        damageText.destroy();
      },
    });
  }

  die() {
    this.sprite.destroy();

    this.stopAttacking(); // Arrêter le timer d'attaque
    this.dropHeart();
  }

  dropHeart() {
    // Taux de drop de 30%
    if (Math.random() < this.dropRate) {
      const heart = this.scene.physics.add.sprite(
        this.sprite.x,
        this.sprite.y,
        'objectTiles',
        268
      );

      this.scene.physics.world.enable(heart);
      heart.setInteractive();
      heart.setData('type', 'heart');
      heart.setData('healAmount', 25);
      this.scene.physics.add.overlap(
        this.scene.player.sprite,
        heart,
        this.scene.player.collectHeart,
        null,
        this.scene.player
      );
    }
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
