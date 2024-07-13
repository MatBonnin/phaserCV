import Phaser from 'phaser';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const speed = 500;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-game');
  }

  preload() {
    this.load.image('tiles', 'assets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.tmj');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const tiles = map.addTilesetImage('tileset', 'tiles');
    const groundLayer = map.createLayer('ground', tiles, 0, 0);
    const obstacleLayer = map.createLayer('Maison', tiles, 0, 0);
    this.statueLayer = map.createLayer('Statue', tiles, 0, 0);
    const habillageLayer = map.createLayer('habillage', tiles, 0, 0);
    this.roofLayer = map.createLayer('toit', tiles, 0, 0); // Nouvelle couche pour le toit
    const doorLayer = map.createLayer('doors', tiles, 0, 0); // Nouvelle couche pour les portes
    this.headStatueLayer = map.createLayer('headStatue', tiles, 0, 0); // Nouvelle couche pour la tête de la statue

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    function scaleLayers(layers) {
      layers.forEach((layer) => layer.setScale(1));
    }

    scaleLayers([
      groundLayer,
      obstacleLayer,
      this.statueLayer,
      habillageLayer,
      this.roofLayer,
      this.headStatueLayer,
      doorLayer,
    ]);

    obstacleLayer.setCollisionBetween(1, 2000);
    this.statueLayer.setCollisionBetween(1, 2000);
    // Ne pas configurer de collisions pour doorLayer

    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1);

    // Ajuster la hitbox du personnage pour ne prendre en compte que la partie inférieure
    this.player.body.setSize(this.player.width / 1.2, this.player.height / 2);
    this.player.body.setOffset(1.2, this.player.height / 2);

    this.physics.add.collider(this.player, obstacleLayer);
    this.physics.add.collider(this.player, this.statueLayer);

    // Ajoutez ceci pour configurer la zone de détection pour la porte
    const doorPosition = { x: 390, y: 285 }; // Coordonnées de la porte
    this.door = this.physics.add.sprite(doorPosition.x, doorPosition.y, null);
    this.door.body.setSize(16, 16); // Ajustez la taille de la zone de détection si nécessaire
    this.physics.add.overlap(
      this.player,
      this.door,
      this.enterHouse,
      null,
      this
    );

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.centerOn(mapWidth / 3, mapHeight / 3);
    this.cameras.main.startFollow(this.player);

    console.log(mapHeight);

    //camera

    // Configurer la profondeur pour gérer les superpositions
    groundLayer.setDepth(0);
    obstacleLayer.setDepth(1);
    this.statueLayer.setDepth(2);
    habillageLayer.setDepth(3);
    this.headStatueLayer.setDepth(4); // Profondeur de la tête de la statue
    this.roofLayer.setDepth(5);

    this.player.setDepth(6);

    // Créer les animations
    const animationSettings = [
      { key: 'left', start: 52, end: 54 },
      { key: 'right', start: 18, end: 20 },
      { key: 'up', start: 35, end: 37 },
      { key: 'down', start: 0, end: 2 },
    ];

    animationSettings.forEach(({ key, start, end }) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers('player', { start, end }),
        frameRate: 10,
        repeat: -1,
      });
    });

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play('right', true);
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-speed);
      this.player.anims.play('up', true);
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(speed);
      this.player.anims.play('down', true);
    } else {
      this.player.anims.stop();
    }

    // Ajuster la profondeur du joueur en fonction de sa position Y
    this.player.setDepth(this.player.y);

    // Ajuster la profondeur du toit pour gérer la superposition
    if (this.player.y < this.roofLayer.y) {
      this.roofLayer.setDepth(this.player.depth - 1);
    } else {
      this.roofLayer.setDepth(this.player.depth + 1);
    }

    // Ajuster la profondeur de la tête de la statue pour gérer la superposition
    if (this.player.y < this.headStatueLayer.y) {
      this.headStatueLayer.setDepth(this.player.depth - 1);
    } else {
      this.headStatueLayer.setDepth(this.player.depth + 1);
    }
  }

  enterHouse(player, door) {
    // Change to the HouseScene when the player overlaps with the door
    this.scene.start('house-scene');
  }
}
