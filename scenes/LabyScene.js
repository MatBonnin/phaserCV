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
    this.showLabyChoiceModal();
  }

  update() {
    if (this.player) {
      this.player.update(this.cursors);
    }
  }

  loadResources() {
    this.load.spritesheet('tiles', 'assets/spritesheet/tileset.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.tilemapTiledJSON('labyMap', '/assets/map/laby.tmj');
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

  showLabyChoiceModal() {
    const choice = confirm('Voulez-vous changer de labyrinthe ?');
    if (choice) {
      const size = prompt(
        'Entrez la taille du labyrinthe souhaité (par exemple 20):'
      );
      if (size) {
        this.generateNewMaze(size)
          .then(() => {
            this.initializeVariables();
            this.setupMap();
            this.setupPlayer();
            this.setupCollisions();
            this.setupCamera();
          })
          .catch((err) => {
            console.error('Erreur lors de la génération du labyrinthe : ', err);
          });
      }
    } else {
      this.initializeVariables();
      this.setupMap();
      this.setupPlayer();
      this.setupCollisions();
      this.setupCamera();
    }
  }

  async generateNewMaze(size) {
    try {
      const response = await fetch(
        `/.netlify/functions/generate-maze?size=${size}`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error('Erreur de génération du labyrinthe');
      }
    } catch (err) {
      console.error('Erreur de génération du labyrinthe:', err);
      throw err;
    }
  }
}
