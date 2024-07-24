import { createLayers, createSprite } from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/Characters/player';
import { createBulleAnimation } from '../utils/animation/bulleAnimation';

export default class LabyScene extends Phaser.Scene {
  constructor() {
    super('laby-scene');
  }

  preload() {
    this.loadResources();
  }

  create() {
    this.initializeVariables();
    this.setupMap();
    this.setupPlayer();
    this.setupCollisions();
    this.setupCamera();
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors);
    }
  }

  loadResources() {
    this.load.tilemapTiledJSON('labyMap', '/assets/map/laby.tmj');
    this.load.spritesheet('tiles', 'assets/spritesheet/tileset.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet('player', '/assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  initializeVariables() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupMap() {
    const map = this.make.tilemap({ key: 'labyMap' });
    const tiles = map.addTilesetImage('tileset', 'tiles');
    const layersConfig = [
      { name: 'Ground', tileset: tiles },
      { name: 'mur', tileset: tiles, collision: true },
    ];
    this.layers = createLayers(map, layersConfig);
    this.scale.resize(map.widthInPixels, map.heightInPixels);

    this.physics.world.setBounds(
      0,
      0,
      this.layers.Ground.width,
      this.layers.Ground.height
    );
  }

  setupPlayer() {
    this.player = new Player(this, 20, 20, 'player');
    this.player.sprite.anims.play('down', true);
    this.player.setSize(10, 12);
    this.player.setSpeed(80);
  }

  setupCollisions() {
    this.physics.add.collider(this.player.sprite, this.layers.mur);
  }

  setupCamera() {
    const mapWidth = this.layers.Ground.width;
    const mapHeight = this.layers.Ground.height;
    this.cameras.main.centerOn(mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1, 0, 0);
    this.cameras.main.setDeadzone(10, 10);
    this.cameras.main.setZoom(2);
  }
}
