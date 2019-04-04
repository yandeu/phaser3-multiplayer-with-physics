import Game from './game'

// mock the socket.io
const ioMock = {
  emit: () => {},
  on: () => {},
  in: () => {},
  connected: 'connected'
}

window.addEventListener('load', () => {
  // @ts-ignore
  window.game = Game(ioMock)
})
