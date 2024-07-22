export function createPlayerAnimations(scene) {
  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers('player', { start: 52, end: 54 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers('player', { start: 18, end: 20 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'up',
    frames: scene.anims.generateFrameNumbers('player', { start: 35, end: 37 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'down',
    frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });

  // Ajouter les animations d'attaque
  scene.anims.create({
    key: 'attack-right',
    frames: scene.anims.generateFrameNumbers('playerAttack', {
      start: 48,
      end: 51,
    }),
    frameRate: 10,
    repeat: 0,
  });

  scene.anims.create({
    key: 'attack-left',
    frames: scene.anims.generateFrameNumbers('playerAttack', {
      start: 56,
      end: 59,
    }),
    frameRate: 10,
    repeat: 0,
  });

  scene.anims.create({
    key: 'attack-up',
    frames: scene.anims.generateFrameNumbers('playerAttack', {
      start: 40,
      end: 43,
    }),
    frameRate: 10,
    repeat: 0,
  });

  scene.anims.create({
    key: 'attack-down',
    frames: scene.anims.generateFrameNumbers('playerAttack', {
      start: 32,
      end: 35,
    }),
    frameRate: 10,
    repeat: 0,
  });
}
