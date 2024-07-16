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

    this.moveDuration = 2000; // Durée pendant laquelle le PNJ se déplace dans une direction
    this.lastMoveTime = 0; // Temps du dernier mouvement

    // Initialiser le mouvement du PNJ
    this.moveNPC();
  }

  moveNPC() {
    const directions = ['left', 'right', 'up', 'down'];
    const direction = Phaser.Utils.Array.GetRandom(directions);

    switch (direction) {
      case 'left':
        this.sprite.setVelocity(-50, 0);
        this.sprite.anims.play('npc-walk-left', true);
        break;
      case 'right':
        this.sprite.setVelocity(50, 0);
        this.sprite.anims.play('npc-walk-right', true);
        break;
      case 'up':
        this.sprite.setVelocity(0, -50);
        this.sprite.anims.play('npc-walk-up', true);
        break;
      case 'down':
        this.sprite.setVelocity(0, 50);
        this.sprite.anims.play('npc-walk-down', true);
        break;
    }

    // Arrêter le mouvement après la durée définie
    this.scene.time.delayedCall(this.moveDuration, () => {
      this.sprite.setVelocity(0, 0);
      this.sprite.anims.stop();
    });
  }

  update(time) {
    if (time > this.lastMoveTime + this.moveDuration) {
      this.moveNPC();
      this.lastMoveTime = time;
    }

    // Vérifier que le PNJ reste à l'intérieur des limites de la carte
    if (this.sprite.x < 0) this.sprite.x = 0;
    if (this.sprite.x > this.scene.physics.world.bounds.width)
      this.sprite.x = this.scene.physics.world.bounds.width;
    if (this.sprite.y < 0) this.sprite.y = 0;
    if (this.sprite.y > this.scene.physics.world.bounds.height)
      this.sprite.y = this.scene.physics.world.bounds.height;
  }
}

export default NPC;
