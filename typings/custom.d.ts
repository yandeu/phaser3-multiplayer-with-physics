declare namespace Phaser {
  namespace Physics {
    namespace Matter {
      export const Matter: any
      export const matter: any
    }
  }
}

interface Window {
  game: Phaser.Game
}

interface Socket extends SocketIOClient.Socket {
  join: (roomId: string) => {}
  leave: (roomId: string) => {}
  scene: Phaser.Scene
  id: string
  clientId: number
  room: string
}

declare const PHYSICS_DEBUG: boolean

interface Latency {
  current: number
  high: number
  low: number
  ping: number
  id: string
  canSend: boolean
  history: any[]
}
