import 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.HEADLESS,
  parent: 'phaser-game',
  width: 1280,
  height: 720,
  banner: false,
  // @ts-ignore
  audio: false
}
export default config

export const arcadePhysics = {
  default: 'arcade',
  arcade: {
    gravity: { y: 1500 }
  }
}

export const matterPhysics = {
  default: 'matter',
  matter: {
    gravity: {
      y: 2
    }
  }
}
