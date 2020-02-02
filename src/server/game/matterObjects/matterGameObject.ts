export default class MatterGameObject {
  Matter: any
  body: any
  clientId: number | undefined = undefined
  dead = false
  prevDead = false
  angle = 0 // in DEG
  prevAngle = -1 // in DEG
  animation: string = 'idle'
  prevAnimation: string = 'idle'
  tint = 0x000000

  constructor(public scene: Phaser.Scene, public skin: number) {
    this.Matter = Phaser.Physics.Matter.Matter
  }

  protected addBody(body: any) {
    this.body = body
    this.body.prevVelocity = { x: 0, y: 0 }
    this.scene.matter.world.add(this.body)
  }

  protected addBodies(bodies: any[]) {
    this.body = this.Matter.Body.create({
      parts: bodies.map(body => body)
    })
    this.body.prevVelocity = { x: 0, y: 0 }
    this.scene.matter.world.add(this.body)
  }

  preUpdate(arg: any = undefined) {
    this.angle = Phaser.Math.RadToDeg(this.body.angle)
  }

  update(arg: any = undefined) {}

  postUpdate(arg: any = undefined) {
    if (this.dead && !this.prevDead) this.prevDead = true
    else if (!this.dead && this.prevDead) this.prevDead = false

    this.body.prevVelocity = { ...this.body.velocity }
    this.prevAngle = this.angle
    this.prevAnimation = this.animation
  }

  revive(x: number, y: number, clientId: number | undefined = undefined, socketId: string | undefined = undefined) {
    this.kill(false)
    this.Matter.Body.setPosition(this.body, { x, y })
  }

  kill(dead: boolean = true) {
    this.dead = dead
    if (dead) this.Matter.Body.setPosition(this.body, { x: -1000, y: -1000 })
    this.Matter.Sleeping.set(this.body, dead)
  }
}
