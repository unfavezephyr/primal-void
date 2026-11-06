
/* =========================================
   PRIMAL VOID
   INTERACTION SYSTEM - VERSION 0.3
========================================= */

const Interactions = (() => {

    const TILE_SIZE = 40;
    const RANGE = 75;

    let objects = [];
    let nearbyObject = null;
    let examinedObjectId = null;

    function initialize() {
        objects = Environment.getCrystals();
        nearbyObject = null;
        examinedObjectId = null;
    }

    function findNearby(player) {

        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;

        let closest = null;
        let closestDistance = RANGE;

        for (const object of objects) {

            const cx = object.x * TILE_SIZE + 20;
            const cy = object.y * TILE_SIZE + 20;

            const distance = Math.hypot(
                px - cx,
                py - cy
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

        if (!nearbyObject) {
            examinedObjectId = null;
            return "";
        }

        if (keys["e"] === true) {
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
