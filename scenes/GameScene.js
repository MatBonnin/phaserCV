import { createAnimations, createLayers, createSprite } from '../utils/utils';

import NPC from '../utils/Characters/NPC';
import Phaser from 'phaser';
import Piece from '../utils/objects/Piece';
import Player from '../utils/Characters/player';
import Statue from '../utils/objects/Statue';
import { createNPCAnimations } from '../utils/animation/NPCAnimations';
import { createPieceAnimation } from '../utils/animation/pieceAnimation';
import { waterfallAnimattion } from '../utils/animation/waterfallAnimation';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
  }

  preload() {
    this.loadResources();
  }

  create() {
    this.initializeVariables();
    this.setupMap();
    this.setupPlayer();
    this.setupNPC();
    this.setupDoors();
    this.setupCollisions();
    this.setupCamera();
    this.setupDepth();
    this.setupUI();

    this.setupAnimations();
    this.setupPieces();
    this.setupStatue();

    this.setupMusic();
  }

  update(time, delta) {
    this.player.update(this.cursors);
    this.updateDepth();
    this.npc.update(time);
    this.checkStatueInteraction();

    // if (
    //   this.player.sprite.x > this.map.widthInPixels - 200 &&
    //   this.cursors.right.isDown
    // ) {
    //   this.cameras.main.stopFollow(this.player.sprite);
    // } else {
    //   this.cameras.main.startFollow(this.player.sprite);
    // }
  }

  loadResources() {
    this.load.spritesheet('tiles', 'assets/spritesheet/tileset.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.tilemapTiledJSON('map', 'assets/map/map.tmj');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('playerAttack', 'assets/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('npc', 'assets/spritesheet/NPC_test.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('objects', 'assets/spritesheet/objects.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.bitmapFont(
      'minogram',
      'fonts/minogram_6x10.png',
      'fonts/minogram_6x10.xml'
    );
    this.load.audio('backgroundMusic', 'assets/sound/epique.mp3');
    this.load.audio('accueilMusic', 'assets/sound/Monkey.mp3');
    this.load.audio('loseSound', 'assets/sound/Lose.mp3');
  }

  initializeVariables() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.piecesCollected =
      this.scene.get('scene-game').data.get('piecesCollected') || [];
  }

  setupMap() {
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('tileset', 'tiles');
    const layersConfig = [
      { name: 'ground', tileset: tiles },
      { name: 'Maison', tileset: tiles, collision: true },
      { name: 'habillage', tileset: tiles },
      { name: 'toit', tileset: tiles },
      { name: 'doors', tileset: tiles },
    ];
    this.layers = createLayers(this.map, layersConfig);
    this.scale.resize(this.map.widthInPixels, this.map.heightInPixels);
  }

  setupPlayer() {
    const playerPosition = this.scene
      .get('scene-game')
      .data.get('playerPosition');

    const startX = playerPosition ? playerPosition.x : 289;
    const startY = playerPosition ? playerPosition.y : 366;
    this.player = new Player(this, startX, startY, 'player');
  }

  setupDoors() {
    const doorConfig = {
      x: 630,
      y: 515,
      texture: 'tiles',
      frame: 1322,
      width: 16,
      height: 16,
      callback: this.enterHouse.bind(this),
    };
    this.door = createSprite(this, doorConfig);

    const doorCaveConfig = {
      x: 292,
      y: 312,
      texture: 'tiles',
      frame: 250,
      width: 16,
      height: 16,
      callback: this.enterCave.bind(this),
    };
    this.doorCave = createSprite(this, doorCaveConfig);
  }

  setupCollisions() {
    this.physics.add.collider(this.player.sprite, this.layers.Maison);
    this.physics.world.setBounds(
      0,
      0,
      this.layers.ground.width,
      this.layers.ground.height
    );
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5, -150, 20);
    this.cameras.main.setLerp(0.1, 0.1);
    this.cameras.main.setDeadzone(50, 50);
  }

  setupDepth() {
    this.layers.ground.setDepth(0);
    this.layers.Maison.setDepth(0);
    this.layers.habillage.setDepth(3);
    this.layers.doors.setDepth(5);
    this.player.sprite.setDepth(6);
    this.npc.sprite.setDepth(6);
  }

  setupUI() {
    this.add.bitmapText(285, 290, 'minogram', `Game`, 10).setDepth(5);
    this.add.bitmapText(620, 470, 'minogram', `Infos`, 10).setDepth(5);
  }

  setupNPC() {
    createNPCAnimations(this);
    this.npc = new NPC(this, 400, 400, 'npc');
  }

  setupPieces() {
    this.pieces = this.physics.add.group();
    const piecePositions = [
      { x: 337, y: 381 },
      { x: 511, y: 462 },
      { x: 686, y: 517 },
    ];
    piecePositions.forEach((pos, index) => {
      const piece = new Piece(this, pos.x, pos.y, 'objects', 'piece' + index);
      this.pieces.add(piece.sprite);
    });
    this.physics.add.overlap(
      this.player.sprite,
      this.pieces,
      this.collectPiece,
      null,
      this
    );
    this.updateCollectedPieces();
  }

  setupStatue() {
    this.statue = new Statue(this, 569, 345);
    this.physics.add.collider(this.player.sprite, this.statue);
    this.physics.add.collider(this.npc.sprite, this.statue);
  }

  setupAnimations() {
    createAnimations(this);
    createPieceAnimation(this, 'objects');
    waterfallAnimattion(this);
  }

  setupMusic() {
    this.acccueilMusic = this.sound.add('accueilMusic');
    this.acccueilMusic.play({ loop: true, volume: 0.5 });
  }

  collectPiece(player, piece) {
    piece.disableBody(true, true);
    this.piecesCollected.push(piece.name);
    this.scene
      .get('scene-game')
      .data.set('piecesCollected', this.piecesCollected);
    this.updateCanInteractWithStatue();
  }

  updateCollectedPieces() {
    this.pieces.children.entries.forEach((piece, index) => {
      if (this.piecesCollected.includes(piece.name)) {
        piece.disableBody(true, true);
      }
    });
  }

  updateCanInteractWithStatue() {
    this.canInteractWithStatue = this.piecesCollected.length >= 3;
  }

  updateDepth() {
    this.player.sprite.setDepth(this.player.sprite.y);
    if (this.player.sprite.y < this.layers.toit.y) {
      this.layers.toit.setDepth(this.player.sprite.depth - 1);
    } else {
      this.layers.toit.setDepth(this.player.sprite.depth + 1);
    }
  }

  checkStatueInteraction() {
    if (
      this.canInteractWithStatue &&
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      )
    ) {
      const distance = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.statue.x,
        this.statue.y
      );
      if (distance < 50 && this.isFacingStatue()) {
        this.statue.moveLeft(27);
      }
    }
  }

  isFacingStatue() {
    const player = this.player.sprite;
    const statue = this.statue;
    const facingStatue =
      (this.player.direction === 'up' && player.y > statue.y + statue.height) ||
      (this.player.direction === 'down' && player.y < statue.y) ||
      (this.player.direction === 'left' &&
        player.x > statue.x + statue.width) ||
      (this.player.direction === 'right' && player.x < statue.x);
    return facingStatue;
  }

  enterHouse() {
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };

    this.scene.get('scene-game').data.set('playerPosition', playerPosition);

    this.acccueilMusic.stop();
    this.scene.start('house-scene');
  }

  enterCave() {
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-game').data.set('playerPosition', playerPosition);
    this.acccueilMusic.stop();
    this.scene.start('scene-cave');
  }
}
