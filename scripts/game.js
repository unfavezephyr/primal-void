
/* =========================================
   PRIMAL VOID
   MAIN GAME ENGINE - VERSION 0.2
========================================= */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const gameUI = document.getElementById("game-ui");
const encounterMessage = document.getElementById("encounter-message");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const TILE_SIZE = 40;

const WORLD_COLS = GAME_WIDTH / TILE_SIZE;
const WORLD_ROWS = GAME_HEIGHT / TILE_SIZE;

let gameRunning = false;
let lastFrameTime = 0;

const keys = {};

const world = [];

// KEYBOARD INPUT
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

// WORLD GENERATION
function generateWorld() {

    world.length = 0;

    for (let row = 0; row < WORLD_ROWS; row++) {

        const worldRow = [];

        for (let col = 0; col < WORLD_COLS; col++) {
            worldRow.push(0);
        }

        world.push(worldRow);
    }

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

            ctx.fillStyle =
                (row + col) % 2 === 0
                    ? "#28553d"
                    : "#315f43";

            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

            ctx.fillStyle = "#477b50";

            if ((row * 7 + col * 3) % 5 === 0) {
                ctx.fillRect(x + 8, y + 10, 3, 3);
                ctx.fillRect(x + 25, y + 26, 3, 3);
            }

            if (world[row][col] === 1) {
                drawTree(x, y);
            }
        }
    }
}

// DRAW TREES
function drawTree(x, y) {

    ctx.fillStyle = "#68442e";
    ctx.fillRect(x + 15, y + 19, 10, 17);

    ctx.fillStyle = "#173d30";
    ctx.fillRect(x + 5, y + 7, 30, 24);

    ctx.fillStyle = "#246343";
    ctx.fillRect(x + 10, y + 2, 20, 23);

    ctx.fillStyle = "#368050";
    ctx.fillRect(x + 14, y + 6, 8, 8);
}

// COLLISION DETECTION
function isBlocked(x, y) {

    const player = Player.state;

    const left = Math.floor(x / TILE_SIZE);

    const right = Math.floor(
        (x + player.width - 1) / TILE_SIZE
    );

    const top = Math.floor(y / TILE_SIZE);

    const bottom = Math.floor(
        (y + player.height - 1) / TILE_SIZE
    );

    // World boundaries
    if (
        left < 0 ||
        right >= WORLD_COLS ||
        top < 0 ||
        bottom >= WORLD_ROWS
    ) {
        return true;
    }

    // Obstacle collision
    for (let row = top; row <= bottom; row++) {

        for (let col = left; col <= right; col++) {

            if (world[row][col] === 1) {
                return true;
            }
        }
    }

    return false;
}

// UPDATE GAME
function update(deltaTime) {

    Player.update(deltaTime, keys, isBlocked);
}

// RENDER GAME
function render() {

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawWorld();

    Player.draw(ctx);
}

// MAIN GAME LOOP
function gameLoop(timestamp) {

    if (!gameRunning) return;

    const deltaTime = Math.min(
        (timestamp - lastFrameTime) / 1000,
        0.05
    );

    lastFrameTime = timestamp;

    update(deltaTime);

    render();

    requestAnimationFrame(gameLoop);
}

// START GAME
function startGame() {

    if (gameRunning) return;

    generateWorld();

    Player.reset(400, 300);

    gameRunning = true;

    titleScreen.style.display = "none";
    canvas.style.display = "block";
    gameUI.style.display = "block";

    encounterMessage.textContent =
        "You have entered the Unknown Region.";

    lastFrameTime = performance.now();

    requestAnimationFrame(gameLoop);
}

// START BUTTON
startButton.addEventListener("click", startGame);
