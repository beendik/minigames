
var canvas = document.querySelector('.game');
var ctx = canvas.getContext('2d');

var highscore = 0;
var started = false;

function isTouchDevice() {
  return 'ontouchstart' in document.documentElement;
}


function fall() {

  document.removeEventListener('mousedown', startClickHandler);
  document.removeEventListener('touchstart', startClickHandler);

  var playerSize = 20;
  var blockWidth = 80;
  var blockHeight = 200;
  var y = canvas.height - playerSize - 1;
  var x = canvas.width;
  var inside = false;
  var airJumped = true;

  var tapt = false;

  var dy = 0;
  var points = 0;
  var dx = 8;

  document.querySelector('.play').blur(); // fokus på knapp gjør spacebar vanskelig

  function draw() {

    ctx.fillStyle = 'green';
    y += dy;
    dy += 0.8;
    x -= dx + (points * 0.5);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#133686';
    ctx.fillRect(50, y, playerSize, playerSize);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(x, canvas.height - blockHeight, blockWidth, blockHeight);
    drawPoints();

    if (y + playerSize >= canvas.height) {
      dy = 0;
      y = canvas.height - playerSize;
      airJumped = false;
    }

    if (x + blockWidth <= 0) {
      x = canvas.width;
      blockHeight = 50 + Math.floor(Math.random() * 100);
      blockWidth = 50 + Math.floor(Math.random() * 80);
    }

    if (x <= 50 + playerSize && x >= 50 - blockWidth) {
      inside = true;
      if (y + playerSize >= canvas.height - blockHeight) {
        lose();
      }
    } else if (inside === true) {
      inside = false;
      points += 1;
    }

    if (!tapt) {
      requestAnimationFrame(draw);
    }
  }

  function lose() {
    ctx.font = '60px Helvetica Neue';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Du tapte.', canvas.width / 2, canvas.height / 2);
    tapt = true;
    drawPoints();

  }

  function drawPoints() {
    if (points > highscore) { highscore = points;}

    ctx.fillStyle = '#666';
    ctx.font = '32px Helvetica Neue';
    ctx.textAlign = 'center';
    ctx.fillText(points, 80, 80);
    ctx.fillStyle = '#aaa';
    ctx.fillText(highscore, canvas.width - 80, 80);

  }

  function clickHandler(event) {
    if (isTouchDevice() && event.type === 'mousedown') {
      return;
    }

    if (event.type === 'keydown') {
      if (event.keyCode === 82) {fall();}  // r for reset
      else if (event.keyCode !== 32) { // spacebar
        return;
      }
    }

    if (y === canvas.height - playerSize) {
      dy = -20;
    } else if (!airJumped) {
      dy = -15;
      airJumped = true;
    }

    if (tapt) {
      if (event.target === canvas) {
        fall();
      }
    }

    tapt = false;
  }

  function blocks() {

  }

  document.addEventListener('mousedown', clickHandler, false);
  document.addEventListener('touchstart', clickHandler, false);
  document.addEventListener('keydown', clickHandler, false);

  draw();

}

function startClickHandler(event) {

  if (isTouchDevice() && event.type === 'mousedown') {
    return;
  }

  if (event.target === canvas && !started) {
    fall();
    started = true;
  }
}

document.addEventListener('mousedown', startClickHandler, false);
document.addEventListener('touchstart', startClickHandler, false);