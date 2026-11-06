
/* =========================================
   PRIMAL VOID
   Main Game Engine - Version 0.1
========================================= */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const gameUI = document.getElementById("game-ui");
const encounterMessage = document.getElementById("encounter-message");

// GAME SETTINGS
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const TILE_SIZE = 40;

const WORLD_COLS = GAME_WIDTH / TILE_SIZE;
const WORLD_ROWS = GAME_HEIGHT / TILE_SIZE;

// GAME STATE
let gameRunning = false;
let lastFrameTime = 0;

// PLAYER
const player = {
    x: 400,
    y: 300,
    width: 24,
    height: 30,
    speed: 180,
    color: "#e5d8ff"
};

// INPUT
const keys = {};

window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
        .includes(key)
    ) {
        event.preventDefault();
    }

    keys[key] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// WORLD
const world = [];

function generateWorld() {
    world.length = 0;

    for (let row = 0; row < WORLD_ROWS; row++) {
        const worldRow = [];

        for (let col = 0; col < WORLD_COLS; col++) {
            worldRow.push(0);
        }

        world.push(worldRow);
    }

    // Decorative obstacles
    const obstacles = [
        [3, 3], [4, 3], [3, 4],
        [12, 3], [13, 3], [13, 4],
        [5, 10], [6, 10], [5, 11],
        [14, 10], [15, 10], [15, 11],
        [9, 6], [10, 6]
    ];

    obstacles.forEach(([col, row]) => {
        world[row][col] = 1;
    });
}

// DRAW WORLD
function drawWorld() {
    for (let row = 0; row < WORLD_ROWS; row++) {
        for (let col = 0; col < WORLD_COLS; col++) {

            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            // Grass
            ctx.fillStyle =
                (row + col) % 2 === 0
                    ? "#28553d"
                    : "#315f43";

            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

            // Small grass details
            ctx.fillStyle = "#477b50";

            if ((row * 7 + col * 3) % 5 === 0) {
                ctx.fillRect(x + 8, y + 10, 3, 3);
                ctx.fillRect(x + 25, y + 26, 3, 3);
            }

            // Obstacles
            if (world[row][col] === 1) {
                drawTree(x, y);
            }
        }
    }
}

// DRAW TREES
function drawTree(x, y) {
    // Tree trunk
    ctx.fillStyle = "#68442e";
    ctx.fillRect(x + 15, y + 19, 10, 17);

    // Leaves
    ctx.fillStyle = "#173d30";
    ctx.fillRect(x + 5, y + 7, 30, 24);

    ctx.fillStyle = "#246343";
    ctx.fillRect(x + 10, y + 2, 20, 23);

    ctx.fillStyle = "#368050";
    ctx.fillRect(x + 14, y + 6, 8, 8);
}

// DRAW PLAYER
function drawPlayer() {
    const x = Math.round(player.x);
    const y = Math.round(player.y);

    // Shadow
    ctx.fillStyle = "#14251d";
    ctx.fillRect(x + 3, y + 25, 20, 5);

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
    ctx.fillRect(x + 8, y + 5, 2, 2);
    ctx.fillRect(x + 15, y + 5, 2, 2);

    // Legs
    ctx.fillStyle = "#34304d";
    ctx.fillRect(x + 5, y + 24, 6, 6);
    ctx.fillRect(x + 14, y + 24, 6, 6);
}

// COLLISION
function isBlocked(x, y) {
    const left = Math.floor(x / TILE_SIZE);
    const right = Math.floor(
        (x + player.width - 1) / TILE_SIZE
    );

    const top = Math.floor(y / TILE_SIZE);
    const bottom = Math.floor(
        (y + player.height - 1) / TILE_SIZE
    );

    if (
        left < 0 ||
        right >= WORLD_COLS ||
        top < 0 ||
        bottom >= WORLD_ROWS
    ) {
        return true;
    }

    for (let row = top; row <= bottom; row++) {
        for (let col = left; col <= right; col++) {
            if (world[row][col] === 1) {
                return true;
            }
        }
    }

    return false;
}

// PLAYER MOVEMENT
function updatePlayer(deltaTime) {
    let moveX = 0;
    let moveY = 0;

    if (keys["w"] || keys["arrowup"]) moveY -= 1;
    if (keys["s"] || keys["arrowdown"]) moveY += 1;
    if (keys["a"] || keys["arrowleft"]) moveX -= 1;
    if (keys["d"] || keys["arrowright"]) moveX += 1;

    // Prevent diagonal movement from being faster
    const length = Math.hypot(moveX, moveY);

    if (length > 0) {
        moveX /= length;
        moveY /= length;
    }

    const distance = player.speed * deltaTime;

    const nextX = player.x + moveX * distance;
    const nextY = player.y + moveY * distance;

    // Check horizontal and vertical movement separately
    if (!isBlocked(nextX, player.y)) {
        player.x = nextX;
    }

    if (!isBlocked(player.x, nextY)) {
        player.y = nextY;
    }
}

// RENDER GAME
function render() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawWorld();
    drawPlayer();
}

// GAME LOOP
function gameLoop(timestamp) {
    if (!gameRunning) return;

    const deltaTime = Math.min(
        (timestamp - lastFrameTime) / 1000,
        0.05
    );

    lastFrameTime = timestamp;

    updatePlayer(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

// START GAME
function startGame() {
    if (gameRunning) return;

    gameRunning = true;

    titleScreen.style.display = "none";
    canvas.style.display = "block";
    gameUI.style.display = "block";

    generateWorld();

    player.x = 400;
    player.y = 300;

    encounterMessage.textContent =
        "You have entered the Unknown Region.";

    lastFrameTime = performance.now();

    requestAnimationFrame(gameLoop);
}

// START BUTTON
startButton.addEventListener("click", startGame);
