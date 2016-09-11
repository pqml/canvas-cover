var xtend = require('xtend')

function coverImage (url) {
  var image = document.createElement('img')
  image.src = url

  function onload (cb) {
    image.onload = cb
  }

  function draw (context, x, y, w, h, metrics) {
    metrics = xtend({
      bleed: 0,
      offsetX: 0,
      offsetY: 0,
      alignH: 0.5,
      alignV: 0.5
    }, metrics)

    // calc first ratio to fit one side of the clip (from Ken Fyrstenberg Nilsen)
    var iw = image.width
    var ih = image.height
    var ratio = Math.min(w / iw, h / ih)
    var nw = iw * ratio
    var nh = ih * ratio

    // fill the gap for the other side (from Ken Fyrstenberg Nilsen)
    var ar = 1
    if (nw < w) ar = w / nw
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh
    ratio *= ar

    // bleeding calc
    metrics.bleed *= 2
    var bx, by
    bx = metrics.bleed
    by = metrics.bleed * (nh / nw)
    // adjust the ratio if necessary
    if (by < metrics.bleed) {
      var nr = metrics.bleed / by
      by *= nr
      bx *= nr
    }

    // set final coordinates and sizes
    nw = iw * ratio + bx
    nh = ih * ratio + by
    var nx = x + (w - nw) * metrics.alignH + metrics.offsetX
    var ny = y + (h - nh) * metrics.alignV + metrics.offsetY

    // draw
    context.save()
    context.beginPath()
    context.rect(x, y, w, h)
    context.clip()
    context.drawImage(image, nx, ny, nw, nh)
    context.restore()
  }

  return {
    onload: onload,
    draw: draw
  }
}

module.exports = coverImage

