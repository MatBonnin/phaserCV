import {
  createLayers,
  createSprite,
  setGameCanvasMargins,
} from '../utils/utils';

import Enemy from '../utils/Enemy';
import Phaser from 'phaser';
import Player from '../utils/player';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('scene-level1');
  }

  preload() {
    this.load.spritesheet('floorTiles', 'assets/atlas_floor-16x16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('wallsHigh', 'assets/atlas_walls_high-16x32.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('wallsLow', 'assets/atlas_walls_low-16x16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet('enemies', 'assets/0x72_DungeonTilesetII_v1.7.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.tilemapTiledJSON('level1Map', 'assets/map/level1.tmj');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet('playerAttack', 'assets/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Charger le fichier audio si nécessaire
    // this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');
  }

  create() {
    const map = this.make.tilemap({ key: 'level1Map' });
    const floorTiles = map.addTilesetImage('atlas_floor-16x16', 'floorTiles');
    const wallsHigh = map.addTilesetImage(
      'atlas_walls_high-16x32',
      'wallsHigh'
    );
    const wallsLow = map.addTilesetImage('atlas_walls_low-16x16', 'wallsLow');

    const layersConfig = [
      { name: 'ground', tileset: floorTiles },
      { name: 'mur', tileset: wallsHigh, collision: true },
      { name: 'murLow', tileset: wallsLow, collision: true },
      { name: 'decoration', tileset: floorTiles },
      { name: 'flame', tileset: wallsHigh },
    ];

    this.layers = createLayers(map, layersConfig);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // Récupérer la position du joueur stockée
    const playerPosition = this.scene
      .get('scene-level1')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 160;
    const startY = playerPosition ? playerPosition.y : 270;

    this.player = new Player(this, startX, startY, 'player');

    this.physics.add.collider(this.player.sprite, this.layers.mur);
    this.physics.add.collider(this.player.sprite, this.layers.decoration);
    this.player.sprite.anims.play('up', true);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 3, mapHeight / 3);
    this.cameras.main.startFollow(this.player.sprite);

    this.layers.ground.setDepth(0);
    this.layers.mur.setDepth(1);
    this.layers.decoration.setDepth(2);
    this.layers.flame.setDepth(4); // Lumiere a une profondeur fixe
    this.player.sprite.setDepth(3); // Joueur toujours derrière lumiere

    this.cursors = this.input.keyboard.createCursorKeys();

    // Créer des ennemis
    this.enemies = this.add.group();

    const enemy1 = new Enemy(this, 200, 200, 'enemies', 424, {
      health: 50,
      speed: 50,
      attackPower: 5,
      animationKey: 'enemy1-walk',
      animationStart: 424,
      animationEnd: 431,
    });

    enemy1.setTarget(this.player);

    this.enemies.add(enemy1.sprite);
    this.enemyInstances = [enemy1];

    // Ajouter des collisions entre les ennemis et les murs
    this.physics.add.collider(this.enemies, this.layers.mur);
    this.physics.add.collider(this.enemies, this.layers.murLow);

    // Ajouter des collisions entre les attaques du joueur et les ennemis
    this.physics.add.overlap(
      this.player.sprite,
      this.enemies,
      this.handlePlayerAttack,
      null,
      this
    );

    // Jouer la musique de fond si nécessaire
    // this.backgroundMusic = this.sound.add('backgroundMusic');
    // this.backgroundMusic.play({ loop: true, volume: 0.5 });

    setGameCanvasMargins('40%', '35%');
  }

  update() {
    this.player.update(this.cursors);

    this.enemyInstances.forEach((enemy) => {
      enemy.update();
    });

    // Garder la profondeur fixe
    this.player.sprite.setDepth(3);
  }

  handlePlayerAttack(player, enemy) {
    const enemyInstance = this.enemyInstances.find((e) => e.sprite === enemy);
    if (enemyInstance && this.player.isAttacking()) {
      enemyInstance.takeDamage(this.player.getAttackPower());
    }
  }

  exitLevel() {
    // Sauvegarder la position du joueur
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-level1').data.set('playerPosition', playerPosition);

    // Changer de scène, par exemple retour à GameScene
    this.scene.start('scene-game');
  }
}
