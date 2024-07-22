export default class Axe {
  constructor(scene, x, y, texture) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture, 341); // Utiliser la frame 341 pour la hache
    this.sprite.setActive(false).setVisible(false); // Désactiver et cacher la hache initialement
  }

  throw(x, y, direction) {
    this.sprite.setActive(true).setVisible(true);
    this.sprite.setPosition(x, y); // Position de départ basée sur le joueur
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    // Vitesse de la hache
    const speed = 500; // Ajuste la vitesse si nécessaire
    if (direction === 'left') {
      this.sprite.body.velocity.x = -speed;
    } else if (direction === 'right') {
      this.sprite.body.velocity.x = speed;
    } else if (direction === 'up') {
      this.sprite.body.velocity.y = -speed;
    } else if (direction === 'down') {
      this.sprite.body.velocity.y = speed;
    }

    // Rotation de la hache
    this.sprite.setAngularVelocity(800); // Ajuste la vitesse de rotation si nécessaire

    // Désactiver la hache après un certain temps ou lorsqu'elle heurte un obstacle
    this.scene.time.delayedCall(
      1500,
      () => {
        this.sprite.setActive(false).setVisible(false);
        this.sprite.setAngularVelocity(0); // Arrêter la rotation lorsque la hache est désactivée
      },
      [],
      this
    );
  }
}
