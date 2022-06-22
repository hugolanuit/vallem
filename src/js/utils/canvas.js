/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export const roundRect = (ctx, x, y, width, height, radius = 5, fill = false, stroke = true) => {
  if (typeof radius === 'number') radius = { tl: radius, tr: radius, br: radius, bl: radius };
  else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) radius[side] = radius[side] || defaultRadius[side];
  }

  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);

  ctx.bezierCurveTo(
    x + width - radius.tr * 0.5, y, 
    x + width, y + radius.tr * 0.5, 
    x + width, y + radius.tr
  ); // top-right

  ctx.lineTo(x + width, y + height - radius.br);

  ctx.bezierCurveTo(
    x + width, y + height - radius.br * 0.5, 
    x + width - radius.br * 0.5, y + height, 
    x + width - radius.br, y + height
  ); // bottom-right

  ctx.lineTo(x + radius.bl, y + height);
  ctx.bezierCurveTo(
    x + radius.bl * 0.5, y + height, 
    x, y + height - radius.bl * 0.5,
    x, y + height - radius.bl
  ); // bottom-left

  ctx.lineTo(x, y + radius.tl);
  ctx.bezierCurveTo(
    x, y + radius.tl * 0.5, 
    x + radius.tl * 0.5, y,
    x + radius.tl, y
  ); // top-left

  ctx.closePath();

  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}


export default {
  roundRect,
};
