
/* =========================================
   PRIMAL VOID
   PLAYER SYSTEM - VERSION 0.2
========================================= */

const Player = (() => {

    const player = {
        x: 400,
        y: 300,

        width: 24,
        height: 30,

        speed: 180,

        direction: "down",
        moving: false,

        animationFrame: 0,
        animationTimer: 0,

        color: "#e5d8ff"
    };

    const animationSpeed = 0.15;

    // Reset player position and animation
    function reset(x = 400, y = 300) {
        player.x = x;
        player.y = y;

        player.direction = "down";
        player.moving = false;

        player.animationFrame = 0;
        player.animationTimer = 0;
    }

    // Update player movement
    function update(deltaTime, keys, isBlocked) {

        let moveX = 0;
        let moveY = 0;

        if (keys["w"] || keys["arrowup"]) {
            moveY -= 1;
            player.direction = "up";
        }

        if (keys["s"] || keys["arrowdown"]) {
            moveY += 1;
            player.direction = "down";
        }

        if (keys["a"] || keys["arrowleft"]) {
            moveX -= 1;
            player.direction = "left";
        }

        if (keys["d"] || keys["arrowright"]) {
            moveX += 1;
            player.direction = "right";
        }

        const length = Math.hypot(moveX, moveY);

        player.moving = length > 0;

        if (player.moving) {
            moveX /= length;
            moveY /= length;

            const distance = player.speed * deltaTime;

            const nextX = player.x + moveX * distance;
            const nextY = player.y + moveY * distance;

            // Horizontal collision
            if (!isBlocked(nextX, player.y)) {
                player.x = nextX;
            }

            // Vertical collision
            if (!isBlocked(player.x, nextY)) {
                player.y = nextY;
            }

            // Walking animation
            player.animationTimer += deltaTime;

            if (player.animationTimer >= animationSpeed) {
                player.animationFrame =
                    (player.animationFrame + 1) % 2;

                player.animationTimer = 0;
            }

        } else {
            player.animationFrame = 0;
            player.animationTimer = 0;
        }
    }

    // Draw player
    function draw(ctx) {

        const x = Math.round(player.x);
        const y = Math.round(player.y);

        const step = player.moving
            ? player.animationFrame
            : 0;

        // Shadow
        ctx.fillStyle = "#14251d";
        ctx.fillRect(x + 3, y + 25, 20, 5);

        // Legs
        ctx.fillStyle = "#34304d";

        if (step === 0) {
            ctx.fillRect(x + 5, y + 24, 6, 6);
            ctx.fillRect(x + 14, y + 24, 6, 6);
        } else {
            ctx.fillRect(x + 3, y + 24, 7, 6);
            ctx.fillRect(x + 15, y + 24, 7, 6);
        }

        // Body
        ctx.fillStyle = player.color;
        ctx.fillRect(x + 4, y + 8, 16, 17);

        // Head
        ctx.fillStyle = "#f1d5b8";
        ctx.fillRect(x + 5, y, 14, 12);

        // Hair
        ctx.fillStyle = "#392d50";
        ctx.fillRect(x + 4, y - 2, 16, 5);

        // Eyes
        ctx.fillStyle = "#292038";

        if (player.direction === "down") {
            ctx.fillRect(x + 8, y + 5, 2, 2);
            ctx.fillRect(x + 15, y + 5, 2, 2);
        }

        if (player.direction === "left") {
            ctx.fillRect(x + 6, y + 5, 2, 2);
        }

        if (player.direction === "right") {
            ctx.fillRect(x + 17, y + 5, 2, 2);
        }
    }

    return {
        state: player,
        update,
        draw,
        reset
    };

})();
