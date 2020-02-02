import Dude from './dude'
import Box from './box'
import MatterGameObject from './matterGameObject'
import Star from './star'
import { SKINS } from '../../../constants'

interface GameObjectGroupAddOptions {
  socketId?: string
  clientId?: number
  category?: string
}

export default class GameObjectGroup {
  Matter: any

  constructor(public scene: Phaser.Scene, public objects: MatterGameObject[]) {
    this.Matter = Phaser.Physics.Matter.Matter
  }

  killById(id: string) {
    this.objects.forEach((obj: any) => {
      if (obj.body.id === id) obj.kill()
    })
  }

  getObjectById(id: string) {
    let object = undefined
    this.objects.forEach((obj: any) => {
      if (obj.body.id === id) object = obj
    })
    return object
  }

  add(x: number, y: number, skin: number, options: GameObjectGroupAddOptions = {}) {
    let dead = this.objects.filter(obj => obj.dead && obj.skin === skin)
    let alive = this.objects.filter(obj => !obj.dead && obj.skin === skin)

    const { clientId, socketId, category } = options

    // allow not more than 100 alive objects per skin
    if (alive.length >= 100) return

    let object: MatterGameObject | null = null

    if (dead.length > 0) {
      // revive the first dead object and set its x and y
      object = dead[0]
      object.revive(x, y, clientId, socketId)
    } else {
      // create a new object and add it to the objects array
      if (skin === SKINS.BOX) object = new Box(this.scene, x, y)
      else if (skin === SKINS.STAR) object = new Star(this.scene, x, y, category)
      else if (typeof clientId !== 'undefined' && typeof socketId !== 'undefined')
        object = new Dude(this.scene, x, y, clientId, socketId)
      if (object) this.objects.push(object)
    }

    // Rotate the box
    // TODO(yandeu) this should be inside the boxObject class
    if (skin === SKINS.BOX && object) this.Matter.Body.rotate(object.body, Math.random() * 2)

    return object
  }
}
