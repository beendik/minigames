var canvas = document.querySelector('.game');
var context = canvas.getContext('2d');



var highScore = 0;
var lost = false;

function flap() {
  document.querySelector('.play').blur(); // fokus på knapp gjør spacebar vanskelig
  lost = false;
  document.removeEventListener('mousedown', startClickHandler);
  document.removeEventListener('touchstart', startClickHandler);
  document.removeEventListener('keydown', startClickHandler);

  var playerSize = 40;
  var playerX = 350 - playerSize / 2;
  var playerY = canvas.height / 20 - 100;

  var playerImage = new Image(playerSize, playerSize);
  playerImage.src = 'flappy.png';

  var obstacles = [
    new Obstacle(canvas.width + 100),
    new Obstacle(canvas.width + 650),
  ];

  var dy = -2;
  var points = 0;
  var dx = 6;
  var backwards = false;
  var turnToggle = false; // used to ensure that direction change only happens once per point change

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    playerY += dy;
    dy += 0.4;
    if (!((points + 1) % 10) && turnToggle) {
      dx = -dx;
      backwards = !backwards;
      turnToggle = false;
    }

    drawPlayer();

    obstacles.forEach(function(obstacle) {
      obstacle.updatePos(dx);
      obstacle.draw();

      if (obstacle.x + obstacle.width <= 0 && !backwards ||
          obstacle.x >= canvas.width && backwards) { // Checks if obstacle has exited canvas
        obstacle.width = 50;
        obstacle.height = 10 + Math.floor(Math.random() * 230);
        obstacle.topHeight = canvas.height - obstacle.height - Math.random() *
            50 - 100;

        if (!backwards) {
          obstacle.updatePos(-(canvas.width + obstacle.width + 350));
        } else {
          obstacle.updatePos((canvas.width + obstacle.width + 350));
        }

      }
      checkInside(obstacle);
    });

    drawPoints();

    if (playerY >= canvas.height) {
      lose();
    } else if (playerY <= 0) {
      playerY = 0;
    }

    if (!lost) {
      requestAnimationFrame(draw);
    }
  }

  function lose() {
    context.font = '60px Helvetica Neue';
    context.textAlign = 'center';
    context.fillStyle = '#666';
    context.fillText('Du tapte.', canvas.width / 2, canvas.height / 2);
    lost = true;

    // reintroduces listeners so that click to start is enabled
    document.addEventListener('mousedown', startClickHandler, false);
    document.addEventListener('touchstart', startClickHandler, false);
    document.addEventListener('keydown', startClickHandler, false);
  }

  // Checks if player is inside obstacle, and adds point if obstacle is passed
  function checkInside(obstacle) {
    if (obstacle.x <= playerX + playerSize &&
        obstacle.x >= playerX - obstacle.width) {
      obstacle.inside = true;

      // TODO: +- 5 pga unøyaktig sprite
      if ((playerY + playerSize - 5 >= canvas.height - obstacle.height ||
              playerY + 5 <=
              obstacle.topHeight) &&
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
    context.save();
    context.translate(playerX + playerSize / 2, playerY + playerSize / 2);
    if (backwards) {
      context.scale(-1, 1);
    }
    context.rotate(dy / 30);
    //  context.fillRect(-playerSize / 2, -playerSize / 2, playerSize,
    //      playerSize);
    void context.drawImage(playerImage, -playerSize / 2, -playerSize / 2,
        playerSize, playerSize);
    context.restore();
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

    dy = -8;

    if (lost) {
      if (event.target === canvas) {
        flap();
      }
    }

    lost = false;
  }

  function Obstacle(x) {
    this.x = x;
    this.width = 50;
    this.height = 10 + Math.floor(Math.random() * 230);
    this.inside = false;
    this.topHeight = canvas.height - this.height - Math.random() * 50 - 100;

    this.updatePos = function(dx) {
      this.x -= dx;
    };

    this.draw = function() {
      context.fillStyle = '#aaa';
      if (isGracePeriod(points)) {
        context.fillStyle = '#bff2e8';
      }

      context.fillRect(this.x, canvas.height - this.height, this.width,
          this.height);
      context.fillRect(this.x, 0, this.width, this.topHeight);
    };
  }

  document.addEventListener('mousedown', clickHandler, false);
  document.addEventListener('touchstart', clickHandler, false);
  document.addEventListener('keydown', clickHandler, false);

  draw();
};

function startClickHandler(event) {

  if (isTouchDevice() && event.type === 'mousedown') {
    return;
  }

  if (event.type === 'keydown') {
    if (event.keyCode == 32) { // spacebar
      flap();
    }
  }

  if (event.target === canvas) {
    flap();
  }
}

document.addEventListener('mousedown', startClickHandler, false);
document.addEventListener('touchstart', startClickHandler, false);
document.addEventListener('keydown', startClickHandler, false);
