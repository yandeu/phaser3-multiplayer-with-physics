declare global {
  namespace NodeJS {
    interface Global {
      document: any
      window: any
      Image: any
      navigator: any
      XMLHttpRequest: any
      HTMLCanvasElement: any
      requestAnimationFrame: any
    }
  }
}
import Canvas from 'canvas'
import jsdom from 'jsdom'

const { JSDOM } = jsdom
const dom = new JSDOM(`<!DOCTYPE html><body></body>`)

let document = dom.window.document
let window = dom.window

global.document = document
global.window = window
global.Image = Canvas.Image
global.window.Element = undefined
global.navigator = { userAgent: 'node' }
global.XMLHttpRequest = function() {}
global.HTMLCanvasElement = window.HTMLCanvasElement
window.focus = () => {}

const animationFrame = (cb: any) => {
  if (typeof cb !== 'function') return 0 // this line saves a lot of cpu
  window.setTimeout(() => cb(0), 1000 / 60)
  return 0
}

window.requestAnimationFrame = cb => {
  return animationFrame(cb)
}
