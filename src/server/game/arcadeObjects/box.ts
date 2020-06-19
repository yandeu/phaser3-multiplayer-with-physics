import { SKINS } from '../../../constants'

export default class Box extends Phaser.Physics.Arcade.Sprite {
  skin = SKINS.BOX
  id: string
  sync = true

  constructor(scene: Phaser.Scene, id: number, x: number, y: number) {
    super(scene, x, y, '')
    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    // @ts-ignore
    this.body
      .setSize(95, 95)
      // 32 is the default width an height for an sprite if the texture can not be loaded
      .setOffset(-32, -32)

    this.id = id.toString()
  }
}
