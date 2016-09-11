var Stats = require('stats.js')
var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
var raf = require('raf')
var coverImage = require('../index.js')

var size = require('size')
var Canvas = require('canvas')
var canvas = new Canvas({
  ratio: 1,
  parent: document.body
})

function resize (w, h) { canvas.resize(w, h) }
size.addListener(resize)
resize(window.innerWidth, window.innerHeight)

var estiennePhoto = coverImage('https://hd.unsplash.com/photo-1451481454041-104482d8e284')
var t = 0

function run () {
  stats.begin()

  t++
  var e = Math.cos(t * -0.1) * 70

  canvas.clear()

  estiennePhoto.draw(canvas.context,
    0,
    0,
    canvas.width,
    canvas.height,
    { ay: 1 })

  estiennePhoto.draw(canvas.context,
    canvas.width / 2 - 300,
    canvas.height / 2 - 200,
    600,
    400,
    {bleed: Math.abs(e), offsetY: e})

  stats.end()
}

estiennePhoto.onload(function () {
  raf.add(run)
})
