
const Interactions = (() => {

    const TILE_SIZE = 40;
    const RANGE = 75;

    let objects = [];
    let nearbyObject = null;
    let message = "";
    let previousE = false;

    function initialize() {

        objects = [
            { id: "crystal_001", name: "Violet Crystal", x: 7, y: 8,
              description: "A violet crystal humming with strange energy." },

            { id: "crystal_002", name: "Azure Crystal", x: 19, y: 11,
              description: "A blue crystal containing a faint inner light." },

            { id: "crystal_003", name: "Violet Crystal", x: 23, y: 20,
              description: "Its surface seems to shift when you look at it." },

            { id: "crystal_004", name: "Verdant Crystal", x: 34, y: 8,
              description: "A green crystal radiating gentle warmth." },

            { id: "crystal_005", name: "Azure Crystal", x: 11, y: 25,
              description: "A mysterious blue crystal." },

            { id: "crystal_006", name: "Violet Crystal", x: 36, y: 24,
              description: "A purple crystal with an unusual glow." }
        ];

        nearbyObject = null;
        message = "";
        previousE = false;
    }

    function update(player, keys) {

        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;

        let closest = null;
        let closestDistance = RANGE;

        for (const object of objects) {

            const ox = object.x * TILE_SIZE + TILE_SIZE / 2;
            const oy = object.y * TILE_SIZE + TILE_SIZE / 2;

            const distance = Math.hypot(px - ox, py - oy);

            if (distance < closestDistance) {
                closest = object;
                closestDistance = distance;
            }
        }

        nearbyObject = closest;

        const ePressed = Boolean(keys["e"]) && !previousE;
        previousE = Boolean(keys["e"]);

        if (ePressed && nearbyObject) {
            message = nearbyObject.name + ": " +
                nearbyObject.description;
        }

        if (!nearbyObject) {
            message = "";
        }

        if (nearbyObject && !message.includes(nearbyObject.name + ":")) {
            message = "Press E to examine " + nearbyObject.name;
        }

        return message;
    }

    return {
        initialize,
        update
    };

})();
