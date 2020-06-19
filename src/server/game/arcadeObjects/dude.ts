import { SKINS } from '../../../constants'

export default class Dude extends Phaser.Physics.Arcade.Sprite {
  skin = SKINS.DUDE
  clientId: number
  socketId: string
  id: string
  private updates: any = {}
  private shouldUpdate = true
  prevPosition = {
    x: -1,
    y: -1
  }
  dead = false
  prevDead = false
  color: number = 0xffffff
  prevColor: number = 0xffffff
  animation: string | undefined = undefined
  hit = false

  constructor(scene: Phaser.Scene, id: number, options: { socketId: string; clientId: number }) {
    super(scene, 0, 0, '')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setFrame(0)

    this.socketId = options.socketId
    this.clientId = options.clientId

    this.setNewPosition()
    this.setCollideWorldBounds(true).setOrigin(0)

    // @ts-ignore
    this.body.setSize(32, 48)

    // matterJS uses an id per object, so I do the same here to be consistent
    // @ts-ignore
    this.id = id.toString()
  }

  setNewPosition() {
    this.setPosition(Phaser.Math.RND.integerInRange(0, 1000), Phaser.Math.RND.integerInRange(100, 300))
  }

  postUpdate() {
    this.prevPosition = { ...this.body.position }
    this.prevDead = this.dead
    this.prevColor = this.color
  }

  gotHit() {
    if (this.hit) return
    this.hit = true
    this.color = 0xff0000

    this.scene.time.addEvent({
      delay: 3500,
      callback: () => {
        this.hit = false
        this.color = 0xffffff
      }
    })
  }

  update() {
    if (!this.active) return
    if (!this.shouldUpdate) return
    this.shouldUpdate = false

    if (this.updates.left) this.setVelocityX(-400)
    else if (this.updates.right) this.setVelocityX(400)
    else this.setVelocityX(0)

    if (this.updates.up && this.body.blocked.down) this.setVelocityY(-600)

    this.animation = this.body.velocity.x >= 0.5 ? 'right' : this.body.velocity.x <= -0.5 ? 'left' : 'idle'

    this.updates = {}
  }

  revive(clientId: number, socketId: string) {
    this.setActive(true)
    this.dead = false
    this.setNewPosition()
    this.clientId = clientId
    this.socketId = socketId
  }

  kill() {
    this.setActive(false)
    this.dead = true
  }

  setUpdates(updates: any) {
    this.shouldUpdate = true
    this.updates = updates
  }
}
