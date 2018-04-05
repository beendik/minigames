var canvas = document.querySelector('.game');
var context = canvas.getContext('2d');

function play() {
    var player = new Player(canvas.width / 2, canvas.height / 2);
    var left, right, up, down;
    var mousePos = {
        x: 0,
        y: 0
    };

    document.onkeydown = function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) left = true;
        if (e.keyCode === 38 || e.keyCode === 87) up = true;
        if (e.keyCode === 39 || e.keyCode === 68) right = true;
        if (e.keyCode === 40 || e.keyCode === 83) down = true;
    };

    document.onkeyup = function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) left = false;
        if (e.keyCode === 38 || e.keyCode === 87) up = false;
        if (e.keyCode === 39 || e.keyCode === 68) right = false;
        if (e.keyCode === 40 || e.keyCode === 83) down = false;
    };

    document.onmousemove = function (e) {
        mousePos = getRelativeMousePos(e)
    };

    function draw() {
        // Main loop
        context.clearRect(0, 0, canvas.width, canvas.height);

        player.updatePos();
        player.draw();
        window.requestAnimationFrame(draw)
    }

    // Start animating
    window.requestAnimationFrame(draw);

    function Player(x, y) {
        // Position
        this.x = x;
        this.y = y;
        // Velocity
        this.dx = 0;
        this.dy = 0;
        // Acceleration constants
        this.acceleration = 0.5;
        this.drag_coefficient = 0.02;

        this.updatePos = function () {
            if (left) {
                this.dx -= this.acceleration;
            }
            if (right) {
                this.dx += this.acceleration;
            }
            if (up) {
                this.dy -= this.acceleration;
            }
            if (down) {
                this.dy += this.acceleration;
            }

            // Update position according to speed
            this.x += this.dx;
            this.y += this.dy;

            // Natural deceleration
            this.dx *= (1 - this.drag_coefficient);
            this.dy *= (1 - this.drag_coefficient);

            // Prevent the player from escaping the canvas borders
            if (this.x < 0) {
                this.x = 0;
                this.dx = 0;
            } else if (this.x > canvas.width) {
                this.x = canvas.width;
                this.dx = 0;
            }
            if (this.y < 0) {
                this.y = 0;
                this.dy = 0;
            } else if (this.y > canvas.height) {
                this.y = canvas.height;
                this.dy = 0;
            }
        };

        this.draw = function () {
            context.save();
            context.fillStyle = "#ff1f6d";
            context.translate(this.x, this.y);

            // Rotate toward mouse position
            context.rotate(getAngle(this.x, this.y, mousePos.x, mousePos.y));

            // Draw player
            context.beginPath();
            context.moveTo(0, -12);
            context.lineTo(-12, 12);
            context.lineTo(12, 12);
            context.fill();
            context.restore();
        };
    }

    function getRelativeMousePos(e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function getAngle(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;

        return Math.atan2(dx, dy) * -1 + Math.PI;
    }
}
