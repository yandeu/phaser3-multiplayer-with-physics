import io from 'socket.io-client'
import axios from 'axios'
import moment from 'moment'

let url = `${location.origin}/S` /* short for stats */
let stats = io.connect(url, { transports: ['websocket'] })

let statsUl = document.getElementById('logs-ul')

// on reconnection, reset the transports option, as the Websocket
// connection may have failed (caused by proxy, firewall, browser, ...)
stats.on('reconnect_attempt', () => {
  stats.io.opts.transports = ['polling', 'websocket']
})

stats.on('connect', () => {
  console.log("You're connected")
})

stats.on('getLog', (res: { date: Date; log: string }) => {
  if (statsUl) {
    let li = document.createElement('li')
    li.innerHTML = `${moment(res.date).format('h:mm:ss a')}: ${res.log}`
    statsUl.appendChild(li)
  }
})

const setInnerHTML = (id: string, text: string | number) => {
  let el = document.getElementById(id)
  if (el) el.innerHTML = text.toString()
}

const getNewServerStats = async () => {
  try {
    let res = await axios.get('/stats/get')
    if (!res || !res.data) throw new Error()

    const { payload } = res.data

    const { time, cpu, memory, rooms, users, objects } = payload
    setInnerHTML('cpu', `CPU: <b>${Math.round(cpu)}%</b>`)
    setInnerHTML('memory', `Memory: <b>${Math.round(memory / 1000000)}mb</b>`)
    setInnerHTML('rooms', `Rooms: <b>${rooms}</b>`)
    setInnerHTML('users', `Users: <b>${users}</b>`)
    setInnerHTML('objects', `Objects: <b>${objects}</b>`)
    setInnerHTML('time', `Server started <b>${moment(time).fromNow()}</b>`)
  } catch (error) {
    console.error(error.message)
  }
}
setInterval(getNewServerStats, 2000)
getNewServerStats()
