import { SKINS } from '../../constants'

export const createDudeAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  })

  scene.anims.create({
    key: 'idle',
    frames: [{ key: SKINS.DUDE.toString(), frame: 4 }],
    frameRate: 20
  })

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNumbers(SKINS.DUDE.toString(), { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  })
}

export const setDudeAnimation = (sprite: Phaser.GameObjects.Sprite, animation: string = 'idle') => {
  if (!sprite.anims.isPlaying) sprite.play(animation)
  else if (sprite.anims.isPlaying && sprite.anims.getName() !== animation) sprite.play(animation)
}

export const createMummyAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers(SKINS.MUMMY.toString(), {}),
    frameRate: 16,
    repeat: 7
  })
}

export const setMummyAnimation = (sprite: Phaser.GameObjects.Sprite, direction: string) => {
  if (!sprite.anims.isPlaying) sprite.anims.play('walk')
  let flipX = direction === 'left' ? true : false
  sprite.setFlipX(flipX)
}
