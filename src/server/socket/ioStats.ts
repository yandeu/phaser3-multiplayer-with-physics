/** Handles all the communication for /stats namespace (ioNspGame) */
export default class IoStats {
  totalObjects: { [roomId: string]: { count: number } } = {}

  constructor(public ioNspStats: SocketIO.Namespace) {}

  /** This function will console.log and send it to the ioStats */
  log(log: string, logInNode = false) {
    if (logInNode) console.log('LOG: ' + log)
    this.ioNspStats.emit('getLog', { date: new Date(), log: log })
  }

  /** Get the total of objects in the game */
  getTotalObjects() {
    let count = 0
    Object.keys(this.totalObjects).forEach(roomId => {
      count += this.totalObjects[roomId].count
    })
    return count
  }

  setTotalObjects(roomId: string, count: number) {
    this.totalObjects = { ...this.totalObjects, [roomId]: { count: count } }
  }

  removeTotalObjects(roomId: string) {
    if (this.totalObjects && this.totalObjects[roomId]) {
      delete this.totalObjects[roomId]
    }
  }
}
