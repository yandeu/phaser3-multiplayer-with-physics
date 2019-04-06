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
    addToObjectToSync('angle', obj.angle !== 'undefined' ? obj.angle : null)
    addToObjectToSync('dead', obj.dead !== 'undefined' ? obj.dead : null)
    addToObjectToSync('skin', obj.skin !== 'undefined' ? obj.skin : null)
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
    return ['id', 'x', 'y', 'angle', 'dead', 'skin', 'animation', 'direction', 'scale', 'tint', 'clientId', 'category']
  }

  static decode(data: any) {
    const keys = SyncManager.keys
    let decodedArray: any[] = []

    let obj: any = {}
    data.split(',').forEach((value: string, index: number) => {
      let key = keys[index % keys.length]

      // id (radix 36)
      if (key === 'id') {
        obj[key] = parseInt(value, 36).toString()
      }
      // numbers
      else if (['skin', 'scale'].includes(key)) {
        obj[key] = value !== '' ? parseInt(value) : null
      }
      // numbers (radix 36)
      else if (['x', 'y', 'angle', 'clientId'].includes(key)) {
        obj[key] = value !== '' ? parseInt(value, 36) : null
      }
      // booleans
      else if (['dead'].includes(key)) {
        obj[key] = value === '0' ? false : value === '1' ? true : null
      }
      // strings
      else obj[key] = value !== '' ? value : null

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
        if (typeof obj[key] !== 'undefined') {
          let value = obj[key]

          // booleans
          if (typeof obj[key] === 'boolean') value = obj[key] === false ? 0 : 1
          // some numbers to radix 36
          else if (['id', 'x', 'y', 'angle', 'clientId'].includes(key)) {
            value = +value
            value = +value.toFixed(0)
            value = value.toString(36)
          }

          encodedString += `${value},`
        } else encodedString += ','
      })
    })

    return encodedString.slice(0, -1)
  }
}
