import io from 'socket.io-client'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.setBaseURL('static/client')
    this.load.image('box', 'assets/box.png')
    this.load.image('star', 'assets/star.png')
    this.load.image('bug', 'assets/bug.png')
    this.load.image('starfield', 'assets/starfield.jpg')
    this.load.image('controls', 'assets/controls.png')
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })
    this.load.spritesheet('fullscreen', 'assets/fullscreen.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('mummy', 'assets/mummy37x45.png', { frameWidth: 37, frameHeight: 45 })
  }

  create() {
    // connecting to socket.io
    const url = `${location.origin}/game`

    let socket = io.connect(url, { transports: ['websocket'] }) as Socket

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket']
    })

    socket.on('connect', () => {
      console.log("You're connected to socket.io")
    })

    // we wait until we have a valid clientId, then start the MainScene
    socket.on('clientId', (clientId: number) => {
      socket.clientId = clientId
      console.log('Your client id', clientId)
      this.scene.start('MenuScene', { socket })
    })
  }
}
