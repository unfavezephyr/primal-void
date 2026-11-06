
/* =========================================
   PRIMAL VOID
   ENVIRONMENT SYSTEM - VERSION 0.1
========================================= */

const Environment = (() => {

    const crystals = [
        { x: 7, y: 8, color: "#bd83ff" },
        { x: 19, y: 11, color: "#65d9ff" },
        { x: 23, y: 20, color: "#bd83ff" },
        { x: 34, y: 8, color: "#75f0d0" },
        { x: 11, y: 25, color: "#65d9ff" },
        { x: 36, y: 24, color: "#bd83ff" }
    ];

    function draw(ctx, camera, time) {

        crystals.forEach(crystal => {

            const x = crystal.x * 40 - camera.x;
            const y = crystal.y * 40 - camera.y;

            // Gentle pulsing glow
            const pulse = 0.5 +
                Math.sin(time / 500 + crystal.x) * 0.5;

            ctx.save();

            ctx.globalAlpha = 0.35 + pulse * 0.4;
            ctx.shadowColor = crystal.color;
            ctx.shadowBlur = 8 + pulse * 12;

            // Crystal shadow
            ctx.fillStyle = "#17232c";
            ctx.fillRect(x + 11, y + 28, 19, 5);

            // Crystal body
            ctx.fillStyle = crystal.color;
            ctx.fillRect(x + 15, y + 13, 12, 17);
            ctx.fillRect(x + 18, y + 7, 6, 6);
            ctx.fillRect(x + 12, y + 17, 3, 9);
            ctx.fillRect(x + 27, y + 17, 3, 9);

            // Bright centre
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x + 19, y + 12, 3, 11);

            ctx.restore();
        });
    }

    return { draw };

})();
