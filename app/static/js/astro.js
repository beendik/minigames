const canvas = document.querySelector('.game');
const context = canvas.getContext('2d');

function play() {
    let player = new Player(canvas.width / 2, canvas.height / 2);
    let projectiles = [];
    let enemies = [new Enemy(canvas.width / 2, canvas.height / 5, player)];
    let left, right, up, down;
    let mousePos = {
        x: 0,
        y: 0
    };
    let gameOver = false;

    document.addEventListener("keydown", function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) left = true;
        if (e.keyCode === 38 || e.keyCode === 87) up = true;
        if (e.keyCode === 39 || e.keyCode === 68) right = true;
        if (e.keyCode === 40 || e.keyCode === 83) down = true;
    });

    document.addEventListener("keyup", function (e) {
        if (e.keyCode === 37 || e.keyCode === 65) left = false;
        if (e.keyCode === 38 || e.keyCode === 87) up = false;
        if (e.keyCode === 39 || e.keyCode === 68) right = false;
        if (e.keyCode === 40 || e.keyCode === 83) down = false;
    });

    document.addEventListener("mousemove", function (e) {
        mousePos = getRelativeMousePos(e)
    });

    document.addEventListener("mousedown", function () {
        projectiles.push(player.shoot());
    });

    function draw() {
        // Main action loop
        context.clearRect(0, 0, canvas.width, canvas.height);

        player.updatePos();
        player.draw();
        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].updatePos();
            projectiles[i].draw();
            // Remove out-of-bounds projectiles
            if (projectiles[i].outOfBounds()) {
                projectiles.splice(i, 1);
            }
        }
        for (let j = 0; j < enemies.length; j++) {
            enemies[j].updatePos();
            enemies[j].draw();

            // Game over?
            if (enemies[j].isHitBy(player)) {
                gameOver = true;
            }
            // Hit enemies
            for (let k = 0; k < projectiles.length; k++) {
                if (enemies[j].isHitBy(projectiles[k])) {
                    enemies[j].die();
                    enemies.splice(j, 1);
                    projectiles.splice(k, 1);
                    break; // If enemy is hit by projectile, it can't be hit by another
                }
            }
        }
        if (gameOver) {
            context.font = '60px Helvetica Neue';
            context.textAlign = 'center';
            context.fillStyle = '#aaa';
            context.fillText('Du tapte.', canvas.width / 2, canvas.height / 2);
            //console.log(player.x, player.y);
            return;
        }
        window.requestAnimationFrame(draw);
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

        this.size = 12;
        this.color = "#ff1f6d";

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
            context.fillStyle = this.color;
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

        this.shoot = function () {
            return new Projectile(this.x, this.y, mousePos.x, mousePos.y);
        };
    }


    function Projectile(x, y, aimX, aimY) {
        this.x = x;
        this.y = y;
        this.velocity = 5;

        this.color = "#1ec6c6";
        this.size = 5;

        // Calculate directional speed
        let abs = Math.sqrt(Math.pow((this.x - aimX), 2) + Math.pow((this.y - aimY), 2));
        this.dx = ((aimX - this.x) * this.velocity) / abs;
        this.dy = ((aimY - this.y) * this.velocity) / abs;

        this.updatePos = function () {
            this.x += this.dx;
            this.y += this.dy;
        };

        this.draw = function () {
            context.save();
            context.fillStyle = this.color;
            context.fillRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size);
            context.restore();
        };

        this.outOfBounds = function () {
            return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
        };
    }

    function Enemy(x, y, target) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.velocity = 1;

        this.target = target;
        this.size = 15;
        this.color = "#1dc644";

        this.updatePos = function () {

            // Calculate directional speed
            let abs = Math.sqrt(Math.pow((this.x - this.target.x), 2) + Math.pow((this.y - this.target.y), 2));
            this.dx = ((this.target.x - this.x) * this.velocity) / abs;
            this.dy = ((this.target.y - this.y) * this.velocity) / abs;

            // Update position according to speed
            this.x += this.dx;
            this.y += this.dy;
        };

        this.draw = function () {
            context.save();
            context.fillStyle = this.color;
            // Rotate toward player position
            context.translate(this.x, this.y);
            context.rotate(getAngle(this.x, this.y, this.target.x, this.target.y) + (Math.PI / 4));

            context.fillRect(-(this.size / 2), -(this.size / 2), this.size, this.size);
            context.restore();
        };

        this.isHitBy = function (object) {
            let dist = Math.sqrt(Math.pow((this.x - object.x), 2) + Math.pow((this.y - object.y), 2));
            return dist <= 12;
        };

        this.die = function () {
            const radius = 15;
            let randx = (Math.random() + 1) * radius;
            let randy = (Math.random() + 1) * radius;
            enemies.push(new Enemy(this.x + randx, this.y + randy, player));
            enemies.push(new Enemy(this.x - randx, this.y - randy, player))
        }
    }

    function getRelativeMousePos(e) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function getAngle(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        return Math.atan2(dx, -dy) // Negative because canvas uses a negative y axis,
                                   // while atan2 uses a positive one (think unit circle)
    }
}
