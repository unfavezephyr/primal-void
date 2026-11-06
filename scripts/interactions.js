
/* =========================================
   PRIMAL VOID
   INTERACTION SYSTEM - VERSION 0.1
========================================= */

const Interactions = (() => {

const INTERACTION_RANGE = 100;

    let objects = [];

    let nearbyObject = null;
    let lastInteracted = null;
    let interactionMessage = "";

    let previousE = false;

    // INITIALISE INTERACTABLE OBJECTS
    function initialize() {

        objects = [
            {
                id: "crystal_001",
                name: "Violet Crystal",
                type: "crystal",
                x: 7,
                y: 8,
                description: "A violet crystal humming with strange energy.",
                discovered: false
            },
            {
                id: "crystal_002",
                name: "Azure Crystal",
                type: "crystal",
                x: 19,
                y: 11,
                description: "A blue crystal containing a faint inner light.",
                discovered: false
            },
            {
                id: "crystal_003",
                name: "Violet Crystal",
                type: "crystal",
                x: 23,
                y: 20,
                description: "Its surface seems to shift when you look at it.",
                discovered: false
            },
            {
                id: "crystal_004",
                name: "Verdant Crystal",
                type: "crystal",
                x: 34,
                y: 8,
                description: "A green crystal radiating a gentle warmth.",
                discovered: false
            },
            {
                id: "crystal_005",
                name: "Azure Crystal",
                type: "crystal",
                x: 11,
                y: 25,
                description: "A mysterious blue crystal.",
                discovered: false
            },
            {
                id: "crystal_006",
                name: "Violet Crystal",
                type: "crystal",
                x: 36,
                y: 24,
                description: "A purple crystal with an unusual glow.",
                discovered: false
            }
        ];

        nearbyObject = null;
        lastInteracted = null;
        interactionMessage = "";
        previousE = false;
    }

    // FIND NEAREST OBJECT
    function findNearby(player) {

        let closest = null;
        let closestDistance = INTERACTION_RANGE;

        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;

        objects.forEach(object => {

            const objectCenterX = object.x * 40 + 20;
            const objectCenterY = object.y * 40 + 20;

            const distance = Math.hypot(
                playerCenterX - objectCenterX,
                playerCenterY - objectCenterY
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closest = object;
            }
        });

        return closest;
    }

    // EXAMINE OBJECT
    function interact(object) {

        if (!object) return;

        object.discovered = true;

        lastInteracted = object.id;

        interactionMessage =
            object.name + ": " + object.description;
    }

    // UPDATE INTERACTIONS
    function update(player, keys) {

        nearbyObject = findNearby(player);

        const ePressed = Boolean(keys["e"]) && !previousE;

        previousE = Boolean(keys["e"]);

        if (ePressed && nearbyObject) {
            interact(nearbyObject);
        }

        if (!nearbyObject) {
            lastInteracted = null;
            interactionMessage = "";
            return "";
        }

        if (lastInteracted === nearbyObject.id) {
            return interactionMessage;
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
