import { SKINS } from '../../../constants'

export default class Mummy extends Phaser.Physics.Arcade.Sprite {
  skin = SKINS.MUMMY
  id: string
  direction: 'left' | 'right'
  dead: boolean = false

  constructor(scene: Phaser.Scene, id: number, x: number, y: number) {
    super(scene, x, y, '')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setFrame(0)

    this.direction = Math.random() > 0.5 ? 'left' : 'right'

    // @ts-ignore
    this.body.setSize(37, 45)

    this.id = id.toString()
  }

  kill() {
    if (this.dead) return
    this.dead = true
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => (this.dead = false)
    })
  }

  getLookAhead() {
    let x = this.direction === 'right' ? this.body.right + 5 : this.body.left - 5
    let y = this.body.bottom + 10
    return { x, y }
  }

  changeDirection(tile: { tile: string; x: number; y: number }) {
    if (tile.tile !== 'X') {
      this.direction = this.direction === 'right' ? 'left' : 'right'
    }
  }

  move() {
    let velocity = this.direction === 'right' ? 35 : -35
    if (this.dead) velocity = 0
    this.setVelocityX(velocity)
  }

  update() {
    this.move()
  }
}
