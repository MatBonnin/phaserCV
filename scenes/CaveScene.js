import { createLayers, createSprite } from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/Characters/player';

export default class CaveScene extends Phaser.Scene {
  constructor() {
    super('scene-cave');
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
    this.setupDepth();
    this.setupExits();
  }

  update() {
    this.player.update(this.cursors);
    this.player.sprite.setDepth(3); // Garder la profondeur fixe
  }

  loadResources() {
    this.load.spritesheet('caveTiles', 'assets/spritesheet/cave.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.tilemapTiledJSON('caveMap', 'assets/map/cave.tmj');
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

  initializeVariables() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  setupMap() {
    const map = this.make.tilemap({ key: 'caveMap' });
    const tiles = map.addTilesetImage('cave', 'caveTiles');

    const layersConfig = [
      { name: 'ground', tileset: tiles },
      { name: 'trou', tileset: tiles },
      { name: 'decore', tileset: tiles, collision: true },
      { name: 'lumiere', tileset: tiles },
      { name: 'headStatue', tileset: tiles },
    ];

    this.layers = createLayers(map, layersConfig);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.scale.resize(mapWidth, 600);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;
  }

  setupPlayer() {
    const playerPosition = this.scene
      .get('scene-cave')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 120;
    const startY = playerPosition ? playerPosition.y : 200;

    this.player = new Player(this, startX, startY, 'player');
    this.player.sprite.anims.play('up', true);
  }

  setupCollisions() {
    this.physics.add.collider(this.player.sprite, this.layers.decore);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5, 0, 100);
    this.cameras.main.setLerp(0.1, 0.1); // Lissage horizontal et vertical
    this.cameras.main.setDeadzone(300, 50); // Zone non suivie au centre de la caméra
  }

  setupDepth() {
    this.layers.ground.setDepth(0);
    this.layers.trou.setDepth(1);
    this.layers.decore.setDepth(2);
    this.layers.lumiere.setDepth(5); // Lumiere a une profondeur fixe
    this.layers.headStatue.setDepth(4);
    this.player.sprite.setDepth(3); // Joueur toujours derrière lumiere
  }

  setupExits() {
    const exitConfig = {
      x: 120, // Coordonnées de la sortie, ajustez-les selon votre carte
      y: 230,
      texture: 'caveTiles',
      frame: 373,
      width: 10,
      height: 10,
      callback: this.exitCave.bind(this),
    };
    this.exit = createSprite(this, exitConfig);

    const holeConfig = {
      x: 120, // Coordonnées de la sortie, ajustez-les selon votre carte
      y: 10,
      texture: 'caveTiles',
      frame: 373,
      width: 50,
      height: 50,
      callback: this.enterHole.bind(this),
    };
    this.hole = createSprite(this, holeConfig);
  }

  exitCave() {
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-cave').data.set('playerPosition', playerPosition);
    this.scene.start('scene-game');
  }

  enterHole() {
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-cave').data.set('playerPosition', playerPosition);
    this.scene.start('scene-level1');
  }
}
