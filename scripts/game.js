
/* =========================================
   PRIMAL VOID
   MAIN GAME ENGINE - VERSION 0.4
========================================= */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const titleScreen = document.getElementById("title-screen");
const startButton = document.getElementById("start-button");
const gameUI = document.getElementById("game-ui");
const encounterMessage = document.getElementById("encounter-message");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let gameRunning = false;
let lastFrameTime = 0;

const keys = {};

const camera = {
    x: 0,
    y: 0
};

// KEYBOARD INPUT
window.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "]
        .includes(key)
    ) {
        event.preventDefault();
    }

    keys[key] = true;
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});

// COLLISION
function isBlocked(x, y) {
    const player = Player.state;

    return World.isBlocked(
        x,
        y,
        player.width,
        player.height
    );
}

// CAMERA
function updateCamera() {
    const player = Player.state;
    const dimensions = World.getDimensions();

    camera.x = player.x + player.width / 2 - GAME_WIDTH / 2;
    camera.y = player.y + player.height / 2 - GAME_HEIGHT / 2;

    camera.x = Math.max(
        0,
        Math.min(camera.x, dimensions.width - GAME_WIDTH)
    );

    camera.y = Math.max(
        0,
        Math.min(camera.y, dimensions.height - GAME_HEIGHT)
    );
}

// UPDATE
function update(deltaTime) {

    Player.update(deltaTime, keys, isBlocked);

    const message = Interactions.update(
        Player.state,
        keys
    );

    if (encounterMessage) {
        encounterMessage.textContent = message ||
            "Explore the mysterious world.";
    }

    updateCamera();
}

// RENDER
function render() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    World.draw(ctx, camera);

    Environment.draw(ctx, camera, performance.now());

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    Player.draw(ctx);

    ctx.restore();
}

// GAME LOOP
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

    World.generate();

    Player.reset(400, 300);

      Interactions.initialize();
    Journal.initialize();
    JournalUI.initialize();
    
updateCamera();

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
