export const createDudeAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  scene.anims.create({
    key: 'idle',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  })

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })
}

export const setDudeAnimation = (sprite: Phaser.GameObjects.Sprite, animation: string = 'idle') => {
  if (!sprite.anims.isPlaying) sprite.play(animation)
  else if (sprite.anims.isPlaying && sprite.anims.getCurrentKey() !== animation) sprite.play(animation)
}

export const createMummyAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers('mummy', {}),
    frameRate: 16,
    repeat: 7
  })
}

export const setMummyAnimation = (sprite: Phaser.GameObjects.Sprite, direction: string) => {
  if (!sprite.anims.isPlaying) sprite.anims.play('walk')
  let flipX = direction === 'left' ? true : false
  sprite.setFlipX(flipX)
}
