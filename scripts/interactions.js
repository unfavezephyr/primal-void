
/* =========================================
   PRIMAL VOID
   INTERACTION SYSTEM - VERSION 0.2
========================================= */

window.Interactions = (() => {
    const TILE_SIZE = 40;
    const RANGE = 75;

    let objects = [];
    let nearbyObject = null;
    let examinedObjectId = null;

    function initialize() {

        objects = [
            {
                id: "crystal_001",
                name: "Violet Crystal",
                x: 7,
                y: 8,
                description: "A violet crystal humming with strange energy."
            },
            {
                id: "crystal_002",
                name: "Azure Crystal",
                x: 19,
                y: 11,
                description: "A blue crystal containing a faint inner light."
            },
            {
                id: "crystal_003",
                name: "Violet Crystal",
                x: 23,
                y: 20,
                description: "Its surface seems to shift when you look at it."
            },
            {
                id: "crystal_004",
                name: "Verdant Crystal",
                x: 34,
                y: 8,
                description: "A green crystal radiating gentle warmth."
            },
            {
                id: "crystal_005",
                name: "Azure Crystal",
                x: 11,
                y: 25,
                description: "A mysterious blue crystal."
            },
            {
                id: "crystal_006",
                name: "Violet Crystal",
                x: 36,
                y: 24,
                description: "A purple crystal with an unusual glow."
            }
        ];

        nearbyObject = null;
        examinedObjectId = null;
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

        if (!nearbyObject) {
            examinedObjectId = null;
            return "";
        }

    if (keys["e"]) {

    if (examinedObjectId !== nearbyObject.id) {
        const newlyDiscovered = Journal.record(nearbyObject);

        if (newlyDiscovered) {
            console.log(
                "Journal updated:",
                nearbyObject.name
            );
        }
    }

    examinedObjectId = nearbyObject.id;

    return nearbyObject.name + ": " +
        nearbyObject.description;
}

    examinedObjectId = nearbyObject.id;

    return nearbyObject.name + ": " +
        nearbyObject.description;
}

        examinedObjectId = null;

        return "Press E to examine " + nearbyObject.name;
    }

    function getObjects() {
        return objects;
    }

    return {
        initialize,
        update,
        getObjects
    };

})();
