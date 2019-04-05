import MatterGameObject from './matterGameObject'
import { SKINS } from '../../../constants'

export default class Dude extends MatterGameObject {
  maxVelocity = {
    x: 6,
    y: 12
  }
  width = 32
  height = 48

  shouldUpdate = true

  sensors: any
  mainBody: any
  translateX = 0
  translateY = 0

  jumpLocked = false

  move = {
    leftAllowed: true,
    rightAllowed: true
  }
  touching = {
    left: false,
    right: false,
    bottom: false
  }
  updates: any = {}

  constructor(scene: Phaser.Scene, x: number, y: number, public clientId: number, public socketId: string) {
    super(scene, SKINS.DUDE)

    let h = this.height
    let w = this.width - 4

    console.log('clientId', clientId)

    this.mainBody = this.Matter.Bodies.rectangle(x, y, w, h, {
      density: 0.001,
      friction: 0.1,
      frictionStatic: 0.1,
      label: 'dude',
      chamfer: { radius: 10 }
    })
    this.sensors = {
      bottom: this.Matter.Bodies.rectangle(x, y + h / 2 + 2 / 2, w * 0.35, 4, {
        isSensor: true
      }),
      left: this.Matter.Bodies.rectangle(x - w / 2 - 4 / 2, y + 0, 4, h * 0.9, {
        isSensor: true
      }),
      right: this.Matter.Bodies.rectangle(x + w / 2 + 4 / 2, y + 0, 4, h * 0.9, {
        isSensor: true
      })
    }
    this.addBodies([this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right])

    this.setSensorLabel()

    this.Matter.Body.setInertia(this.body, Infinity) // setFixedRotation
  }

  setTranslate(x: number, y: number = 0) {
    this.translateX = x
    this.translateY = y
  }

  translate() {
    if (this.translateX !== 0 || this.translateY !== 0) {
      this.Matter.Body.setPosition(this.body, {
        x: this.body.position.x + this.translateX,
        y: this.body.position.y + this.translateY
      })
      this.translateX = 0
      this.translateY = 0
    }
  }

  setSensorLabel() {
    this.sensors.bottom.label = `dudeBottomSensor_${this.clientId}`
    this.sensors.left.label = `dudeLeftSensor_${this.clientId}`
    this.sensors.right.label = `dudeRightSensor_${this.clientId}`
  }

  revive(x: number, y: number, clientId: number, socketId: string) {
    super.revive(x, y)
    this.clientId = clientId
    this.socketId = socketId
    this.setSensorLabel()
  }

  lockJump() {
    this.jumpLocked = true
    this.scene.time.addEvent({
      delay: 250,
      callback: () => (this.jumpLocked = false)
    })
  }

  setUpdates(updates: any) {
    this.shouldUpdate = true
    this.updates = updates
  }

  update(force = false) {
    this.animation = 'idle'

    if (!force && !this.shouldUpdate) return

    const updates = this.updates

    let x = updates.left && this.move.leftAllowed ? -0.01 : updates.right && this.move.rightAllowed ? 0.01 : 0
    let y = !this.jumpLocked && updates.up && this.touching.bottom ? -this.maxVelocity.y : 0
    if (y !== 0) this.lockJump()

    // We use setVelocity to jump and applyForce to move right and left

    // Jump
    if (y !== 0) this.Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y })

    // Move
    this.Matter.Body.applyForce(this.body, { x: 0, y: 0 }, { x, y: 0 })

    // check max velocity
    let maxVelocityX =
      this.body.velocity.x > this.maxVelocity.x ? 1 : this.body.velocity.x < -this.maxVelocity.x ? -1 : null
    if (maxVelocityX)
      this.Matter.Body.setVelocity(this.body, { x: this.maxVelocity.x * maxVelocityX, y: this.body.velocity.y })

    // set velocity X to zero
    if (!updates.left && !updates.right) {
      this.Matter.Body.setVelocity(this.body, { x: this.body.velocity.x * 0.5, y: this.body.velocity.y })
    }

    this.animation = this.body.velocity.x >= 0.5 ? 'right' : this.body.velocity.x <= -0.5 ? 'left' : 'idle'

    this.translate()

    this.touching = {
      left: false,
      right: false,
      bottom: false
    }
    this.move = {
      leftAllowed: true,
      rightAllowed: true
    }
    this.updates = {}
    this.shouldUpdate = false
  }
}
