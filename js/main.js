var canvas = document.querySelector('.game');
var ctx = canvas.getContext('2d');

var highscore = 0;
var tapt = false;

function fall() {

  tapt = false;
  document.removeEventListener('mousedown', startClickHandler);
  document.removeEventListener('touchstart', startClickHandler);

  var playerSize = 20;
  var playerX = 50;
  var playerY = canvas.height - playerSize;

  var airJumped = true;

  var dy = 0;
  var points = 0;
  var dx = 6;

  var obstacles = [new Obstacle(canvas.width - 225), new Obstacle(canvas.width + 125)];

  document.querySelector('.play').blur(); // fokus på knapp gjør spacebar vanskelig

  function draw() {

    playerY += dy;
    dy += 0.8;
    dx += (points * 0.001);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#133686';
    ctx.fillRect(playerX, playerY, playerSize, playerSize);

    obstacles.forEach(function (obstacle) {
      obstacle.updatePos(dx);
      obstacle.draw();
      if (obstacle.x + obstacle.width <= 0) {
        obstacle.updatePos(-(canvas.width + obstacle.width));
      }

      if (obstacle.x <= playerX + playerSize && obstacle.x >= playerX - obstacle.width) {
        obstacle.inside = true;
        if (playerY + playerSize >= canvas.height - obstacle.height) {
          lose();
        }
      } else if (obstacle.inside === true) {
        obstacle.inside = false;
        points += 1;
      }
    });

    drawPoints();

    if (playerY + playerSize >= canvas.height) {
      dy = 0;
      playerY = canvas.height - playerSize;
      airJumped = false;
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
    lost();

  }

  function drawPoints() {
    if (points > highscore) {
      highscore = points;
    }

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
      if (event.keyCode === 82) {
        fall();
      }  // r for reset
      else if (event.keyCode !== 32) { // spacebar
        return;
      }
    }

    if (playerY === canvas.height - playerSize) {
      dy = -20;
    } else if (!airJumped) {
      dy = -15;
      airJumped = true;
    }

    if (tapt) {
      console.log(event.type);
      if (event.target === canvas) {
        fall();
      }
    }

    tapt = false;
  }

  function Obstacle(x) {
    this.x = x;
    this.width = 50 + Math.floor(Math.random() * 80);
    this.height = 50 + Math.floor(Math.random() * 100);
    this.inside = false;

    this.updatePos = function (dx) {
      this.x -= dx;
    };

    this.draw = function () {
        ctx.fillStyle = '#aaa';
        ctx.fillRect(this.x, canvas.height - this.height, this.width, this.height);
      };
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

  if (event.target === canvas) {
    fall();
  }
}

function lost() {
  document.addEventListener('mousedown', startClickHandler, false);
  document.addEventListener('touchstart', startClickHandler, false);
}

document.addEventListener('mousedown', startClickHandler, false);
document.addEventListener('touchstart', startClickHandler, false);
