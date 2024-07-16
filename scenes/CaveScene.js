import {
  createLayers,
  createSprite,
  setGameCanvasMargins,
} from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/player';

export default class CaveScene extends Phaser.Scene {
  constructor() {
    super('scene-cave');
  }

  preload() {
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

  create() {
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

    // Récupérer la position du joueur stockée
    const playerPosition = this.scene
      .get('scene-cave')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 120;
    const startY = playerPosition ? playerPosition.y : 200;

    this.player = new Player(this, startX, startY, 'player');

    this.physics.add.collider(this.player.sprite, this.layers.decore);
    this.player.sprite.anims.play('up', true);

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
    this.exit = createSprite(this, holeConfig);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 3, mapHeight / 3);
    this.cameras.main.startFollow(this.player.sprite);

    this.layers.ground.setDepth(0);
    this.layers.trou.setDepth(1);
    this.layers.decore.setDepth(2);
    this.layers.lumiere.setDepth(5); // Lumiere a une profondeur fixe
    this.layers.headStatue.setDepth(4);
    this.player.sprite.setDepth(3); // Joueur toujours derrière lumiere

    this.cursors = this.input.keyboard.createCursorKeys();

    setGameCanvasMargins('45%', '35%');
  }

  update() {
    this.player.update(this.cursors);

    // Garder la profondeur fixe
    this.player.sprite.setDepth(3);
  }

  exitCave() {
    // Sauvegarder la position du joueur
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-cave').data.set('playerPosition', playerPosition);

    // Changer de scène, par exemple retour à GameScene
    this.scene.start('scene-game');
  }
  enterHole() {
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-cave').data.set('playerPosition', playerPosition);

    // Changer de scène, par exemple retour à GameScene
    this.scene.start('scene-level1');
  }
}
