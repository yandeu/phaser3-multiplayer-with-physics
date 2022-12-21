import 'source-map-support/register'

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import path from 'path'

const app = express()
const server = require('http').Server(app)
import SocketIOStatic from 'socket.io'
const io = SocketIOStatic(server)

import RoomManager from './managers/roomManager'
import Routes from './routes/routes'
import IoStats from './socket/ioStats'
import IoGame from './socket/ioGame'

const port = process.env.PORT || 3000

// create 2 socket.io namespaces
const ioNspGame = io.of('/G' /* short for stats */)
const ioNspStats = io.of('/S' /* short for stats */)

const ioStats = new IoStats(ioNspStats)
const roomManager = new RoomManager(ioNspGame, ioStats)
const ioGame = new IoGame(ioNspGame, ioStats, roomManager)

app.use(helmet())
app.use(compression())

app.use('/static', express.static(path.join(__dirname, '../')))
app.use('/', new Routes(roomManager, ioStats).router)

server.listen(port, () => {
  console.log('App is listening on http://localhost:' + port)
})
