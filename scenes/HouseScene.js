import Phaser from 'phaser';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('house-scene');
  }

  preload() {
    this.load.image('Inner', '/assets/Inner.png');
    this.load.image('objects', '/assets/objects.png');
    this.load.image('NPC_test', '/assets/NPC_test.png');
    this.load.tilemapTiledJSON('houseMap', '/assets/houseMap.tmj');
    this.load.spritesheet('player', '/assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'houseMap' });
    const tiles = map.addTilesetImage('Inner', 'Inner');
    const objects = map.addTilesetImage('objects', 'objects');
    const NPC = map.addTilesetImage('NPC_test', 'NPC_test');

    const exampleText = this.add
      .text(
        400,
        300,
        'vcddddddddddddddddddddddddddddddddddddddddddddddddddddddc',
        { fontSize: '6px', fill: '#ffffff' }
      )
      .setDepth(10);

    const groundLayer = map.createLayer('Ground', tiles, 0, 0);
    const shadowLayer = map.createLayer('shadow', tiles, 0, 0);
    const carpetLayer = map.createLayer('tapis', tiles, 0, 0);
    const furnitureLayer = map.createLayer('Meubles', tiles, 0, 0);
    const decorationLayer = map.createLayer('décoration', tiles, 0, 0);
    const doorLayer = map.createLayer('Door', tiles, 0, 0);
    const wallLayer = map.createLayer('Wall', tiles, 0, 0);
    const objectLayer = map.getObjectLayer('objects');

    const bulleLayout = map.createLayer('bulle', objects, 0, 0);
    const NPCLayout = map.createLayer('npc', NPC, 0, 0);

    this.player = this.physics.add.sprite(10, 10, 'player');
    this.player.setCollideWorldBounds(true);

    this.player.body.setSize(this.player.width / 1.2, this.player.height / 2);
    this.player.body.setOffset(1.2, this.player.height / 2);

    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, wallLayer);
    furnitureLayer.setCollisionBetween(1, 2000);
    wallLayer.setCollisionBetween(1, 2000);

    // Adjust camera bounds and center on the room
    this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
    this.cameras.main.centerOn(roomWidth / 2, roomHeight / 2);
    this.cameras.main.startFollow(this.player);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 52,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 18, end: 20 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { start: 35, end: 37 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.anims.play('up', true);
  }

  update() {
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(160);
      this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-160);
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(160);
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }

    this.player.setDepth(this.player.y);
  }
}
