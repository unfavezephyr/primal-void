
/* =========================================
   PRIMAL VOID
   INTERACTION SYSTEM - VERSION 0.2
========================================= */

const Interactions = (() => {

    const TILE_SIZE = 40;
    const RANGE = 75;

    let objects = [];
    let nearbyObject = null;
    let examinedObjectId = null;
    let previousE = false;

    function initialize() {

        objects = Environment.getCrystals();

        nearbyObject = null;
        examinedObjectId = null;
        previousE = false;
    }

    function findNearby(player) {

        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;

        let closest = null;
        let closestDistance = RANGE;

        for (const object of objects) {

            const ox = object.x * TILE_SIZE + TILE_SIZE / 2;
            const oy = object.y * TILE_SIZE + TILE_SIZE / 2;

            const distance = Math.hypot(
                px - ox,
                py - oy
            );

            if (distance <= closestDistance) {
                closest = object;
                closestDistance = distance;
            }
        }

        return closest;
    }

    function update(player, keys) {

        nearbyObject = findNearby(player);

        const ePressed =
            Boolean(keys["e"]) && !previousE;

        previousE = Boolean(keys["e"]);

        if (!nearbyObject) {
            examinedObjectId = null;
            return "";
        }

        if (ePressed) {
            examinedObjectId = nearbyObject.id;
        }

        if (examinedObjectId === nearbyObject.id) {

            return nearbyObject.name + ": " +
                nearbyObject.description;
        }

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

