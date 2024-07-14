export function createLayers(map, layersConfig) {
  const layers = {};
  layersConfig.forEach((config) => {
    layers[config.name] = map.createLayer(config.name, config.tileset, 0, 0);
    if (config.collision === true) {
      layers[config.name].setCollisionBetween(1, 2000);
    }
  });
  return layers;
}

export function preloadAssets(scene) {
  scene.load.spritesheet('Inner', 'assets/Inner.png', {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.image('objects', '/assets/objects.png');
  scene.load.image('NPC_test', '/assets/NPC_test.png');
  scene.load.tilemapTiledJSON('houseMap', '/assets/houseMap.tmj');
  scene.load.spritesheet('player', '/assets/player.png', {
    frameWidth: 16,
    frameHeight: 32,
  });

  scene.load.bitmapFont(
    'minogram',
    'fonts/minogram_6x10.png',
    'fonts/minogram_6x10.xml'
  );
}

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

//Exemple de config
// const bookConfig = {
//   x: 408,
//   y: 345,
//   texture: 'Inner',
//   frame: 373,
//   width: 16,
//   height: 16,
//   callback: this.handleOverlap,
// };

export function createSprite(scene, spriteConfig) {
  const sprite = scene.physics.add.sprite(
    spriteConfig.x,
    spriteConfig.y,
    spriteConfig.texture,
    spriteConfig.frame
  );
  sprite.body.setSize(spriteConfig.width, spriteConfig.height);
  if (spriteConfig.callback) {
    scene.physics.add.overlap(
      scene.player.sprite,
      sprite,
      spriteConfig.callback,
      null,
      scene
    );
  }
  return sprite;
}
