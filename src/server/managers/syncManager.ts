import MatterGameObject from '../game/matterObjects/matterGameObject'

/** Helps preparing the object to sync with the client */
export default class SyncManager {
  constructor() {}

  static prepareFromPhaserGroup(group: Phaser.GameObjects.Group, objects: any) {
    group.children.iterate((sprite: any) => {
      SyncManager.prepareFromPhaserSprite(sprite, objects)
    })
  }

  static prepareFromPhaserSprite(sprite: any, objects: any) {
    let obj = {
      ...sprite,
      ...this.getXY(sprite)
    }
    objects.push(SyncManager.cleanObjectToSync(obj))
  }

  static prepareFromMatterGameObject(gameObjects: MatterGameObject[], objects: any) {
    gameObjects.forEach(obj => {
      objects.push(SyncManager.cleanObjectToSync(obj))
    })
  }

  static getXY(child: any) {
    return { x: child.body.position.x + child.body.width / 2, y: child.body.position.y + child.body.height / 2 }
  }

  static mergeObjectToSync(obj: any, mergeTo: any[]) {
    let merged = false
    Object.keys(mergeTo).forEach(o => {
      if (o === obj.id) {
        mergeTo[obj.id] = {
          ...mergeTo[obj.id],
          ...obj
        }
        merged = true
      }
    })
    if (!merged)
      mergeTo = {
        ...mergeTo,
        [obj.id]: obj
      }
    return mergeTo
  }

  static cleanObjectToSync(obj: any) {
    const addToObjectToSync = (key: string, prop: any) => {
      if (prop !== null) objectToSync = { ...objectToSync, [key]: prop }
    }

    let objectToSync: { [key: string]: any } = {}

    addToObjectToSync('id', obj.id || obj.body.id)
    addToObjectToSync('x', obj.x || obj.body.position.x || null)
    addToObjectToSync('y', obj.y || obj.body.position.y || null)
    addToObjectToSync('angle', obj.angle || null)
    addToObjectToSync('dead', obj.dead || null)
    addToObjectToSync('type', obj.type || null)
    addToObjectToSync('animation', obj.animation || null)
    addToObjectToSync('direction', obj.direction || null)
    addToObjectToSync('scale', obj.scale && obj.scale !== 1 ? obj.scale : null)
    addToObjectToSync('tint', obj.tint ? obj.tint : null)
    addToObjectToSync('clientId', obj.clientId || null)
    addToObjectToSync('category', obj.category || null)

    // Object.keys(objectToSync).forEach(key => objectToSync[key] == null && delete objectToSync[key])

    return objectToSync
  }

  static get keys() {
    // sort these based on most used
    return ['id', 'x', 'y', 'angle', 'dead', 'type', 'animation', 'direction', 'scale', 'tint', 'clientId', 'category']
  }

  static decode(data: any) {
    const keys = SyncManager.keys
    let decodedArray: any[] = []

    let obj: any = {}
    data.split(',').forEach((value: string, index: number) => {
      obj[keys[index % keys.length]] = value !== '' ? value : null

      if (index % keys.length === keys.length - 1) {
        decodedArray.push({ ...obj })
        obj = {}
      }
    })

    return decodedArray
  }

  static encode(objs: any[]) {
    const keys = SyncManager.keys

    let encodedString = ''
    objs.forEach((obj: any) => {
      keys.forEach(key => {
        if (obj[key]) {
          let data = key === 'x' || key === 'y' || key === 'angle' ? obj[key].toFixed(0) : obj[key]
          if (typeof obj[key] === 'boolean') data = obj[key] === false ? 0 : 1
          encodedString += `${data},`
        } else encodedString += ','
      })
    })

    return encodedString.slice(0, -1)
  }
}
