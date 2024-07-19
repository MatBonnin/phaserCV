import { createLayers, createSprite } from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/Characters/player';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('house-scene');
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
    this.setupDoors();
    this.setupUI();
    this.setupInteractiveElements();
  }

  update() {
    this.player.update(this.cursors);
    this.checkBookInteraction();
    this.checkParchmentInteraction();
  }

  loadResources() {
    this.load.spritesheet('Inner', 'assets/spritesheet/Inner.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('objects', '/assets/spritesheet/objects.png');
    this.load.image('NPC_test', '/assets/spritesheet/NPC_test.png');
    this.load.tilemapTiledJSON('houseMap', '/assets/houseMap.tmj');
    this.load.spritesheet('player', '/assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.image('parchemin', 'assets/images/parchemin.png');
    this.load.bitmapFont(
      'minogram',
      'fonts/minogram_6x10.png',
      'fonts/minogram_6x10.xml'
    );
  }

  initializeVariables() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  setupMap() {
    const map = this.make.tilemap({ key: 'houseMap' });
    const tiles = map.addTilesetImage('Inner', 'Inner');
    const NPC = map.addTilesetImage('NPC_test', 'NPC_test');

    const layersConfig = [
      { name: 'Ground', tileset: tiles },
      { name: 'shadow', tileset: tiles },
      { name: 'tapis', tileset: tiles },
      { name: 'Meubles', tileset: tiles, collision: true },
      { name: 'décoration', tileset: tiles },
      { name: 'Door', tileset: tiles },
      { name: 'Wall', tileset: tiles, collision: true },
      { name: 'chaise', tileset: tiles },
      { name: 'npc', tileset: NPC },
    ];

    this.layers = createLayers(map, layersConfig);
    this.scale.resize(map.widthInPixels, map.heightInPixels);
  }

  setupPlayer() {
    this.player = new Player(this, 180, 225, 'player');
    this.player.sprite.anims.play('up', true);
  }

  setupCollisions() {
    this.physics.add.collider(this.player.sprite, this.layers.Meubles);
    this.physics.add.collider(this.player.sprite, this.layers.Wall);
  }

  setupCamera() {
    const mapWidth = this.layers.Ground.width;
    const mapHeight = this.layers.Ground.height;
    this.cameras.main.centerOn(mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1, 0, 40);
    this.cameras.main.setDeadzone(10, 10);
  }

  setupDoors() {
    const doorConfig = {
      x: 174,
      y: 248,
      texture: 'Inner',
      frame: 241,
      width: 16,
      height: 16,
      callback: this.exitHouse.bind(this),
    };
    this.door = createSprite(this, doorConfig);
  }

  setupUI() {
    this.add.bitmapText(
      90,
      5,
      'minogram',
      'Le livre sur la table possede\nsurement des informations\nsur le propriétaire ! \n\n(appuie sur E pour le lire)',
      10
    );

    this.parcheminText = this.add.bitmapText(
      10,
      10,
      'minogram',
      `Quand trois fragments anciens seront réunis,\n le gardien de pierre cédera à ta volonté.\n Trouve-les, approche,\n et active le mystère avec 'E'.`,
      10
    );
    this.parcheminText.setVisible(false);
    this.parcheminText.setDepth(11);
  }

  setupInteractiveElements() {
    const bookConfig = {
      x: 184,
      y: 105,
      texture: 'Inner',
      frame: 373,
      width: 16,
      height: 16,
      callback: this.handleOverlap.bind(this),
    };
    this.livre = createSprite(this, bookConfig);
    this.livre.setImmovable(true);
    this.livre.setAngle(-90);

    const parchmentConfig = {
      x: 250,
      y: 250,
      texture: 'Inner',
      frame: 1322,
    };
    this.parchemin = createSprite(this, parchmentConfig);
    this.parchemin.setInteractive();
    this.parchemin.setDepth(2);
  }

  checkBookInteraction() {
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.sprite.getBounds(),
        this.livre.getBounds()
      ) &&
      this.keyE.isDown
    ) {
      this.openPDF();
    }
  }

  checkParchmentInteraction() {
    this.input.keyboard.on(
      'keydown-E',
      () => {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            this.player.sprite.getBounds(),
            this.parchemin.getBounds()
          )
        ) {
          this.showParchmentImage();
        }
      },
      this
    );
  }

  handleOverlap(player, livre) {
    if (this.keyE.isDown) {
      this.openPDF();
    }
  }

  showParchmentImage() {
    this.parchmentImage = this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, 'parchemin')
      .setDepth(10);
    this.parcheminText.setVisible(true);
    this.parchmentImage.setDisplaySize(200, 300);
    this.input.keyboard.on('keydown', this.hideParchmentImage, this);
  }

  hideParchmentImage() {
    this.parchmentImage.destroy();
    this.input.keyboard.off('keydown', this.hideParchmentImage, this);
  }

  openPDF() {
    window.open('/pdf/CV.pdf', '_blank');
  }

  exitHouse() {
    this.scene.start('scene-game');
  }
}
