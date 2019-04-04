const fullscreenButton = (scene: Phaser.Scene) => {
  let button = scene.add
    .image(0, 0, 'fullscreen', 0)
    .setOrigin(1, 0)
    .setInteractive()
    .setScrollFactor(0)
    .setDepth(100)

  button.on('pointerup', () => {
    if (scene.scale.isFullscreen) {
      button.setFrame(0)
      scene.scale.stopFullscreen()
    } else {
      button.setFrame(1)
      scene.scale.startFullscreen()
    }
  })
  return button
}

export default fullscreenButton
