import { SKINS } from '../../../constants'

export default class Star extends Phaser.Physics.Arcade.Sprite {
  skin = SKINS.STAR
  id: string
  sync = true
  tint = 0x00ff00

  constructor(scene: Phaser.Scene, id: number, x: number, y: number) {
    super(scene, x, y, '')
    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    // @ts-ignore
    this.body.setSize(24, 22, false)

    this.id = id.toString()
  }
}
