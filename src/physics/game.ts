import commonConfig, { arcadePhysics, matterPhysics } from '../server/game/config'

import ArcadeScene from '../server/game/scenes/arcadeScene'
import MatterScene from '../server/game/scenes/matterScene'

class PhaserGame extends Phaser.Game {
  debug = true

  constructor(public io: SocketIO.Namespace, config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const Game = (io: SocketIO.Namespace) => {
  let config = { ...commonConfig }
  let href = location.href

  config.type = Phaser.AUTO
  config.scale = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }

  if (/arcade/.test(href)) {
    config.scene = [ArcadeScene]
    config.physics = arcadePhysics
    // @ts-ignore
    config.physics.arcade.debug = true
  }
  if (/matter/.test(href)) {
    config.scene = [MatterScene]
    config.physics = matterPhysics
    if (config.physics.matter) config.physics.matter.debug = true
  }

  return new PhaserGame(io, config)
}
export default Game
