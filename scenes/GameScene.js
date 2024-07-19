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
    // Charger les assets existants
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

    this.load.spritesheet('pieces', 'assets/spritesheet/objects.png', {
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

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tileset', 'tiles');

    const layersConfig = [
      { name: 'ground', tileset: tiles },
      { name: 'Maison', tileset: tiles, collision: true },
      { name: 'habillage', tileset: tiles },
      { name: 'toit', tileset: tiles },
      { name: 'doors', tileset: tiles },
    ];

    this.layers = createLayers(map, layersConfig);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.scale.resize(900, 900);

    const playerPosition = this.scene
      .get('scene-game')
      .data.get('playerPosition');

    const startX = playerPosition ? playerPosition.x : 100;
    const startY = playerPosition ? playerPosition.y : 100;

    this.player = new Player(this, startX, startY, 'player');

    this.physics.add.collider(this.player.sprite, this.layers.Maison);

    const doorConfig = {
      x: 390,
      y: 285,
      texture: 'tiles',
      frame: 1322,
      width: 16,
      height: 16,
      callback: this.enterHouse.bind(this),
    };
    this.door = createSprite(this, doorConfig);

    const doorCaveConfig = {
      x: 55,
      y: 90,
      texture: 'tiles',
      frame: 250,
      width: 16,
      height: 16,
      callback: this.enterCave.bind(this),
    };

    this.doorCave = createSprite(this, doorCaveConfig);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5, -110, 20);

    this.cameras.main.setLerp(0.1, 0.1); // Lissage horizontal et vertical
    this.cameras.main.setDeadzone(50, 50); // Plus petite pour voir l'effet

    this.layers.ground.setDepth(0);
    this.layers.Maison.setDepth(0);
    this.layers.habillage.setDepth(3);
    this.layers.doors.setDepth(5);
    this.player.sprite.setDepth(6);

    createAnimations(this);
    createPieceAnimation(this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.acccueilMusic = this.sound.add('accueilMusic');
    this.acccueilMusic.play({ loop: true, volume: 0.5 });

    waterfallAnimattion(this);

    this.add
      .bitmapText(45, 65, 'minogram', `Game`, 10)

      .setDepth(5);

    this.add
      .bitmapText(378, 240, 'minogram', `Infos`, 10)

      .setDepth(5);

    createNPCAnimations(this);

    this.npc = new NPC(this, 400, 200, 'npc');

    // Créer les pièces et les ajouter à la carte
    this.pieces = this.physics.add.group();

    const piecePositions = [
      { x: 100, y: 150 },
      { x: 250, y: 100 },
      { x: 430, y: 300 },
    ];

    piecePositions.forEach((pos, index) => {
      const piece = new Piece(this, pos.x, pos.y, 'pieces', 'piece' + index);
      this.pieces.add(piece.sprite);
    });

    this.physics.add.overlap(
      this.player.sprite,
      this.pieces,
      this.collectPiece,
      null,
      this
    );

    // Récupérer le nombre de pièces collectées depuis les données de la scène
    this.piecesCollected =
      this.scene.get('scene-game').data.get('piecesCollected') || [];
    this.updateCanInteractWithStatue();

    this.pieces.children.entries.forEach((piece, index) => {
      if (this.piecesCollected[index] === piece.name) {
        piece.disableBody(true, true);
      }
    });
    this.interactKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    // Créer la statue en utilisant la nouvelle classe Statue
    this.statue = new Statue(this, 330, 120);
    this.physics.add.collider(this.player.sprite, this.statue);
  }

  collectPiece(player, piece) {
    piece.disableBody(true, true);
    this.piecesCollected.push(piece.name);
    this.scene
      .get('scene-game')
      .data.set('piecesCollected', this.piecesCollected); // Enregistrer le nombre de pièces collectées
    this.updateCanInteractWithStatue();
  }

  updateCanInteractWithStatue() {
    this.canInteractWithStatue = this.piecesCollected.length >= 3;
  }

  update(time, delta) {
    this.player.update(this.cursors);

    this.player.sprite.setDepth(this.player.sprite.y);

    if (this.player.sprite.y < this.layers.toit.y) {
      this.layers.toit.setDepth(this.player.sprite.depth - 1);
    } else {
      this.layers.toit.setDepth(this.player.sprite.depth + 1);
    }

    this.npc.update(time);

    if (
      this.canInteractWithStatue &&
      Phaser.Input.Keyboard.JustDown(this.interactKey)
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
