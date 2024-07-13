import Phaser from 'phaser';

export default class HouseScene extends Phaser.Scene {
  constructor() {
    super('house-scene');
  }

  preload() {
    this.load.spritesheet('Inner', 'assets/Inner.png', {
      frameWidth: 16, // La largeur de chaque tuile dans votre spritesheet
      frameHeight: 16, // La hauteur de chaque tuile dans votre spritesheet
    });

    this.load.image('objects', '/assets/objects.png');
    this.load.image('NPC_test', '/assets/NPC_test.png');
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
    const objects = map.addTilesetImage('objects', 'objects');
    const NPC = map.addTilesetImage('NPC_test', 'NPC_test');

    const exampleText = this.add
      .text(370, 300, 'Bonjour', { fontSize: '12px', fill: '#000000' })
      .setDepth(10);

    const groundLayer = map.createLayer('Ground', tiles, 0, 0);
    const shadowLayer = map.createLayer('shadow', tiles, 0, 0);
    const carpetLayer = map.createLayer('tapis', tiles, 0, 0);
    const furnitureLayer = map.createLayer('Meubles', tiles, 0, 0);
    const decorationLayer = map.createLayer('décoration', tiles, 0, 0);
    const doorLayer = map.createLayer('Door', tiles, 0, 0);
    const wallLayer = map.createLayer('Wall', tiles, 0, 0);
    const chaiseLayer = map.createLayer('chaise', tiles, 0, 0);

    const bulleLayout = map.createLayer('bulle', objects, 0, 0);
    const NPCLayout = map.createLayer('npc', NPC, 0, 0);

    this.player = this.physics.add.sprite(400, 400, 'player');
    this.player.setCollideWorldBounds(true);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.player.body.setSize(this.player.width / 1.2, this.player.height / 2);
    this.player.body.setOffset(1.2, this.player.height / 2);

    this.physics.add.collider(this.player, furnitureLayer);
    this.physics.add.collider(this.player, wallLayer);
    furnitureLayer.setCollisionBetween(1, 2000);
    wallLayer.setCollisionBetween(1, 2000);

    const text = this.add.bitmapText(
      325,
      240,
      'minogram',
      'Le livre sur la table possede\nsurement des informations\nsur le propriétaire ! \n\n(appuie sur E pour le lire)',
      10
    );

    const doorPosition = { x: 405, y: 500 }; // Coordonnées de la porte
    this.door = this.physics.add.sprite(
      doorPosition.x,
      doorPosition.y,
      'Inner',
      241
    );
    this.door.body.setSize(16, 16); // Ajustez la taille de la zone de détection si nécessaire
    this.physics.add.overlap(
      this.player,
      this.door,
      this.exitHouse,
      null,
      this
    );

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    // Adjust camera bounds and center on the room
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
    this.cameras.main.startFollow(this.player);

    // Créer le livre en tant que sprite
    this.livre = this.physics.add.sprite(408, 345, 'Inner', 373);
    this.livre.setImmovable(true);
    this.livre.setAngle(-90);
    this.livre.body.setSize(16, 16);
    this.livre.body.setOffset(0, 0);

    this.physics.add.overlap(
      this.player,
      this.livre,
      this.handleOverlap,
      null,
      this
    );

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

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        this.livre.getBounds()
      ) &&
      this.keyE.isDown
    ) {
      this.openPDF();
    }

    this.player.setDepth(this.player.y);
  }

  handleOverlap(player, livre) {
    if (this.keyE.isDown) {
      this.openPDF();
    }
  }

  openPDF() {
    window.open('/pdf/CV.pdf', '_blank');
  }
  exitHouse(player, door) {
    // Change to the HouseScene when the player overlaps with the door
    this.scene.start('scene-game');
  }
}
