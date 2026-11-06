const World = (() => {
    const TILE_SIZE = 40;
    const COLS = 40;
    const ROWS = 30;

    let map = [];

    function generate() {
        map = [];

        for (let y = 0; y < ROWS; y++) {
            const row = [];

            for (let x = 0; x < COLS; x++) {
                row.push(0);
            }

            map.push(row);
        }

        // Tree clusters and obstacles
        const obstacles = [
            [5, 5], [6, 5], [5, 6],
            [14, 8], [15, 8], [15, 9],
            [25, 5], [26, 5], [25, 6],
            [32, 12], [33, 12], [33, 13],
            [8, 20], [9, 20], [8, 21],
            [20, 23], [21, 23], [21, 24],
            [30, 25], [31, 25], [30, 26]
        ];

        obstacles.forEach(([x, y]) => {
            if (map[y] && map[y][x] !== undefined) {
                map[y][x] = 1;
            }
        });
    }

    function draw(ctx, camera) {
        const startX = Math.floor(camera.x / TILE_SIZE);
        const startY = Math.floor(camera.y / TILE_SIZE);
        const endX = Math.ceil((camera.x + ctx.canvas.width) / TILE_SIZE);
        const endY = Math.ceil((camera.y + ctx.canvas.height) / TILE_SIZE);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (!map[y] || map[y][x] === undefined) continue;

                const screenX = x * TILE_SIZE - camera.x;
                const screenY = y * TILE_SIZE - camera.y;

                ctx.fillStyle = (x + y) % 2 === 0
                    ? "#397b45"
                    : "#34723f";

                ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

                if (map[y][x] === 1) {
                    drawTree(ctx, screenX, screenY);
                }
            }
        }
    }

    function drawTree(ctx, x, y) {
        ctx.fillStyle = "#68452f";
        ctx.fillRect(x + 15, y + 19, 10, 19);

        ctx.fillStyle = "#174d32";
        ctx.fillRect(x + 5, y + 5, 30, 25);

        ctx.fillStyle = "#287347";
        ctx.fillRect(x + 9, y + 2, 22, 20);

        ctx.fillStyle = "#438c53";
        ctx.fillRect(x + 13, y + 6, 8, 7);
    }

    function isBlocked(x, y, width, height) {
        const points = [
            [x, y],
            [x + width, y],
            [x, y + height],
            [x + width, y + height]
        ];

        for (const [px, py] of points) {
            const tileX = Math.floor(px / TILE_SIZE);
            const tileY = Math.floor(py / TILE_SIZE);

            if (
                tileX < 0 ||
                tileY < 0 ||
                tileX >= COLS ||
                tileY >= ROWS
            ) {
                return true;
            }

            if (map[tileY][tileX] === 1) {
                return true;
            }
        }

        return false;
    }

    function getDimensions() {
        return {
            width: COLS * TILE_SIZE,
            height: ROWS * TILE_SIZE
        };
    }

    return {
        generate,
        draw,
        isBlocked,
        getDimensions
    };
})();
