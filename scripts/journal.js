
/* =========================================
   PRIMAL VOID
   DISCOVERY JOURNAL - VERSION 0.1
========================================= */

window.Journal = (() => {

    const STORAGE_KEY = "primalVoid_discoveries";

    let discoveries = [];

    function load() {
        try {
            discoveries = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );
        } catch (error) {
            discoveries = [];
            console.error("Journal loading failed:", error);
        }
    }

    function save() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(discoveries)
        );
    }

    function record(object) {

        if (!object || !object.id) return false;

        const alreadyDiscovered = discoveries.some(
            item => item.id === object.id
        );

        if (alreadyDiscovered) return false;

        discoveries.push({
            id: object.id,
            name: object.name,
            description: object.description,
            location: {
                x: object.x,
                y: object.y
            },
            discoveredAt: new Date().toISOString()
        });

        save();

        console.log("New discovery:", object.name);

        return true;
    }

    function getDiscoveries() {
        return [...discoveries];
    }

    function getCount() {
        return discoveries.length;
    }

    function hasDiscovered(id) {
        return discoveries.some(item => item.id === id);
    }

    function initialize() {
        load();
        console.log("Discovery Journal initialized.");
    }

    return {
        initialize,
        record,
        getDiscoveries,
        getCount,
        hasDiscovered
    };

})();
