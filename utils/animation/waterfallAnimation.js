export function waterfallAnimattion(scene) {
  scene.anims.create({
    key: 'waterfallAnimation',
    frames: scene.anims.generateFrameNumbers('tiles', {
      start: 258,
      end: 260,
    }), // Ajuste `end` en fonction du nombre de frames
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: 'waterfallAnimationMiddle',
    frames: scene.anims.generateFrameNumbers('tiles', {
      start: 298,
      end: 300,
    }), // Ajuste `end` en fonction du nombre de frames
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: 'waterfallAnimationDown',
    frames: scene.anims.generateFrameNumbers('tiles', {
      start: 338,
      end: 340,
    }), // Ajuste `end` en fonction du nombre de frames
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'waterfallWater',
    frames: [
      { key: 'tiles', frame: 378 },
      { key: 'tiles', frame: 418 },
      { key: 'tiles', frame: 459 },
    ],
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'waterfallWaterLeft',
    frames: [
      { key: 'tiles', frame: 377 },
      { key: 'tiles', frame: 417 },
      { key: 'tiles', frame: 458 },
    ],
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'waterfallWaterRight',
    frames: [
      { key: 'tiles', frame: 379 },
      { key: 'tiles', frame: 419 },
      { key: 'tiles', frame: 460 },
    ],
    frameRate: 10,
    repeat: -1,
  });

  // Placer l'animation sur la carte
  const waterfallTop = scene.add.sprite(376, 280, 'tiles'); // Coordonnes x et y pour la partie supérieure de la chute
  waterfallTop.play('waterfallAnimation');

  const waterfallMiddle = scene.add.sprite(376, 296, 'tiles'); // 16 pixels en dessous
  waterfallMiddle.play('waterfallAnimationMiddle');

  const waterfallBottom = scene.add.sprite(376, 312, 'tiles'); // Encore 16 pixels en dessous
  waterfallBottom.play('waterfallAnimationDown');

  const waterfallWater = scene.add.sprite(376, 328, 'tiles'); // Encore 16 pixels en dessous
  waterfallWater.play('waterfallWater');

  const waterfallWaterLeft = scene.add.sprite(360, 328, 'tiles'); // 16 pixels à gauche
  waterfallWaterLeft.play('waterfallWaterLeft');

  const waterfallWaterRight = scene.add.sprite(392, 328, 'tiles'); // 16 pixels à droite
  waterfallWaterRight.play('waterfallWaterRight');
}
