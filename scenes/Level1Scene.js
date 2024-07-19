import {
  createLayers,
  createSprite,
  generateEnemies,
  generateWaves,
} from '../utils/utils';

import Phaser from 'phaser';
import Player from '../utils/Characters/player';

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super('scene-level1');
  }

  preload() {
    this.loadResources();
  }

  create() {
    this.initializeVariables();
    this.setupMap();
    this.setupPlayer();
    this.handleCollisions();
    this.setupCamera();

    this.setupDepth();
    // generateEnemies(this, 10, 50, 50, 5, 'enemy-walk', 424, 432);
    // Jouer la musique de fond si nécessaire
    this.setupUI();
    // Faire disparaître le texte après 5 secondes
  }

  update() {
    this.player.update(this.cursors);

    this.updateEnemies();

    this.managePlayerAttack();

    this.manageWaves();

    this.healthText.setText(`Santé: ${this.player.getHealth()}`);
  }

  updateEnemies() {
    this.enemies.children.iterate((enemy) => {
      enemy.getData('ref').update();
    });
  }
  managePlayerAttack() {
    if (this.player.isAttacking() && !this.attackHandled) {
      this.handlePlayerAttack();
      this.attackHandled = true;
      this.time.delayedCall(300, () => {
        this.attackHandled = false;
      });
    }
  }
  manageWaves() {
    if (this.enemies.getLength() === 0) {
      this.wave += 1;
      generateWaves(this.wave, this);
      this.physics.add.collider(this.enemies, this.layers.mur);
    }
  }
  setupDepth() {
    this.layers.ground.setDepth(0);
    this.layers.mur.setDepth(1);
    this.layers.decoration.setDepth(2);
    this.layers.flame.setDepth(4); // Lumiere a une profondeur fixe
    this.player.sprite.setDepth(3); // Joueur toujours derrière lumiere
  }
  setupCamera() {
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1, -50, 20);
    this.cameras.main.setLerp(0.1, 0.1); // Lissage horizontal et vertical
    this.cameras.main.setDeadzone(50, 50); // Zone non suivie au centre de la caméra
    this.cameras.main.setViewport(0, 0, 500, 300);
  }

  initializeVariables() {
    this.wave = 0;
    this.enemies = this.physics.add.group();
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  setupMap() {
    const map = this.make.tilemap({ key: 'level1Map' });

    this.mapWidth = map.widthInPixels;
    this.mapHeight = map.heightInPixels;
    const floorTiles = map.addTilesetImage('atlas_floor-16x16', 'floorTiles');
    const wallsHigh = map.addTilesetImage(
      'atlas_walls_high-16x32',
      'wallsHigh'
    );
    const wallsLow = map.addTilesetImage('atlas_walls_low-16x16', 'wallsLow');

    const layersConfig = [
      { name: 'ground', tileset: floorTiles },
      { name: 'mur', tileset: wallsHigh, collision: true },
      { name: 'murLow', tileset: wallsLow, collision: true },
      { name: 'decoration', tileset: floorTiles },
      { name: 'flame', tileset: wallsHigh },
    ];

    this.layers = createLayers(map, layersConfig);

    this.scale.resize(this.mapWidth, this.mapHeight);

    this.physics.world.bounds.width = this.mapWidth;
    this.physics.world.bounds.height = this.mapHeight;
    this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
  }

  setupUI() {
    const { width } = this.cameras.main;
    this.healthText = this.createText(
      10,
      this.cameras.main.displayHeight,
      `Santé: ${this.player.getHealth()}`,
      20
    );
    this.waveText = this.createText(
      180,
      this.cameras.main.displayHeight,
      `Manche : ${this.wave}`,
      width / 25
    );

    const temporaryText = this.add
      .text(20, 80, `Appuyer sur F pour attaquer.\n     Bonne chance !!`, {
        fontSize: '18px',
        fill: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(5);

    this.time.delayedCall(5000, () => {
      temporaryText.destroy();
    });

    this.backgroundMusic = this.sound.add('backgroundMusic');
    this.backgroundMusic.play({ loop: true, volume: 0.5 });
  }

  setupPlayer() {
    // Récupérer la position du joueur stockée
    const playerPosition = this.scene
      .get('scene-level1')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 160;
    const startY = playerPosition ? playerPosition.y : 270;

    this.player = new Player(this, startX, startY, 'player');
    this.events.on('playerDied', this.onPlayerDeath, this);
    this.player.sprite.anims.play('up', true);
  }

  handleCollisions() {
    this.physics.add.collider(this.player.sprite, this.layers.mur);
    this.physics.add.collider(this.player.sprite, this.layers.decoration);
    this.physics.add.collider(this.player.sprite, this.layers.murLow);
  }
  loadResources() {
    // Charger les tiles et autres ressources
    const resources = [
      ['floorTiles', 'assets/spritesheet/atlas_floor-16x16.png', 16, 16],
      ['objectTiles', 'assets/spritesheet/objects.png', 16, 16],
      ['wallsHigh', 'assets/spritesheet/atlas_walls_high-16x32.png', 16, 32],
      ['wallsLow', 'assets/spritesheet/atlas_walls_low-16x16.png', 16, 16],
      ['enemies', 'assets/spritesheet/0x72_DungeonTilesetII_v1.7.png', 16, 16],
      ['player', 'assets/player.png', 16, 32],
      ['playerAttack', 'assets/player.png', 32, 32],
    ];
    resources.forEach(([key, path, width, height]) => {
      this.load.spritesheet(key, path, {
        frameWidth: width,
        frameHeight: height,
      });
    });

    this.load.tilemapTiledJSON('level1Map', 'assets/map/level1.tmj');
    this.load.audio('loseSound', 'assets/sound/Lose.mp3');
    this.loseSound = this.sound.add('loseSound');
    // Charger d'autres ressources audio si nécessaire
  }
  handlePlayerAttack() {
    // Vérifiez quels ennemis se trouvent dans le rayon d'attaque du joueur
    this.enemies.children.iterate((enemy) => {
      if (enemy) {
        const distance = Phaser.Math.Distance.Between(
          this.player.sprite.x,
          this.player.sprite.y,
          enemy.x,
          enemy.y
        );

        if (distance < 20) {
          // Ajustez ce rayon d'attaque selon vos besoins
          const attackPower = this.player.getAttackPower();
          enemy.getData('ref').takeDamage(attackPower);
        }
      }
    });
  }

  exitLevel() {
    // Sauvegarder la position du joueur
    const playerPosition = { x: this.player.sprite.x, y: this.player.sprite.y };
    this.scene.get('scene-level1').data.set('playerPosition', playerPosition);

    // Changer de scène, par exemple retour à GameScene
    this.scene.start('scene-game');
  }
  createText(x, y, text, fontSize) {
    return this.add
      .text(x, y, text, {
        fontSize: `${fontSize}px`,
        fill: '#ffffff',
        align: 'left',
      })
      .setScrollFactor(0)
      .setDepth(5)
      .setOrigin(0, 1);
  }
  onPlayerDeath() {
    // Afficher le message de mort
    this.add
      .text(150, 150, 'Vous êtes mort', {
        fontSize: '20px',
        fill: '#ff0000',
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.loseSound.play();

    // Attendre 5 secondes avant de relancer
    this.time.delayedCall(5000, () => {
      this.scene.start('scene-game');
    });

    // Pour éviter toute autre interaction ou mise à jour
    this.physics.pause();

    this.backgroundMusic.stop();
  }
}
