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
    this.load.spritesheet(
      'floorTiles',
      'assets/spritesheet/atlas_floor-16x16.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet('objectTiles', 'assets/spritesheet/objects.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.spritesheet(
      'wallsHigh',
      'assets/spritesheet/atlas_walls_high-16x32.png',
      {
        frameWidth: 16,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      'wallsLow',
      'assets/spritesheet/atlas_walls_low-16x16.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.spritesheet(
      'enemies',
      'assets/spritesheet/0x72_DungeonTilesetII_v1.7.png',
      {
        frameWidth: 16,
        frameHeight: 16,
      }
    );
    this.load.tilemapTiledJSON('level1Map', 'assets/map/level1.tmj');
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });

    this.load.spritesheet('playerAttack', 'assets/player.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    // Charger le fichier audio si nécessaire

    this.load.audio('loseSound', 'assets/sound/Lose.mp3');
  }

  create() {
    this.wave = 0;
    const map = this.make.tilemap({ key: 'level1Map' });
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

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // Récupérer la position du joueur stockée
    const playerPosition = this.scene
      .get('scene-level1')
      .data.get('playerPosition');
    const startX = playerPosition ? playerPosition.x : 160;
    const startY = playerPosition ? playerPosition.y : 270;

    this.player = new Player(this, startX, startY, 'player');
    this.events.on('playerDied', this.onPlayerDeath, this);
    this.physics.add.collider(this.player.sprite, this.layers.mur);
    this.physics.add.collider(this.player.sprite, this.layers.decoration);
    this.physics.add.collider(this.player.sprite, this.layers.murLow);

    this.player.sprite.anims.play('up', true);

    this.physics.world.bounds.width = mapWidth;
    this.physics.world.bounds.height = mapHeight;

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.centerOn(mapWidth / 3, mapHeight / 3);
    this.cameras.main.startFollow(this.player.sprite);

    this.layers.ground.setDepth(0);
    this.layers.mur.setDepth(1);
    this.layers.decoration.setDepth(2);
    this.layers.flame.setDepth(4); // Lumiere a une profondeur fixe
    this.player.sprite.setDepth(3); // Joueur toujours derrière lumiere

    this.cursors = this.input.keyboard.createCursorKeys();

    // Créer des ennemis
    this.enemies = this.physics.add.group();

    // generateEnemies(this, 10, 50, 50, 5, 'enemy-walk', 424, 432);
    // Jouer la musique de fond si nécessaire
    this.backgroundMusic = this.sound.add('backgroundMusic');
    this.backgroundMusic.play({ loop: true, volume: 0.5 });

    this.healthText = this.add
      .text(0, 0, `Santé: ${this.player.getHealth()}`, {
        fontSize: '20px',
        fill: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(5);

    this.waveText = this.add
      .text(190, 0, `Manche : ${this.wave}`, {
        fontSize: '20px',
        fill: '#ffffff',
      })
      .setScrollFactor(0)
      .setDepth(5);

    this.loseSound = this.sound.add('loseSound');

    const temporaryText = this.add
      .text(
        20,
        200,
        'Bienvenue dans le jeu !\n Appuyer sur F pour attaquer.\n Bonne chance !!',
        {
          fontSize: '18px',
          fill: '#ffffff',
        }
      )
      .setScrollFactor(0)
      .setDepth(5);

    // Faire disparaître le texte après 5 secondes
    this.time.delayedCall(5000, () => {
      temporaryText.destroy();
    });
  }

  update() {
    this.player.update(this.cursors);

    this.enemies.children.iterate((enemy) => {
      enemy.getData('ref').update();
    });

    // Garder la profondeur fixe
    this.player.sprite.setDepth(3);

    // Gérer l'attaque du joueur
    if (this.player.isAttacking() && !this.attackHandled) {
      this.handlePlayerAttack();
      this.attackHandled = true;
      this.time.delayedCall(300, () => {
        this.attackHandled = false;
      });
    }

    this.healthText.setText(`Santé: ${this.player.getHealth()}`);

    if (this.enemies.getLength() === 0) {
      this.wave += 1;
      generateWaves(this.wave, this);
      this.physics.add.collider(this.enemies, this.layers.mur);
      this.physics.add.collider(this.enemies, this.layers.murLow);
      this.physics.add.collider(this.enemies, this.enemies);
      this.waveText.setText(`Manche : ${this.wave}`);
    }
  }

  handlePlayerAttack() {
    // Vérifiez quels ennemis se trouvent dans le rayon d'attaque du joueur
    this.enemies.children.iterate((enemy) => {
      console.log(enemy);
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

  onPlayerDeath() {
    // Afficher le message de mort
    this.add
      .text(170, 150, 'Vous êtes mort', {
        fontSize: '40px',
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
