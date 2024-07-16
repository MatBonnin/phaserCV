import Phaser from 'phaser';

class NPC {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);

    // Initialiser les animations
    this.sprite.anims.play('npc-walk-down'); // Animation par défaut

    // Définir les collisions pour le PNJ
    scene.physics.add.collider(this.sprite, scene.layers.Maison);
    scene.physics.add.collider(this.sprite, scene.layers.Statue);
    scene.physics.add.collider(this.sprite, scene.player.sprite);

    this.destination = { x, y };
    this.speed = 50;
    this.pauseDuration = 1000; // Durée de la pause en ms

    this.chooseNewDestination();
  }

  chooseNewDestination() {
    // Choisir une nouvelle destination aléatoire dans une zone définie
    const buffer = 50; // Évite de choisir une destination trop proche des bords de la carte
    this.destination.x = Phaser.Math.Between(
      buffer,
      this.scene.physics.world.bounds.width - buffer
    );
    this.destination.y = Phaser.Math.Between(
      buffer,
      this.scene.physics.world.bounds.height - buffer
    );

    // Déplacer le PNJ vers la nouvelle destination
    this.moveToDestination();
  }

  moveToDestination() {
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      this.destination.x,
      this.destination.y
    );
    this.scene.physics.velocityFromRotation(
      angle,
      this.speed,
      this.sprite.body.velocity
    );

    if (this.destination.x < this.sprite.x) {
      this.sprite.anims.play('npc-walk-left', true);
    } else if (this.destination.x > this.sprite.x) {
      this.sprite.anims.play('npc-walk-right', true);
    } else if (this.destination.y < this.sprite.y) {
      this.sprite.anims.play('npc-walk-up', true);
    } else if (this.destination.y > this.sprite.y) {
      this.sprite.anims.play('npc-walk-down', true);
    }
  }

  update() {
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      this.destination.x,
      this.destination.y
    );

    if (distance < 5) {
      // Arrêter le mouvement
      this.sprite.body.velocity.set(0);
      this.sprite.anims.stop();

      // Choisir une nouvelle destination après une pause
      this.scene.time.delayedCall(this.pauseDuration, () => {
        this.chooseNewDestination();
      });
    }
  }
}

export default NPC;
