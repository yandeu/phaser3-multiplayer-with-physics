import Texts from '../components/texts'
import Cursors from '../components/cursors'
import { setDudeAnimation, setMummyAnimation } from '../components/animations'
import fullscreenButton from '../components/fullscreenButton'
import Controls from '../components/controls'
import { world } from '../config'
import Resize from '../components/resize'

import SyncManager from '../../server/managers/syncManager'
import { SKINS } from '../../constants'

interface Objects {
  [key: string]: any
}

export default class MainScene extends Phaser.Scene {
  objects: Objects = {}
  sync: { initialState: boolean; objects: any[] } = {
    initialState: false,
    objects: []
  }

  latency: Latency = {
    current: NaN,
    high: NaN,
    low: NaN,
    ping: NaN,
    id: '',
    canSend: true,
    history: []
  }
  socket: Socket

  cursors: Cursors | undefined
  controls: Controls | undefined
  level: number = 0

  constructor() {
    super({ key: 'MainScene' })
  }

  init(props: { scene: string; level: number; socket: Socket }) {
    const { scene, level = 0, socket } = props
    this.level = level
    this.socket = socket
    this.socket.emit('joinRoom', { scene, level })
  }

  create() {
    const socket = this.socket

    let levelText = this.add
      .text(0, 0, `Level ${this.level + 1}`, {
        color: '#ffffff',
        fontSize: 42
      })
      .setOrigin(0.5, 0)
      .setDepth(100)
      .setScrollFactor(0)

    let starfield = this.add.tileSprite(world.x, world.y, world.width, world.height, 'starfield').setOrigin(0)
    this.cursors = new Cursors(this, socket)
    this.controls = new Controls(this, socket)
    let texts = new Texts(this)
    let fullscreenBtn = fullscreenButton(this)

    this.cameras.main.setBounds(world.x, world.y, world.width, world.height)

    socket.on('getPong', (id: string) => {
      if (this.latency.id !== id) return
      this.latency.canSend = true
      this.latency.current = new Date().getTime() - this.latency.ping
      if (this.latency.history.length >= 200) this.latency.history.shift()
      this.latency.history.push(this.latency.current)
      texts.setLatency(this.latency)
    })
    this.time.addEvent({
      delay: 250, // max 4 times per second
      loop: true,
      callback: () => {
        if (!this.latency.canSend) return
        if (texts.hidden) return
        this.latency.ping = new Date().getTime()
        this.latency.id = Phaser.Math.RND.uuid()
        this.latency.canSend = false
        socket.emit('sendPing', this.latency.id)
      }
    })

    socket.on('changingRoom', (data: { scene: string; level: number }) => {
      console.log('You are changing room')
      // destroy all objects and get new onces
      Object.keys(this.objects).forEach((key: string) => {
        this.objects[key].sprite.destroy()
        delete this.objects[key]
      })
      socket.emit('getInitialState')
      this.level = data.level | 0
      levelText.setText(`Level ${this.level + 1}`)
    })

    socket.on('S' /* short for syncGame */, (res: any) => {
      if (res.connectCounter) texts.setConnectCounter(res.connectCounter)
      if (res.time) texts.setTime(res.time)
      if (res.roomId) texts.setRoomId(res.roomId)

      // res.O (objects) contains only the objects that need to be updated
      if (res.O /* short for objects */) {
        res.O = SyncManager.decode(res.O)

        this.sync.objects = [...this.sync.objects, ...res.O]
        this.sync.objects.forEach((obj: any) => {
          // the if the player's dude is in the objects list the camera follows it sprite
          if (this.objects[obj.id] && obj.skin === SKINS.DUDE && obj.clientId && +obj.clientId === +socket.clientId) {
            this.cameras.main.setScroll(obj.x - this.cameras.main.width / 2, obj.y - this.cameras.main.height / 2)
          }

          // if the object does not exist, create a new one
          if (!this.objects[obj.id]) {
            let sprite = this.add
              .sprite(obj.x, obj.y, obj.skin.toString())
              .setOrigin(0.5)
              .setRotation(obj.angle || 0)

            // add the sprite by id to the objects object
            this.objects[obj.id] = {
              sprite: sprite
            }
          }

          // set some properties to the sprite
          let sprite = this.objects[obj.id].sprite
          // set scale
          if (obj.scale) {
            sprite.setScale(obj.scale)
          }
          // set scale
          if (obj.tint) {
            sprite.setTint(obj.tint)
          }
          // set visibility
          sprite.setVisible(!obj.dead)
        })
      }
    })
    // request the initial state
    socket.emit('getInitialState')

    // request the initial state every 15 seconds
    // to make sure all objects are up to date
    // in case we missed one (network issues)
    // should be sent from the server side not the client
    // this.time.addEvent({
    //   delay: 15000,
    //   loop: true,
    //   callback: () => {
    //     socket.emit('getInitialState')
    //   }
    // })

    // request the initial state if the game gets focus
    // e.g. if the users comes from another tab or window
    this.game.events.on('focus', () => socket.emit('getInitialState'))

    // this helps debugging
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      console.log(pointer.worldX, pointer.worldY)
    })

    const resize = () => {
      starfield.setScale(Math.max(this.cameras.main.height / starfield.height, 1))
      texts.resize()
      if (this.controls) this.controls.resize()
      fullscreenBtn.setPosition(this.cameras.main.width - 16, 16)
      this.cameras.main.setScroll(this.cameras.main.worldView.x, world.height)
      levelText.setPosition(this.cameras.main.width / 2, 20)
    }

    this.scale.on('resize', (gameSize: any, baseSize: any, displaySize: any, resolution: any) => {
      this.cameras.resize(gameSize.width, gameSize.height)
      resize()
    })
    Resize(this.game)
  }

  update(time: number, delta: number) {
    // update all objects
    if (this.sync.objects.length > 0) {
      this.sync.objects.forEach(obj => {
        if (this.objects[obj.id]) {
          let sprite = this.objects[obj.id].sprite
          if (obj.dead !== null) sprite.setVisible(!obj.dead)
          if (obj.x !== null) sprite.x = obj.x
          if (obj.y !== null) sprite.y = obj.y
          if (obj.angle !== null && typeof obj.angle !== 'undefined') sprite.angle = obj.angle
          if (obj.skin !== null) {
            if (obj.skin === SKINS.MUMMY) {
              if (obj.direction !== null) setMummyAnimation(sprite, obj.direction)
            }
            if (obj.skin === SKINS.DUDE) {
              if (obj.animation !== null) setDudeAnimation(sprite, obj.animation)
            }
          }
        }
      })
    }
    this.sync.objects = []
  }
}
