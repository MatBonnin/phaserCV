// utils/animation/pieceAnimation.js
export function createPieceAnimation(scene) {
  scene.anims.create({
    key: 'piece-spin',
    frames: scene.anims.generateFrameNumbers('pieces', {
      start: 132,
      end: 135,
    }),
    frameRate: 6,
    repeat: -1,
  });
}
