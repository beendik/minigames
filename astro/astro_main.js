var canvas = document.querySelector('.game');
var context = canvas.getContext('2d');

function play() {
    var player = new Player(canvas.width / 2, canvas.height / 2);
    var LEFT, RIGHT, UP, DOWN;

    document.onkeydown = function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) LEFT = true;
        if (e.keyCode === 38 || e.keyCode === 87) UP = true;
        if (e.keyCode === 39 || e.keyCode === 68) RIGHT = true;
        if (e.keyCode === 40 || e.keyCode === 83) DOWN = true;
    };

    document.onkeyup = function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) LEFT = false;
        if (e.keyCode === 38 || e.keyCode === 87) UP = false;
        if (e.keyCode === 39 || e.keyCode === 68) RIGHT = false;
        if (e.keyCode === 40 || e.keyCode === 83) DOWN = false;
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        player.updatePos();
        player.draw();
        window.requestAnimationFrame(draw)
    }

    window.requestAnimationFrame(draw);

    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.acceleration = 0.5;
        this.drag_coefficient = 0.02;

        this.updatePos = function () {
            if (LEFT) {
                this.dx -= this.acceleration;
            }
            if (RIGHT) {
                this.dx += this.acceleration;
            }
            if (UP) {
                this.dy -= this.acceleration;
            }
            if (DOWN) {
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
            context.rotate(Math.PI / 4);
            context.fillRect(0, 0, 10, 10);
            context.restore();
        };
    }

    function Projectile(owner, x, y, speed) {
        this.owner = owner;
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
}
