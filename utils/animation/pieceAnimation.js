// utils/animation/pieceAnimation.js
export function createPieceAnimation(scene, texture) {
  scene.anims.create({
    key: 'piece-spin',
    frames: scene.anims.generateFrameNumbers(texture, {
      start: 132,
      end: 135,
    }),
    frameRate: 6,
    repeat: -1,
  });
}
