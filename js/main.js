var canvas = document.querySelector('.game');
var context = canvas.getContext('2d');

var highscore = 0;
var tapt = false;

function fall() {
  document.querySelector('.play').blur(); // fokus på knapp gjør spacebar vanskelig
  tapt = false;
  document.removeEventListener('mousedown', startClickHandler);
  document.removeEventListener('touchstart', startClickHandler);

  var playerSize = 20;
  var playerX = 50;
  var playerY = canvas.height - playerSize;

  var obstacles = [
    new Obstacle(canvas.width - 225),
    new Obstacle(canvas.width + 125), ];

  var dy = 0;
  var points = 0;
  var dx = 6;

  var airJumped = true;

  function draw() {
    playerY += dy;
    dy += 0.8;
    dx += (points * 0.001);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#133686';
    context.fillRect(playerX, playerY, playerSize, playerSize);

    obstacles.forEach(function (obstacle) {
      obstacle.updatePos(dx);
      obstacle.draw();
      if (obstacle.x + obstacle.width <= 0) { // Checks if obstacle has exited canvas
        obstacle.updatePos(-(canvas.width + obstacle.width));
      }

      checkInside(obstacle);
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
    context.font = '60px Helvetica Neue';
    context.textAlign = 'center';
    context.fillStyle = '#aaa';
    context.fillText('Du tapte.', canvas.width / 2, canvas.height / 2);
    tapt = true;

    // reintroduces listeners so that click to start is enabled
    document.addEventListener('mousedown', startClickHandler, false);
    document.addEventListener('touchstart', startClickHandler, false);
  }

  // Checks if player is inside obstacle, and adds point if obstacle is passed
  function checkInside(obstacle) {
    if (obstacle.x <= playerX + playerSize &&
        obstacle.x >= playerX - obstacle.width) {
      obstacle.inside = true;
      if (playerY + playerSize >= canvas.height - obstacle.height) {
        lose();
      }
    } else if (obstacle.inside === true) {
      obstacle.inside = false;
      points += 1;
    }
  }

  function drawPoints() {
    if (points > highscore) {
      highscore = points;
    }

    context.fillStyle = '#666';
    context.font = '32px Helvetica Neue';
    context.textAlign = 'center';
    context.fillText(points, 80, 80);
    context.fillStyle = '#aaa';
    context.fillText(highscore, canvas.width - 80, 80);
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
      context.fillStyle = '#aaa';
      context.fillRect(this.x, canvas.height - this.height, this.width,
          this.height);
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

document.addEventListener('mousedown', startClickHandler, false);
document.addEventListener('touchstart', startClickHandler, false);
