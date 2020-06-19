import { MAX_PLAYERS_PER_ROOM } from '../../constants'

const texts = [
  {
    y: 230,
    fontSize: 28,
    type: 'server_running_time'
  },
  {
    y: 260,
    fontSize: 28,
    type: 'the_room_id'
  },
  {
    y: 290,
    fontSize: 28,
    type: 'show_connected_users'
  },
  {
    y: 320,
    fontSize: 28,
    type: 'show_latency'
  },
  {
    y: 350,
    fontSize: 28,
    type: 'show_fps'
  }
]

export default class Texts {
  textObjects: { [key: string]: Phaser.GameObjects.Text } = {}
  hidden = false
  bug: Phaser.GameObjects.Image | undefined

  constructor(public scene: Phaser.Scene) {
    texts.forEach(text => {
      let theText = scene.add
        .text(scene.cameras.main.width / 2, text.y, '', {
          color: '#ffffff',
          fontSize: text.fontSize
        })
        .setOrigin(0.5)
        .setResolution(window.devicePixelRatio)
        .setScrollFactor(0)
        .setDepth(100)

      this.textObjects[text.type] = theText
    })

    this.makeBug()
    this.resize()
    this.toggleHidden()
    this.scene.events.on('update', this.update, this)
  }

  update() {
    if (this.hidden) return
    this.setFps(this.scene.game.loop.actualFps)
  }

  makeBug() {
    this.bug = this.scene.add
      .image(0, 0, 'bug')
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(100)
    this.bug.setInteractive().on('pointerdown', () => {
      this.toggleHidden()
    })
  }

  toggleHidden() {
    this.hidden = !this.hidden
    for (const key in this.textObjects) {
      this.textObjects[key].setAlpha(this.hidden ? 0 : 1)
    }
  }

  resize() {
    texts.forEach(text => {
      const textObj = this.textObjects[text.type]
      textObj.setPosition(this.scene.cameras.main.width / 2, text.y)
    })
    if (this.bug) this.bug.setPosition(16, 16)
  }

  setConnectCounter(connectCounter: number) {
    this.textObjects['show_connected_users'].setText(`Connected users: ${connectCounter}/${MAX_PLAYERS_PER_ROOM}`)
  }

  setRoomId(roomId: string) {
    this.textObjects['the_room_id'].setText(`RoomId ${roomId}`)
  }

  setTime(time: number) {
    this.textObjects['server_running_time'].setText(`Server is running since ${new Date(time).toUTCString()}`)
  }

  setFps(fps: number) {
    this.textObjects['show_fps'].setText(`fps: ${Math.round(fps)}`)
  }

  setLatency(latency: Latency) {
    if (isNaN(latency.current)) return
    if (isNaN(latency.high) || latency.current > latency.high) latency.high = latency.current
    if (isNaN(latency.low) || latency.current < latency.low) latency.low = latency.current

    let sum = latency.history.reduce((previous, current) => (current += previous))
    let avg = sum / latency.history.length

    this.textObjects['show_latency'].setText(
      `Latency ${latency.current}ms (avg ${Math.round(avg)}ms / low ${latency.low}ms / high ${latency.high}ms)`
    )
  }
}
