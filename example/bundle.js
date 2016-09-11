(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../index.js":2,"canvas":3,"raf":6,"size":7,"stats.js":8}],2:[function(require,module,exports){
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


},{"xtend":10}],3:[function(require,module,exports){
'use strict';

module.exports = Canvas;

function Canvas(options) {
    options = options || {};
    this.el = document.createElement('canvas');
    this.context = this.el.getContext('2d');
    this.ratio = options.ratio || Canvas.getDPI();
    this.width = 0;
    this.height = 0;

    if (options.parent) options.parent.appendChild(this.el);
}

Canvas.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.el.width = this.ratio * width;
    this.el.height = this.ratio * height;
    this.el.style.width = width + 'px';
    this.el.style.height = height + 'px';
};

Canvas.prototype.clear = function() {
    this.context.clearRect(0, 0, this.width * this.ratio, this.height * this.ratio);
};

// Am I the only one who never remembers if this is a canvas or context method???
Canvas.prototype.snapshot = function(type, quality) {
    return this.el.toDataURL(type, quality);
};

Canvas.prototype.destroy = function() {
    this.context = null;
    if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    this.el = null;
};

Canvas.getDPI = function() {
    return window.devicePixelRatio || 1;
};

},{}],4:[function(require,module,exports){

/**
 * Module dependencies.
 */

var now = require('date-now');

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = now() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function debounced() {
    context = this;
    args = arguments;
    timestamp = now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
};

},{"date-now":5}],5:[function(require,module,exports){
module.exports = Date.now || now

function now() {
    return new Date().getTime()
}

},{}],6:[function(require,module,exports){
'use-strict'

var singleton = raf()

function raf () {
  var _observers = []
  var _raf = null
  var _now = Date.now()
  var _lastDate = _now

  function fpsLimiter (fps, fn) {
    var _lastDate = _now
    var _interval = 1000 / fps
    var _delta = -1
    return function () {
      _delta = (_delta === -1) ? _interval : _now - _lastDate
      if (_delta >= _interval) {
        fn(_delta)
        _lastDate = _now - (_delta % _interval)
      }
    }
  }

  function _run () {
    _now = Date.now()
    var _delta = _now - _lastDate

    for (var i = 0; i < _observers.length; i++) {
      _observers[i](_delta)
    }

    _lastDate = _now
    _raf = window.requestAnimationFrame(_run)
  }

  function start () {
    if (_raf) return
    _run()
  }

  function stop () {
    if (!_raf) return
    window.cancelAnimationFrame(_raf)
    _raf = null
  }

  function add (fn) {
    if (_observers.indexOf(fn) === -1) {
      _observers.push(fn)
      start()
    }
  }

  function remove (fn) {
    var index = _observers.indexOf(fn)
    if (index !== -1) {
      _observers.splice(index, 1)
      if (_observers.length === 0) stop()
    }
  }

  return {
    start: start,
    stop: stop,
    add: add,
    remove: remove,
    fpsLimiter: fpsLimiter
  }
}

module.exports = singleton

},{}],7:[function(require,module,exports){
'use strict';

var Emitter = require('tiny-emitter');
var debounce = require('debounce');
var EVENT_NAME = 'resize';

var emitter = new Emitter();
var debounceTime;
var debounced;
var isiOS = (/ip(hone|od|ad)/i).test(window.navigator.userAgent.toLowerCase()) && !window.MSStream;

var size = module.exports = {
    width: 0,
    height: 0,
    hasBar: false,
    isLandscape: false,

    addListener: function(listener, context) {
        emitter.on(EVENT_NAME, listener, context);
    },

    removeListener: function(listener, context) {
        if(listener) emitter.off(EVENT_NAME, listener, context);
    },

    bind: function(opts) {
        opts = opts || {};
        size.unbind();
        debounceTime = opts.debounceTime || 150;
        debounced = debounce(onEvent, debounceTime);
        window.addEventListener(EVENT_NAME, debounced);
    },

    unbind: function() {
        window.removeEventListener(EVENT_NAME, debounced);
    }
};

function onEvent() {
    if (isiOS) {
        size.width = document.body.clientWidth;
        size.height = document.body.clientHeight;
        size.hasBar = size.width > size.height && size.height > window.innerHeight;
    } else {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
    }

    size.isLandscape = size.width > size.height;
    emitter.emit(EVENT_NAME, size.width, size.height);
}

onEvent();
size.bind();
},{"debounce":4,"tiny-emitter":9}],8:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

},{}],9:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],10:[function(require,module,exports){
module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty;

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}]},{},[1]);
