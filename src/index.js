import "./assets/style/index.css";
import "./assets/style/index.styl";

import a from './a';
// var html = require('./expamle.html');
// console.log(html);
console.log(a);
const canvas = document.all.canvas;
const ctx = canvas.getContext("2d");
ctx.fillStyle = 'red'
ctx.fillRect(0, 0, 300, 20)
ctx.fillStyle = 'red'
ctx.fillRect(0, 0, 20, 300)
let step = 3,
    xPoint = 0 + 20;
function move() {
    ctx.clearRect(20, 20, 300, 300)
    ctx.fillStyle = 'purple';
    ctx.fillRect(xPoint, 20, 280, 280);
    xPoint += step
    if (xPoint <= 300) {
      requestAnimationFrame(() => {
        move()
      })
    } else {
        fanxiang()
    }
};
function fanxiang() {
    ctx.clearRect(20, 20, 300, 300)
    ctx.fillStyle = 'purple';
    ctx.fillRect(xPoint, 20, 280, 280);
    xPoint -= step
    if (xPoint > 20) {
      requestAnimationFrame(() => {
        fanxiang()
      })
    } else {
        move()
    }
}
move();

