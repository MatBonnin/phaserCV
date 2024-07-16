import Enemy from './Enemy';

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

export function setGameCanvasMargins(left, top) {
  const gameCanvas = document.getElementById('gameCanvas');
  const body = document.getElementById('body');
  if (gameCanvas) {
    gameCanvas.style.marginLeft = left;
    // body.style.marginTop = top;
  }
}

export function generateEnemies(
  scene,
  nbEnnemies,
  health,
  speed,
  attackPower,
  animationKey,
  animationStart,
  animationEnd,
  dropRate
) {
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (let i = 0; i < nbEnnemies; i++) {
    const x = getRandomArbitrary(100, 200);
    const y = getRandomArbitrary(100, 200);
    const enemy1 = new Enemy(scene, x, y, 'enemies', animationStart, {
      health: health,
      speed: speed,
      attackPower: attackPower,
      animationKey: animationKey,
      animationStart: animationStart,
      animationEnd: animationEnd,
      dropRate: dropRate,
    });

    enemy1.setTarget(scene.player);

    scene.enemies.add(enemy1.sprite);
  }
}

export function generateWaves(waveIndex, scene) {
  const enemyTypes = [
    {
      animationStart: 488,
      animationEnd: 496,
      animationKey: 'enemy-type1-walk',
      health: 20,
      speed: 50,
      attackPower: 10,
      dropRate: 0.9,
    },
    {
      animationStart: 424,
      animationEnd: 432,
      animationKey: 'enemy-type2-walk',
      health: 30,
      speed: 70,
      attackPower: 15,
      dropRate: 0.7,
    },
    {
      animationStart: 360,
      animationEnd: 368,
      animationKey: 'enemy-type3-walk',
      health: 40,
      speed: 70,
      attackPower: 20,
      dropRate: 0.6,
    },
    {
      animationStart: 296,
      animationEnd: 304,
      animationKey: 'enemy-type4-walk',
      health: 30,
      speed: 50,
      attackPower: 40,
      dropRate: 1,
    },
    {
      animationStart: 232,
      animationEnd: 240,
      animationKey: 'enemy-type5-walk',
      health: 60,
      speed: 90,
      attackPower: 5,
      dropRate: 0.3,
    },
    {
      animationStart: 247,
      animationEnd: 254,
      animationKey: 'enemy-type6-walk',
      health: 70,
      speed: 50,
      attackPower: 30,
      dropRate: 0.9,
    },
  ];

  const waves = [
    // Vague 1 - Découverte du type 1
    [{ typeIndex: 0, nbEnemies: 2 }],
    // Vague 2 - Découverte du type 2
    [{ typeIndex: 1, nbEnemies: 3 }],
    // Vague 3 - Mix des types 1 et 2
    [
      { typeIndex: 0, nbEnemies: 2 },
      { typeIndex: 1, nbEnemies: 3 },
    ],
    // Vague 4 - Introduction du type 3
    [{ typeIndex: 2, nbEnemies: 4 }],
    // Vague 5 - Mix de tous les types précédents
    [
      { typeIndex: 0, nbEnemies: 2 },
      { typeIndex: 1, nbEnemies: 2 },
      { typeIndex: 2, nbEnemies: 3 },
    ],
    // Vague 6 - Introduction du type 4
    [{ typeIndex: 3, nbEnemies: 5 }],
    // Vague 7 - Mix des types 1, 2 et 4
    [
      { typeIndex: 0, nbEnemies: 3 },
      { typeIndex: 1, nbEnemies: 3 },
      { typeIndex: 3, nbEnemies: 2 },
    ],
    // Vague 8 - Introduction du type 5
    [{ typeIndex: 4, nbEnemies: 4 }],
    // Vague 9 - Mix de tous les types précédents
    [
      { typeIndex: 0, nbEnemies: 2 },
      { typeIndex: 1, nbEnemies: 2 },
      { typeIndex: 2, nbEnemies: 2 },
      { typeIndex: 3, nbEnemies: 2 },
      { typeIndex: 4, nbEnemies: 2 },
    ],
    // Vague 10 - Introduction du type 6
    [{ typeIndex: 5, nbEnemies: 5 }],
    // Vague 11 - Mix de tous les types avec augmentation du nombre d'ennemis
    [
      { typeIndex: 0, nbEnemies: 3 },
      { typeIndex: 1, nbEnemies: 3 },
      { typeIndex: 2, nbEnemies: 3 },
      { typeIndex: 3, nbEnemies: 3 },
      { typeIndex: 4, nbEnemies: 3 },
      { typeIndex: 5, nbEnemies: 2 },
    ],
    // Vague 12 - Combinaison complexe
    [
      { typeIndex: 0, nbEnemies: 4 },
      { typeIndex: 2, nbEnemies: 4 },
      { typeIndex: 4, nbEnemies: 4 },
    ],
    // Vague 13 - Ennemis rapides et puissants
    [
      { typeIndex: 1, nbEnemies: 5 },
      { typeIndex: 4, nbEnemies: 5 },
    ],
    // Vague 14 - Équilibre entre tous les types
    [
      { typeIndex: 0, nbEnemies: 2 },
      { typeIndex: 1, nbEnemies: 2 },
      { typeIndex: 2, nbEnemies: 2 },
      { typeIndex: 3, nbEnemies: 2 },
      { typeIndex: 4, nbEnemies: 2 },
      { typeIndex: 5, nbEnemies: 2 },
    ],
    // Vague 15 - Plus d'ennemis
    [
      { typeIndex: 0, nbEnemies: 4 },
      { typeIndex: 1, nbEnemies: 4 },
      { typeIndex: 2, nbEnemies: 4 },
      { typeIndex: 3, nbEnemies: 4 },
      { typeIndex: 4, nbEnemies: 4 },
      { typeIndex: 5, nbEnemies: 4 },
    ],
    // Vague 16 - Forts et rapides
    [
      { typeIndex: 3, nbEnemies: 6 },
      { typeIndex: 4, nbEnemies: 6 },
    ],
    // Vague 17 - Grand mélange
    [
      { typeIndex: 0, nbEnemies: 3 },
      { typeIndex: 1, nbEnemies: 3 },
      { typeIndex: 2, nbEnemies: 3 },
      { typeIndex: 3, nbEnemies: 3 },
      { typeIndex: 4, nbEnemies: 3 },
      { typeIndex: 5, nbEnemies: 3 },
    ],
    // Vague 18 - Plus compliqué
    [
      { typeIndex: 1, nbEnemies: 5 },
      { typeIndex: 2, nbEnemies: 5 },
      { typeIndex: 4, nbEnemies: 5 },
    ],
    // Vague 19 - Combinaison stratégique
    [
      { typeIndex: 0, nbEnemies: 5 },
      { typeIndex: 3, nbEnemies: 5 },
      { typeIndex: 5, nbEnemies: 5 },
    ],
    // Vague 20 - Ultime défi
    [
      { typeIndex: 0, nbEnemies: 4 },
      { typeIndex: 1, nbEnemies: 4 },
      { typeIndex: 2, nbEnemies: 4 },
      { typeIndex: 3, nbEnemies: 4 },
      { typeIndex: 4, nbEnemies: 4 },
      { typeIndex: 5, nbEnemies: 4 },
    ],
  ];

  function generateWave(waveIndex) {
    const waveConfig = waves[waveIndex];
    waveConfig.forEach((wave) => {
      const enemyType = enemyTypes[wave.typeIndex];
      generateEnemies(
        scene, // scène
        wave.nbEnemies,
        enemyType.health,
        enemyType.speed,
        enemyType.attackPower,
        enemyType.animationKey,
        enemyType.animationStart,
        enemyType.animationEnd,
        enemyType.dropRate
      );
    });
  }

  generateWave(waveIndex);
  // Afficher le tableau généré pour la vérification
}
