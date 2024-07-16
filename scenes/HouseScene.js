import {
  createLayers,
  createSprite,
  setGameCanvasMargins,
} from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/player';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('house-scene');
  }

  preload() {
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

    this.load.bitmapFont(
      'minogram',
      'fonts/minogram_6x10.png',
      'fonts/minogram_6x10.xml'
    );
  }

  create() {
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

    const layers = createLayers(map, layersConfig);

    this.player = new Player(this, 400, 480, 'player');

    this.physics.add.collider(this.player.sprite, layers.Meubles);
    this.physics.add.collider(this.player.sprite, layers.Wall);
    this.player.sprite.anims.play('up', true);

    const doorConfig = {
      x: 405,
      y: 500,
      texture: 'Inner',
      frame: 241,
      width: 16,
      height: 16,
      callback: this.exitHouse.bind(this),
    };
    this.door = createSprite(this, doorConfig);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
    this.cameras.main.startFollow(this.player.sprite);

    const bookConfig = {
      x: 408,
      y: 345,
      texture: 'Inner',
      frame: 373,
      width: 16,
      height: 16,
      callback: this.handleOverlap.bind(this),
    };
    this.livre = createSprite(this, bookConfig);
    this.livre.setImmovable(true);
    this.livre.setAngle(-90);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.add.bitmapText(
      325,
      240,
      'minogram',
      'Le livre sur la table possede\nsurement des informations\nsur le propriétaire ! \n\n(appuie sur E pour le lire)',
      10
    );

    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    setGameCanvasMargins('0%', '25%');
  }

  update() {
    this.player.update(this.cursors);
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.sprite.getBounds(),
        this.livre.getBounds()
      ) &&
      this.keyE.isDown
    ) {
      this.openPDF();
    }
    this.player.sprite.setDepth(this.player.sprite.y);
  }

  handleOverlap(player, livre) {
    if (this.keyE.isDown) {
      this.openPDF();
    }
  }

  openPDF() {
    window.open('/pdf/CV.pdf', '_blank');
  }

  exitHouse() {
    // Récupérer la position du joueur stockée
    let playerPosition = this.scene
      .get('scene-game')
      .data.get('playerPosition');
    if (playerPosition) {
      this.scene.get('scene-game').data.set('playerPosition', playerPosition);
    }

    this.scene.start('scene-game');
  }
}
