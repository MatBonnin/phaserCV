export function createAnimations(scene) {
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
}
