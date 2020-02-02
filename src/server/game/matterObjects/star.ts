import MatterGameObject from './matterGameObject'
import { SKINS } from '../../../constants'

export default class Star extends MatterGameObject {
  scale: number = 1

  constructor(
    public scene: Phaser.Scene,
    public x: number,
    public y: number,
    public category: string | undefined = undefined
  ) {
    super(scene, SKINS.STAR)

    if (category === 'big') {
      this.tint = 0xff7200
      this.scale = 3
    }
    if (category === 'medium') {
      this.scale = 2
    }

    this.addBody(
      this.Matter.Bodies.rectangle(x, y, 24 * this.scale, 22 * this.scale, {
        chamfer: { radius: 14 },
        label: 'star',
        isStatic: true,
        isSensor: true
      })
    )
  }

  setReviveTimer() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        super.revive(this.x, this.y)
      }
    })
  }

  kill(dead: boolean = true) {
    this.dead = dead
    if (dead) this.Matter.Body.setPosition(this.body, { x: -1000, y: -1000 })
    this.Matter.Sleeping.set(this.body, dead)
  }
}
