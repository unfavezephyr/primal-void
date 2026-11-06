
const World = (() => {
    const TILE_SIZE = 40;
    const COLS = 40;
    const ROWS = 30;

    let map = [];
    let decorations = [];

    // Generate the world
    function generate() {
        map = [];
        decorations = [];

        for (let y = 0; y < ROWS; y++) {
            const row = [];

            for (let x = 0; x < COLS; x++) {
                row.push(0);
            }

            map.push(row);
        }

        // Trees
        const trees = [
            [5, 5], [6, 5], [5, 6],
            [14, 8], [15, 8], [15, 9],
            [25, 5], [26, 5], [25, 6],
            [32, 12], [33, 12], [33, 13],
            [8, 20], [9, 20], [8, 21],
            [20, 23], [21, 23], [21, 24],
            [30, 25], [31, 25], [30, 26]
        ];

        trees.forEach(([x, y]) => {
            setTile(x, y, 1);
        });

        // Water pools
        const waterAreas = [
            { x: 12, y: 17, width: 4, height: 3 },
            { x: 26, y: 18, width: 5, height: 3 },
            { x: 35, y: 5, width: 3, height: 4 }
        ];

        waterAreas.forEach(area => {
            for (let y = area.y; y < area.y + area.height; y++) {
                for (let x = area.x; x < area.x + area.width; x++) {
                    setTile(x, y, 2);
                }
            }
        });

        // Decorative flowers and rocks
        decorations = [
            { x: 3, y: 4, type: "flower", color: "#f4b5d4" },
            { x: 9, y: 8, type: "flower", color: "#f5e88a" },
            { x: 18, y: 5, type: "flower", color: "#c9a7ff" },
            { x: 22, y: 13, type: "flower", color: "#f4b5d4" },
            { x: 7, y: 15, type: "flower", color: "#f5e88a" },
            { x: 18, y: 18, type: "flower", color: "#c9a7ff" },
            { x: 34, y: 20, type: "flower", color: "#f4b5d4" },

            { x: 10, y: 11, type: "rock" },
            { x: 22, y: 7, type: "rock" },
            { x: 18, y: 27, type: "rock" },
            { x: 35, y: 15, type: "rock" }
        ];
    }

    function setTile(x, y, value) {
        if (map[y] && map[y][x] !== undefined) {
            map[y][x] = value;
        }
    }

    // Draw the visible part of the world
    function draw(ctx, camera) {
        const startX = Math.floor(camera.x / TILE_SIZE);
        const startY = Math.floor(camera.y / TILE_SIZE);

        const endX = Math.ceil(
            (camera.x + ctx.canvas.width) / TILE_SIZE
        );

        const endY = Math.ceil(
            (camera.y + ctx.canvas.height) / TILE_SIZE
        );

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                if (!map[y] || map[y][x] === undefined) {
                    continue;
                }

                const screenX = x * TILE_SIZE - camera.x;
                const screenY = y * TILE_SIZE - camera.y;

                drawGround(ctx, screenX, screenY, x, y);

                if (map[y][x] === 1) {
                    drawTree(ctx, screenX, screenY);
                }

                if (map[y][x] === 2) {
                    drawWater(ctx, screenX, screenY);
                }
            }
        }

        drawDecorations(ctx, camera);
    }

    // Grass ground
    function drawGround(ctx, x, y, tileX, tileY) {
        const variation = (tileX * 7 + tileY * 13) % 4;

        const grassColors = [
            "#397b45",
            "#34723f",
            "#3d8049",
            "#367743"
        ];

        ctx.fillStyle = grassColors[variation];
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        // Tiny grass details
        if ((tileX + tileY) % 3 === 0) {
            ctx.fillStyle = "#57965a";
            ctx.fillRect(x + 8, y + 12, 3, 5);
            ctx.fillRect(x + 27, y + 29, 3, 4);
        }
    }

    // Trees
    function drawTree(ctx, x, y) {
        // Shadow
        ctx.fillStyle = "rgba(20, 40, 20, 0.25)";
        ctx.fillRect(x + 5, y + 29, 32, 8);

        // Trunk
        ctx.fillStyle = "#79502e";
        ctx.fillRect(x + 16, y + 19, 9, 18);

        // Leaves
        ctx.fillStyle = "#205c37";
        ctx.fillRect(x + 5, y + 8, 30, 23);

        ctx.fillStyle = "#287344";
        ctx.fillRect(x + 9, y + 3, 23, 24);

        ctx.fillStyle = "#398b4d";
        ctx.fillRect(x + 13, y + 6, 15, 13);

        ctx.fillStyle = "#50a45c";
        ctx.fillRect(x + 13, y + 7, 6, 5);
    }

    // Water
    function drawWater(ctx, x, y) {
        ctx.fillStyle = "#286b91";
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

        ctx.fillStyle = "#368db1";
        ctx.fillRect(x + 4, y + 8, 15, 3);
        ctx.fillRect(x + 22, y + 25, 12, 3);

        ctx.fillStyle = "#72c6d4";
        ctx.fillRect(x + 8, y + 9, 5, 2);
        ctx.fillRect(x + 25, y + 26, 5, 2);
    }

    // Flowers and rocks
    function drawDecorations(ctx, camera) {
        decorations.forEach(item => {
            const x = item.x * TILE_SIZE - camera.x;
            const y = item.y * TILE_SIZE - camera.y;

            if (x < -TILE_SIZE || y < -TILE_SIZE ||
                x > ctx.canvas.width || y > ctx.canvas.height) {
                return;
            }

            if (item.type === "flower") {
                ctx.fillStyle = "#287344";
                ctx.fillRect(x + 19, y + 18, 3, 12);

                ctx.fillStyle = item.color;
                ctx.fillRect(x + 13, y + 12, 7, 7);
                ctx.fillRect(x + 21, y + 12, 7, 7);
                ctx.fillRect(x + 17, y + 8, 7, 7);
                ctx.fillRect(x + 17, y + 17, 7, 7);

                ctx.fillStyle = "#f8e47a";
                ctx.fillRect(x + 18, y + 15, 5, 5);
            }

            if (item.type === "rock") {
                ctx.fillStyle = "#777c89";
                ctx.fillRect(x + 9, y + 17, 22, 15);

                ctx.fillStyle = "#a4a9b5";
                ctx.fillRect(x + 13, y + 13, 14, 14);

                ctx.fillStyle = "#c5c9d1";
                ctx.fillRect(x + 15, y + 15, 6, 4);
            }
        });
    }

    // Collision detection
    function isBlocked(x, y, width, height) {
        const points = [
            [x, y],
            [x + width - 1, y],
            [x, y + height - 1],
            [x + width - 1, y + height - 1]
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

            const tile = map[tileY][tileX];

            // Trees and water block movement
            if (tile === 1 || tile === 2) {
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
