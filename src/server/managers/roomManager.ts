interface GameScene extends Phaser.Scene {
  objects: any
}
interface User {
  id: string
  lastUpdate: number
  clientId: number
  roomId: string
}
interface Users {
  [userId: string]: User
}
interface Room {
  roomId: string
  // I am not sure if it is safe to publish the roomId to the client
  // so we only create a second id
  // - If you know if it is safe or not, please tell me :) -
  //publicRoomId: string
  game: Phaser.Game
  scene: GameScene
  removing: boolean
  users: Users
  level: number
  sceneKey: string
}
interface Rooms {
  [room: string]: Room
}
import Game, { PhaserGame } from '../game/game'
import { Math as phaserMath } from 'phaser'
import { MAX_PLAYERS_PER_ROOM, USER_KICK_TIMEOUT } from '../../constants'

let randomDataGenerator = new phaserMath.RandomDataGenerator()

import { v4 as uuidv4 } from 'uuid'
import Stats from '../socket/ioStats'

export default class RoomManager {
  rooms: Rooms = {}

  constructor(public ioNspGame: SocketIO.Namespace, public stats: Stats) {
    setInterval(() => {
      this.removeInactiveRooms()
      this.removeInactiveUsers()
    }, 10000)
  }

  generateClientId(socket: Socket) {
    let clientId = randomDataGenerator.integerInRange(100000, 100000000)
    socket.clientId = clientId
    socket.emit('clientId', clientId)
  }

  // the 2 functions below should be better
  async joinRoom(socket: Socket, scene: string, level: number) {
    if (typeof scene !== 'string' || typeof level !== 'number') {
      console.error('level or scene is not defined in ioGame.ts')
      return
    }
    socket.room = this.chooseRoom({ scene: scene, level: +level })

    // create a new game instance if this room does not exist yet
    if (!this.rooms[socket.room]) {
      await this.createRoom(socket.room, scene, +level)
    }

    this.addUser(socket)
    this.rooms[socket.room].scene.events.emit('createDude', socket.clientId, socket.id)
  }

  leaveRoom(socket: Socket) {
    this.removeUser(socket.room, socket.id)
    this.ioNspGame
      .in(socket.room)
      .emit('S' /* short for syncGame */, { connectCounter: this.getRoomUsersArray(socket.room).length })

    if (this.isRemoving(socket.room)) return
    this.rooms[socket.room].scene.events.emit('removeDude', socket.clientId)
  }

  async changeRoom(socket: Socket, scene: string, level: number) {
    this.leaveRoom(socket)
    await this.joinRoom(socket, scene, +level)
    socket.emit('changingRoom', { scene: scene, level: +level })
  }

  addUser(socket: Socket) {
    let newUsers: Users = {
      [socket.id]: {
        roomId: socket.room,
        lastUpdate: Date.now(),
        clientId: socket.clientId,
        id: socket.id
      }
    }

    this.rooms[socket.room].users = {
      ...this.rooms[socket.room].users,
      ...newUsers
    }
    // join the socket room
    socket.join(socket.room)
  }

  /** Removed the user from the room */
  removeUser(roomId: string, userId: string, log: boolean = true) {
    if (this.ioNspGame.sockets[userId]) this.ioNspGame.sockets[userId].leave(roomId)

    if (this.userExists(roomId, userId)) {
      delete this.rooms[roomId].users[userId]
      if (log) this.stats.log(`User <b>${userId}</b> disconnected!`)
      return true
    }
    return false
  }

  /** Check if this user exists */
  userExists(roomId: string, userId: string) {
    if (this.roomExists(roomId) && this.rooms[roomId].users && this.rooms[roomId].users[userId]) return true
    return false
  }

  /** Check if this room exists */
  roomExists(roomId: string) {
    if (this.rooms && this.rooms[roomId]) return true
    return false
  }

  isRemoving(roomId: string) {
    if (!!!this.rooms[roomId] || this.rooms[roomId].removing) return true
    else return false
  }

  createRoom = async (roomId: string, scene: string, level: number) => {
    this.stats.log(`Create new room <b>${roomId}</b>`)

    let game: PhaserGame = await Game(this, roomId, { scene, level })

    this.rooms[roomId] = {
      sceneKey: scene,
      level: +level,
      roomId: roomId,
      users: {},
      game: game,
      // @ts-ignore
      scene: game.scene.keys['MainScene'],
      removing: false
    }

    this.stats.log(`Room <b>${roomId}</b> created!`)
  }

  removeRoom = async (roomId: string) => {
    if (this.rooms[roomId].removing) return
    this.stats.log(`Removing room <b>${roomId}</b>`)
    this.rooms[roomId].removing = true
    this.rooms[roomId].scene.events.emit('stopScene')

    setTimeout(async () => {
      await this.rooms[roomId].game.destroy(true, true)
      // @ts-ignore
      this.rooms[roomId].game = null
      delete this.rooms[roomId]

      this.stats.log(`Room <b>${roomId}</b> has been removed!`)
      this.stats.log(`Remaining rooms: ${Object.keys(this.rooms).length}`)
    }, 5000)
  }

  chooseRoom = (props: { scene: string; level: number }): string => {
    const { scene, level } = props

    let rooms = Object.keys(this.rooms)

    if (rooms.length === 0) return uuidv4()

    // check for the next room with 1 or more free spaces
    let chosenRoom = null
    for (let i = 0; i < Object.keys(this.rooms).length; i++) {
      let room = this.rooms[rooms[i]]
      let count = Object.keys(room.users).length
      if (
        count < MAX_PLAYERS_PER_ROOM &&
        room.sceneKey === scene &&
        room.level === level &&
        !this.isRemoving(rooms[i])
      ) {
        chosenRoom = rooms[i]
        break
      }
    }
    if (chosenRoom) return chosenRoom

    // create a new room with a new uuidv4 id
    return uuidv4()
  }

  getRoomsArray() {
    let rooms: Room[] = []
    Object.keys(this.rooms).forEach((roomId) => {
      rooms.push(this.rooms[roomId])
    })
    return rooms
  }

  /** Returns an Array of all users in a specific room */
  getRoomUsersArray(roomId: string) {
    let users: User[] = []

    if (!this.roomExists(roomId)) return users

    Object.keys(this.rooms[roomId].users).forEach((userId) => {
      users.push(this.rooms[roomId].users[userId])
    })
    return users
  }

  /** Returns an Array of all users in all rooms */
  getAllUsersArray() {
    let users: User[] = []
    Object.keys(this.rooms).forEach((roomId) => {
      Object.keys(this.rooms[roomId].users).forEach((userId) => {
        users.push(this.rooms[roomId].users[userId])
      })
    })
    return users
  }

  disconnectUser(userId: string) {
    if (this.ioNspGame.connected && this.ioNspGame.connected[userId]) {
      this.ioNspGame.connected[userId].disconnect(true)
      return true
    }
    return false
  }

  removeInactiveRooms() {
    this.getRoomsArray().forEach((room: Room) => {
      if (!room.users || Object.keys(room.users).length === 0) this.removeRoom(room.roomId)
    })
  }

  removeInactiveUsers() {
    this.getAllUsersArray().forEach((user: User) => {
      if (Date.now() - user.lastUpdate > USER_KICK_TIMEOUT) {
        let removed = this.removeUser(user.roomId, user.id, false)
        let disconnected = this.disconnectUser(user.id)
        if (removed && disconnected) {
          this.stats.log(`Kick user <b>${user.clientId}</b> from room <b>${user.roomId}</b>`)
        }
      }
    })
  }
}
