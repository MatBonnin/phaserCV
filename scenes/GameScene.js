import { createLayers, createSprite } from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/player';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speed = 200;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
  }

  preload() {
    this.load.spritesheet('tiles', 'assets/tileset.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.tilemapTiledJSON('map', 'assets/map.tmj');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.bitmapFont(
      'minogram',
      'fonts/minogram_6x10.png',
      'fonts/minogram_6x10.xml'
    );
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tileset', 'tiles');

    const layersConfig = [
      { name: 'ground', tileset: tiles },
      { name: 'Maison', tileset: tiles, collision: true },
      { name: 'Statue', tileset: tiles, collision: true },
      { name: 'habillage', tileset: tiles },
      { name: 'toit', tileset: tiles },
      { name: 'doors', tileset: tiles },
      { name: 'headStatue', tileset: tiles, collision: true },
    ];

    this.layers = createLayers(map, layersConfig);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // Récupérer la position du joueur stockée
    const playerPosition = this.scene
      .get('scene-game')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 55;
    const startY = playerPosition ? playerPosition.y : 100;

    this.player = new Player(this, startX, startY, 'player');

    this.physics.add.collider(this.player.sprite, this.layers.Maison);
    this.physics.add.collider(this.player.sprite, this.layers.Statue);

    const doorConfig = {
      x: 390,
      y: 285,
      texture: 'tiles',
      frame: 373,
      width: 16,
      height: 16,
      callback: this.enterHouse.bind(this),
    };
    this.door = createSprite(this, doorConfig);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 3, mapHeight / 3);
    this.cameras.main.startFollow(this.player.sprite);

    this.layers.ground.setDepth(0);
    this.layers.Maison.setDepth(1);
    this.layers.Statue.setDepth(2);
    this.layers.habillage.setDepth(3);
    this.layers.doors.setDepth(5);
    this.player.sprite.setDepth(6);

    const animationSettings = [
      { key: 'left', start: 52, end: 54 },
      { key: 'right', start: 18, end: 20 },
      { key: 'up', start: 35, end: 37 },
      { key: 'down', start: 0, end: 2 },
    ];

    animationSettings.forEach(({ key, start, end }) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers('player', { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.update(this.cursors);

    this.player.sprite.setDepth(this.player.sprite.y);

    if (this.player.sprite.y < this.layers.toit.y) {
      this.layers.toit.setDepth(this.player.sprite.depth - 1);
    } else {
      this.layers.toit.setDepth(this.player.sprite.depth + 1);
    }

    if (this.player.sprite.y < this.layers.headStatue.y) {
      this.layers.headStatue.setDepth(this.player.sprite.depth - 1);
    } else {
      this.layers.headStatue.setDepth(this.player.sprite.depth + 1);
    }
  }

  enterHouse() {
    // Sauvegarder la position du joueur
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-game').data.set('playerPosition', playerPosition);

    // Changer de scène
    this.scene.start('house-scene');
  }
}
