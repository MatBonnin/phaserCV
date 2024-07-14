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
