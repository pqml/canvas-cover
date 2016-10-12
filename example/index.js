var Stats = require('stats.js')
var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

var raf = require('raf')
var coverImage = require('../index.js')

var size = require('size')
var canvas = require('canvas')
var scene = canvas({
  ratio: 1,
  parent: document.body
})

function resize (w, h) {
  scene.resize(w, h)
}

size.addListener(resize)
resize(window.innerWidth, window.innerHeight)

var chateaugiron = coverImage()
chateaugiron.source = document.createElement('img')
chateaugiron.source.src = './chateaugiron.jpg'
chateaugiron.source.onload = function () { raf.add(run) }
var t = 0

function run () {
  stats.begin()

  t++
  var e = Math.cos(t * -0.1) * 70

  scene.clear()

  chateaugiron.draw(
    scene.context,
    0,
    0,
    scene.width,
    scene.height,
    { alignV: 0 })

  chateaugiron.draw(
    scene.context,
    scene.width / 2 - 300,
    scene.height / 2 - 200,
    600,
    400,
    {bleed: Math.abs(e), offsetY: e})

  stats.end()
}
