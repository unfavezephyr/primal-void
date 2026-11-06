
/* =========================================
   PRIMAL VOID
   PLAYER SYSTEM - VERSION 0.3
   Directional movement + visible animation
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

    const ANIMATION_SPEED = 0.16;

    // RESET PLAYER
    function reset(x = 400, y = 300) {
        player.x = x;
        player.y = y;

        player.direction = "down";
        player.moving = false;

        player.animationFrame = 0;
        player.animationTimer = 0;
    }

    // UPDATE PLAYER
    function update(deltaTime, keys, isBlocked) {

        let moveX = 0;
        let moveY = 0;

        if (keys["a"] || keys["arrowleft"]) moveX -= 1;
        if (keys["d"] || keys["arrowright"]) moveX += 1;
        if (keys["w"] || keys["arrowup"]) moveY -= 1;
        if (keys["s"] || keys["arrowdown"]) moveY += 1;

        // Determine facing direction using dominant movement axis
        if (moveX !== 0 || moveY !== 0) {
            if (Math.abs(moveX) > Math.abs(moveY)) {
                player.direction = moveX < 0 ? "left" : "right";
            } else {
                player.direction = moveY < 0 ? "up" : "down";
            }
        }

        const length = Math.hypot(moveX, moveY);

        player.moving = length > 0;

        if (player.moving) {

            moveX /= length;
            moveY /= length;

            const distance = player.speed * deltaTime;

            const nextX = player.x + moveX * distance;
            const nextY = player.y + moveY * distance;

            if (!isBlocked(nextX, player.y)) {
                player.x = nextX;
            }

            if (!isBlocked(player.x, nextY)) {
                player.y = nextY;
            }

            // Visible walking animation
            player.animationTimer += deltaTime;

            if (player.animationTimer >= ANIMATION_SPEED) {
                player.animationFrame =
                    (player.animationFrame + 1) % 2;

                player.animationTimer = 0;
            }

        } else {

            player.animationFrame = 0;
            player.animationTimer = 0;
        }
    }

    // DRAW PLAYER
    function draw(ctx) {

        const x = Math.round(player.x);
        const y = Math.round(player.y);

        const frame = player.moving
            ? player.animationFrame
            : 0;

        // Body bob during walking
        const bob = player.moving && frame === 1 ? -2 : 0;

        // Shadow
        ctx.fillStyle = "#14251d";
        ctx.fillRect(x + 3, y + 26, 20, 4);

        // LEGS
        ctx.fillStyle = "#34304d";

        if (frame === 0) {
            ctx.fillRect(x + 4, y + 24 + bob, 7, 6);
            ctx.fillRect(x + 14, y + 24 + bob, 7, 6);
        } else {
            ctx.fillRect(x + 1, y + 24 + bob, 8, 5);
            ctx.fillRect(x + 16, y + 24 + bob, 8, 5);
        }

        // BODY
        ctx.fillStyle = player.color;
        ctx.fillRect(x + 4, y + 9 + bob, 16, 16);

        // ARMS
        ctx.fillStyle = "#bba4ed";

        if (frame === 0) {
            ctx.fillRect(x + 1, y + 12 + bob, 4, 10);
            ctx.fillRect(x + 19, y + 12 + bob, 4, 10);
        } else {
            ctx.fillRect(x + 1, y + 10 + bob, 4, 10);
            ctx.fillRect(x + 19, y + 14 + bob, 4, 10);
        }

        // HEAD
        ctx.fillStyle = "#f1d5b8";
        ctx.fillRect(x + 5, y + bob, 14, 13);

        // HAIR
        ctx.fillStyle = "#392d50";

        if (player.direction === "up") {

            // Back of head
            ctx.fillRect(x + 4, y - 2 + bob, 16, 9);
            ctx.fillRect(x + 3, y + 4 + bob, 18, 5);

        } else if (player.direction === "left") {

            // Side-facing hairstyle
            ctx.fillRect(x + 4, y - 2 + bob, 15, 5);
            ctx.fillRect(x + 4, y + 2 + bob, 5, 8);

        } else if (player.direction === "right") {

            ctx.fillRect(x + 5, y - 2 + bob, 15, 5);
            ctx.fillRect(x + 15, y + 2 + bob, 5, 8);

        } else {

            // Front-facing hairstyle
            ctx.fillRect(x + 4, y - 2 + bob, 16, 5);
            ctx.fillRect(x + 3, y + 2 + bob, 4, 5);
            ctx.fillRect(x + 17, y + 2 + bob, 4, 5);
        }

        // FACE DETAILS
        ctx.fillStyle = "#292038";

        if (player.direction === "down") {

            ctx.fillRect(x + 8, y + 6 + bob, 2, 2);
            ctx.fillRect(x + 15, y + 6 + bob, 2, 2);

            ctx.fillStyle = "#bd827b";
            ctx.fillRect(x + 11, y + 10 + bob, 3, 1);

        } else if (player.direction === "left") {

            ctx.fillRect(x + 6, y + 6 + bob, 2, 2);

        } else if (player.direction === "right") {

            ctx.fillRect(x + 17, y + 6 + bob, 2, 2);
        }

        // UP: no eyes visible because we see the back
    }

    return {
        state: player,
        update,
        draw,
        reset
    };

})();
