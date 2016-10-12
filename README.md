<h1 align="center">canvas-cover</h1>
<h3 align="center">:city_sunrise::art: canvas version of background-size: cover;</h3>

<div align="center">
  <!-- License -->
  <a href="https://raw.githubusercontent.com/pqml/kool-shell/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
  </a>
  <!-- Standard -->
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
  </a>
</div>

- - -

## Features

- No dependencies
- Draw multiple image from the same DOM element
- Cool metrics features to animate easily (bleed, translation, alignement)

## Installation

```sh
npm install pqml/canvas-cover -S
```

## Usage

```javascript
var coverImage = require('canvas-cover')
var canvas = document.getElementById('myCanvas')
var context = canvas.getContext('2d')

// load the image #my-img as a cover image
var background = coverImage(document.getElementById('my-img'))

// once the image is loaded, draw it to the canvas
background.onload = draw

function draw () {
  // draw the background
  background.draw(context, 0, 0, canvas.width, canvas.height, {
    alignH: 0.5 // Center the image horizontaly inside the clip
    alignV: 0 // Align the image to the top of the clip
  })
}
```

## Methods

### image = coverImage(_source_)
Instanciate a new cover image from _source_.<br>
_source_ can be `<video>`, `<img>`, `<canvas>`.

### image.source(_source_)
Change the source of the canvas-cover instance.

### image.draw(_context_, _x_, _y_, _width_, _height_ [, _metrics_] )
Draw instance of _image_ into a clip
<br>
* _x_: the x-coordinate corner of the clip
* _y_: the y-coordinate corner of the clip
* _width_: the width of the clip
* _height_: the height of the clip
* _metrics_: optional object to control the image behaviour into the clip (see below)

> There is no loading method in canvas-cover. `coverImage(_source_)` and `image.source(_source_)` assumes that the domElement is loaded. If the element is not loaded, `image.draw()` will return immediately and nothing will be drawn.

### The metrics object

#### Default composition
```javascript
var metrics = {
  bleed: 0,
  alignH: 0.5,
  alignV: 0.5,
  offsetX: 0,
  offsetY: 0
}
```
#### Attributes
##### bleed
Add a minimum margin of _bleed_ pixels to each side of the image. <br>
This is useful is you need to translate/dezoom the image into its container.

##### alignH
Set horizontal alignment of the image. (default to 0.5)<br>
0 is the left corner / 0.5 the middle / 1 the right corner.

##### alignV
Set vertical alignment of the image. (default to 0.5)<br>
0 is the top corner / 0.5 the middle / 1 the bottom corner.

##### offsetX
Add a horizontal offset of _offsetX_ pixels.<br>
Use it to compose animations like parallax

##### offsetY
Add a vertical offset of _offsetY_ pixels

## Credits
Based on a function from [Ken Fyrstenberg Nilsen](http://stackoverflow.com/a/21961894)

## License
MIT.