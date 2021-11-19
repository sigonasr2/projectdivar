function draw() {
  var Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(200, 200),
      ctx = canvas.getContext('2d');

  ctx.font = '30px Impact';
  ctx.rotate(0.1);
  ctx.fillText('Awesome!', 50, 100);

  return canvas;
}

module.exports = draw;