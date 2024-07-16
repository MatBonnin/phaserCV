export function createNPCAnimations(scene) {
  scene.anims.create({
    key: 'npc-walk-left',
    frames: scene.anims.generateFrameNumbers('npc', { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'npc-walk-right',
    frames: scene.anims.generateFrameNumbers('npc', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'npc-walk-up',
    frames: scene.anims.generateFrameNumbers('npc', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'npc-walk-down',
    frames: scene.anims.generateFrameNumbers('npc', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
}
