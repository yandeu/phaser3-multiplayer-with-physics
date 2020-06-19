import MatterGameObject from './matterGameObject'
import { SKINS } from '../../../constants'

export default class Box extends MatterGameObject {
  lifeTime: number

  constructor(public scene: Phaser.Scene, x: number, y: number) {
    super(scene, SKINS.BOX)

    this.addBody(
      this.Matter.Bodies.rectangle(x, y, 95, 95, {
        friction: 0.1,
        chamfer: { radius: 14 },
        label: 'box',
        density: 0.000125
      })
    )

    this.lifeTime = Phaser.Math.RND.integerInRange(1000 * 15, 1000 * 45)
    this.setTimer()
  }

  setTimer() {
    this.scene.time.addEvent({
      delay: this.lifeTime,
      callback: () => {
        this.kill()
      }
    })
  }

  revive(x: number, y: number) {
    super.revive(x, y)
    this.setTimer()
  }
}
