
/* =========================================
   PRIMAL VOID
   ENVIRONMENT SYSTEM - VERSION 0.2
========================================= */

const Environment = (() => {

    const TILE_SIZE = 40;

    const crystals = [
        {
            id: "crystal_001",
            name: "Violet Crystal",
            x: 7, y: 8,
            color: "#bd83ff",
            description: "A violet crystal humming with strange energy."
        },
        {
            id: "crystal_002",
            name: "Azure Crystal",
            x: 19, y: 11,
            color: "#65d9ff",
            description: "A blue crystal containing a faint inner light."
        },
        {
            id: "crystal_003",
            name: "Violet Crystal",
            x: 23, y: 20,
            color: "#bd83ff",
            description: "Its surface seems to shift when you look at it."
        },
        {
            id: "crystal_004",
            name: "Verdant Crystal",
            x: 34, y: 8,
            color: "#75f0d0",
            description: "A green crystal radiating gentle warmth."
        },
        {
            id: "crystal_005",
            name: "Azure Crystal",
            x: 11, y: 25,
            color: "#65d9ff",
            description: "A mysterious blue crystal."
        },
        {
            id: "crystal_006",
            name: "Violet Crystal",
            x: 36, y: 24,
            color: "#bd83ff",
            description: "A purple crystal with an unusual glow."
        }
    ];

    function getCrystals() {
        return crystals;
    }

    function draw(ctx, camera, time) {

        crystals.forEach(crystal => {

            const x = crystal.x * TILE_SIZE - camera.x;
            const y = crystal.y * TILE_SIZE - camera.y;

            const pulse = 0.5 +
                Math.sin(time / 500 + crystal.x) * 0.5;

            ctx.save();

            ctx.globalAlpha = 0.35 + pulse * 0.4;
            ctx.shadowColor = crystal.color;
            ctx.shadowBlur = 8 + pulse * 12;

            ctx.fillStyle = "#17232c";
            ctx.fillRect(x + 11, y + 28, 19, 5);

            ctx.fillStyle = crystal.color;
            ctx.fillRect(x + 15, y + 13, 12, 17);
            ctx.fillRect(x + 18, y + 7, 6, 6);
            ctx.fillRect(x + 12, y + 17, 3, 9);
            ctx.fillRect(x + 27, y + 17, 3, 9);

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x + 19, y + 12, 3, 11);

            ctx.restore();
        });
    }

    return {
        draw,
        getCrystals
    };

})();
