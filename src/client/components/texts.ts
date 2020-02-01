import { MAX_PLAYERS_PER_ROOM } from "../../constants"

const texts = [
  {
    text: '',
    y: 200,
    fontSize: 28,
    type: 'server_running_time'
  },
  {
    text: '',
    y: 260,
    fontSize: 28,
    type: 'the_room_id'
  },
  {
    text: '',
    y: 290,
    fontSize: 28,
    type: 'show_connected_users'
  },
  {
    text: '',
    y: 320,
    fontSize: 28,
    type: 'show_latency'
  },
  {
    text: '',
    y: 350,
    fontSize: 28,
    type: 'show_fps'
  }
]

export default class Texts {
  textObjects: {
    text: Phaser.GameObjects.Text
    type: string | undefined
  }[] = []
  hidden = false
  bug: Phaser.GameObjects.Image | undefined

  constructor(public scene: Phaser.Scene) {
    texts.forEach(text => {
      let theText = scene.add
        .text(scene.cameras.main.width / 2, text.y, text.text, {
          color: '#ffffff',
          fontSize: text.fontSize
        })
        .setOrigin(0.5)
        .setResolution(window.devicePixelRatio)
        .setScrollFactor(0)
        .setDepth(100)
      this.textObjects.push({ text: theText, type: text.type || undefined })
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
    this.textObjects.forEach(textObj => {
      textObj.text.setAlpha(this.hidden ? 0 : 1)
    })
  }

  resize() {
    this.textObjects.forEach(textObj => {
      textObj.text.setPosition(this.scene.cameras.main.width / 2, textObj.text.y)
    })
    if (this.bug) this.bug.setPosition(16, 16)
  }

  setConnectCounter(connectCounter: number) {
    this.textObjects.forEach(t => {
      if (t.type && t.type === 'show_connected_users') t.text.setText(`Connected users: ${connectCounter}/${MAX_PLAYERS_PER_ROOM}`)
    })
  }

  setRoomId(roomId: string) {
    this.textObjects.forEach(t => {
      if (t.type && t.type === 'the_room_id') t.text.setText(`RoomId ${roomId}`)
    })
  }

  setTime(time: number) {
    this.textObjects.forEach(t => {
      if (t.type && t.type === 'server_running_time')
        t.text.setText(`Server is running since ${new Date(time).toUTCString()}`)
    })
  }

  setFps(fps: number) {
    this.textObjects.forEach(t => {
      if (t.type && t.type === 'show_fps') t.text.setText(`fps: ${Math.round(fps)}`)
    })
  }

  setLatency(latency: Latency) {
    if (isNaN(latency.current)) return
    if (isNaN(latency.high) || latency.current > latency.high) latency.high = latency.current
    if (isNaN(latency.low) || latency.current < latency.low) latency.low = latency.current

    let sum = latency.history.reduce((previous, current) => (current += previous))
    let avg = sum / latency.history.length

    this.textObjects.forEach(t => {
      if (t.type && t.type === 'show_latency')
        t.text.setText(
          `Latency ${latency.current}ms (avg ${Math.round(avg)}ms / low ${latency.low}ms / high ${latency.high}ms)`
        )
    })
  }
}
