function coverImage (source) {
  var api = {
    source: source || null,
    draw: draw
  }

  function draw (context, x, y, w, h, opts) {
    if (!api.source || !api.source.width || !api.source.height) return

    opts = opts || {}
    var metrics = {
      bleed: opts.bleed || 0,
      offsetX: opts.offsetX || 0,
      offsetY: opts.offsetY || 0,
      alignH: opts.alignH || 0.5,
      alignV: opts.alignV || 0.5
    }

    // calc first ratio to fit one side of the clip (from Ken Fyrstenberg Nilsen)
    var iw = api.source.width
    var ih = api.source.height
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
    context.drawImage(api.source, nx, ny, nw, nh)
    context.restore()
  }

  return api
}

module.exports = coverImage

