var canvas = document.querySelector('.game');
var context = canvas.getContext('2d');

var highScore = 0;
var lost = false;

function flap() {
  document.querySelector('.play').blur(); // fokus på knapp gjør spacebar vanskelig
  lost = false;
  document.removeEventListener('mousedown', startClickHandler);
  document.removeEventListener('touchstart', startClickHandler);

  var playerSize = 20;
  var playerX = 350 - playerSize / 2;
  var playerY = canvas.height - playerSize;

  var obstacles = [
    new Obstacle(canvas.width + 100),
    new Obstacle(canvas.width + 650),
  ];

  var dy = 0;
  var points = 0;
  var dx = 9;
  var backwards = false;
  var turnToggle = false; // used to ensure that direction change only happens once per point change

  var airJumped = true;

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    playerY += dy;
    dy += 1.4;
    if (!((points + 1) % 10) && turnToggle) {
      dx = -dx;
      backwards = !backwards;
      turnToggle = false;
    }

    drawPlayer();

    obstacles.forEach(function(obstacle) {
      obstacle.updatePos(dx);
      obstacle.draw();
      if (obstacle.x + obstacle.width <= 0 && !backwards) { // Checks if obstacle has exited canvas
        obstacle.width = 40 + Math.floor(Math.random() * 40);
        obstacle.height = 10 + Math.floor(Math.random() * 170);
        obstacle.updatePos(-(canvas.width + obstacle.width + 350));
      } else if (obstacle.x >= canvas.width && backwards) {
        obstacle.width = 40 + Math.floor(Math.random() * 40);
        obstacle.height = 10 + Math.floor(Math.random() * 170);
        obstacle.updatePos((canvas.width + obstacle.width + 350));
      }
      checkInside(obstacle);
    });

    drawPoints();

    if (playerY + playerSize >= canvas.height) {
      dy = 0;
      playerY = canvas.height - playerSize;
      airJumped = false;
    }

    if (!lost) {
      requestAnimationFrame(draw);
    }
  }

  function lose() {
    context.font = '60px Helvetica Neue';
    context.textAlign = 'center';
    context.fillStyle = '#aaa';
    context.fillText('Du tapte.', canvas.width / 2, canvas.height / 2);
    lost = true;

    // reintroduces listeners so that click to start is enabled
    document.addEventListener('mousedown', startClickHandler, false);
    document.addEventListener('touchstart', startClickHandler, false);
  }

  // Checks if player is inside obstacle, and adds point if obstacle is passed
  function checkInside(obstacle) {
    if (obstacle.x <= playerX + playerSize &&
        obstacle.x >= playerX - obstacle.width) {
      obstacle.inside = true;
      if (playerY + playerSize >= canvas.height - obstacle.height &&
          !isGracePeriod(points)) {
        lose();
      }
    } else if (obstacle.inside === true) {
      obstacle.inside = false;
      points += 1;
      turnToggle = true;

      // Increase speed if added point
      if (!backwards) {
        dx += 0.1;
        // dx += 0.002 * Math.log(points + 5);
      } else {
        // dx -= 0.002 * Math.log(points + 5);
        dx -= 0.1;
      }

    }
  }

  function drawPoints() {
    if (points > highScore) {
      highScore = points;
    }

    context.fillStyle = '#666';
    context.font = '32px Helvetica Neue';
    context.textAlign = 'center';
    context.fillText(String(points), 80, 80);
    context.fillStyle = '#aaa';
    context.fillText(String(highScore), canvas.width - 80, 80);

  }

  function drawPlayer() {
    context.fillStyle = '#133686';
    context.fillRect(playerX, playerY, playerSize, playerSize);
  }

  function clickHandler(event) {
    if (isTouchDevice() && event.type === 'mousedown') {
      return;
    }

    if (event.type === 'keydown') {
      if (event.keyCode === 82) {
        flap();
      }  // r for reset
      else if (event.keyCode !== 32) { // spacebar
        return;
      }
    }

    if (playerY === canvas.height - playerSize) {
      dy = -25;
    } else if (!airJumped) {
      dy = -19;
      airJumped = true;
    }

    if (lost) {
      if (event.target === canvas) {
        flap();
      }
    }

    lost = false;
  }

  function Obstacle(x) {
    this.x = x;
    this.width = 40 + Math.floor(Math.random() * 40);
    this.height = 10 + Math.floor(Math.random() * 130);
    this.inside = false;

    this.updatePos = function(dx) {
      this.x -= dx;
    };

    this.draw = function() {
      context.fillStyle = '#aaa';
      if (isGracePeriod(points)) {
        context.fillStyle = '#133686';
        context.fillText('Grace', canvas.width / 2, canvas.height / 2);
        context.fillStyle = '#bff2e8';
      }

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
    flap();
  }
}

document.addEventListener('mousedown', startClickHandler, false);
document.addEventListener('touchstart', startClickHandler, false);
