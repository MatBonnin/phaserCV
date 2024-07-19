// utils/animation/pieceAnimation.js
export function createBulleAnimation(scene, texture) {
  scene.anims.create({
    key: 'bulle-anim',
    frames: [
      { key: texture, frame: 200 },
      { key: texture, frame: 233 },
      { key: texture, frame: 234 },
      { key: texture, frame: 267 },
      { key: texture, frame: 267 },
    ],
    frameRate: 2,
    repeat: -1,
  });
}
