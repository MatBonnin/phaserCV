import NPC from '../utils/Characters/NPC';
import Phaser from 'phaser';
import Player from '../utils/Characters/player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('scene-rick');
  }

  preload() {
    this.load.video({
      key: 'rick',
      url: ['assets/video/rick.mp4'],
      noAudio: false,
    });
    // Charger la carte et le tileset
    this.load.tilemapTiledJSON('rickmap', 'assets/map/rickmap.tmj');
    this.load.image('Inner', 'assets/spritesheet/Inner.png');
    // Charger les ressources pour le joueur et les NPCs
    this.load.spritesheet('npc', 'assets/spritesheet/NPC_test.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet('player', 'assets/spritesheet/player.png', {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    // Configuration de la carte
    const map = this.make.tilemap({ key: 'rickmap' });
    const tiles = map.addTilesetImage('Inner', 'Inner');
    const ground = map.createLayer('ground', tiles, 0, 0);
    this.physics.world.setBounds(0, 0, ground.width, ground.height);
    // Configuration du joueur
    this.player = new Player(this, 100, 100, 'player');
    this.player.sprite.setDepth(100);
    this.cursors = this.input.keyboard.createCursorKeys();
    // Configuration des NPCs
    this.setupNPCs();
    // Configuration et lecture de la vidéo
    this.setupVideo();
    // Ajouter la caméra pour suivre le joueur
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5);

    this.scale.resize(map.widthInPixels, map.heightInPixels);
  }

  update() {
    // Mettre à jour les éléments de la scène au besoin, notamment le déplacement du joueur
    this.player.update(this.cursors);
  }

  setupNPCs() {
    const startX = 50; // Position X initiale
    const startY = 50; // Position Y initiale
    const stepX = 20; // Pas en X
    const maxLineX = 300; // Limite en X avant de passer à la ligne suivante
    const stepY = 10; // Pas en Y après avoir atteint la limite X
    let x = startX;
    let y = startY;

    for (let i = 0; i < 350; i++) {
      if (i % 2 === 0) {
        let npc = new NPC(this, x, y, 'npc');
        npc.sprite.setDepth(100);
        npc.sprite.play('dance_animation'); // Assure-toi que l'animation 'dance_animation' est définie
        this.add.existing(npc);
      }

      // Incrémente X pour le prochain NPC
      x += stepX;
      // Si X dépasse la limite, réinitialise X et incrémente Y
      if (x > maxLineX) {
        x = startX;
        y += stepY;
      }
    }
  }

  setupVideo() {
    let video = this.add.video(100, 100, 'rick');
    video.play(true);
    video.setDisplaySize(200, 400);
    video.setVolume(1);
    video.on('complete', () => {
      console.log('Vidéo terminée');
      // Action après la fin de la vidéo
    });
  }
}
