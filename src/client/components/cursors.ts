export default class Cursors {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys

  none = true
  prevNone = true

  left = false
  right = false
  up = false

  constructor(public scene: Phaser.Scene, public socket: SocketIOClient.Socket) {
    this.cursors = scene.input.keyboard.createCursorKeys()

    this.scene.events.on('update', this.update, this)
  }

  cursorsDown() {
    return { left: this.left, right: this.right, up: this.up, none: this.none }
  }

  update() {
    if (!this.cursors.left || !this.cursors.right || !this.cursors.up) return

    this.none = this.cursors.left.isDown || this.cursors.right.isDown || this.cursors.up.isDown ? false : true

    if (!this.none || this.none !== this.prevNone) {
      this.left = false
      this.right = false
      this.up = false

      if (this.cursors.left.isDown) {
        this.left = true
      } else if (this.cursors.right.isDown) {
        this.right = true
      }

      if (this.cursors.up.isDown) {
        this.up = true
      }

      if (!PHYSICS_DEBUG) {
        let total = 0
        if (this.left) total += 1
        if (this.right) total += 2
        if (this.up) total += 4
        if (this.none) total += 8
        this.socket.emit('U' /* short for updateDude */, total)
      }
    }

    this.prevNone = this.none
  }
}
