
/* =========================================
   PRIMAL VOID
   DISCOVERY JOURNAL UI - VERSION 0.4
========================================= */

window.JournalUI = (() => {

    let initialized = false;

    const elements = {};

    const crystalTypes = {
        Violet: {
            symbol: "✦",
            className: "violet"
        },

        Azure: {
            symbol: "✧",
            className: "azure"
        },

        Verdant: {
            symbol: "✥",
            className: "verdant"
        }
    };

    // CACHE HTML ELEMENTS
    function cacheElements() {

        elements.openButton =
            document.getElementById("journal-button");

        elements.closeButton =
            document.getElementById("close-journal");

        elements.panel =
            document.getElementById("journal-panel");

        elements.progress =
            document.getElementById("journal-progress");

        elements.entries =
            document.getElementById("journal-entries");
    }

    // OPEN JOURNAL
    function open() {

        elements.panel.style.display = "block";

        render();
    }

    // CLOSE JOURNAL
    function close() {

        elements.panel.style.display = "none";
    }

    // TOGGLE JOURNAL
    function toggle() {

        const isOpen =
            elements.panel.style.display === "block";

        isOpen ? close() : open();
    }

    // GET CRYSTAL APPEARANCE
    function getCrystalAppearance(type) {

        return crystalTypes[type] || {
            symbol: "?",
            className: "unknown"
        };
    }

    // GET MILESTONE MESSAGE
    function getMilestone(count, total, percentage) {

        if (total > 0 && count === total) {
            return "✦ All discoveries complete. The unknown is no longer unknown.";
        }

        if (percentage >= 75) {
            return "Your understanding of this world is expanding.";
        }

        if (percentage >= 50) {
            return "Half the mysteries have been uncovered.";
        }

        if (percentage >= 25) {
            return "Your journey of discovery has begun.";
        }

        return "The world still holds many secrets.";
    }

    // CREATE PROGRESS DISPLAY
    function createProgressDisplay(count, total) {

        const percentage = total > 0
            ? Math.round((count / total) * 100)
            : 0;

        const container = document.createElement("div");

        container.className = "journal-progress-container";

        const header = document.createElement("div");

        header.className = "journal-progress-header";

        const label = document.createElement("span");

        label.textContent = "EXPLORATION PROGRESS";

        const percentageText = document.createElement("span");

        percentageText.textContent = percentage + "%";

        header.append(label, percentageText);

        const track = document.createElement("div");

        track.className = "journal-progress-track";

        const fill = document.createElement("div");

        fill.className = "journal-progress-fill";

        fill.style.width = percentage + "%";

        track.appendChild(fill);

        const milestone = document.createElement("p");

        milestone.className = "journal-milestone";

        milestone.textContent =
            getMilestone(count, total, percentage);

        container.append(header, track, milestone);

        return container;
    }

    // RENDER JOURNAL
    function render() {

        const discoveries = Journal.getDiscoveries();

        const objects = Interactions.getObjects();

        const count = objects.filter(object =>
            discoveries.some(item => item.id === object.id)
        ).length;

        const total = objects.length;

        // UPDATE DISCOVERY COUNTER
        elements.progress.textContent =
            `Discoveries: ${count} / ${total}`;

        // REMOVE OLD PROGRESS DISPLAY
        const oldDisplay = elements.progress
            .parentElement
            .querySelector(".journal-progress-container");

        if (oldDisplay) {
            oldDisplay.remove();
        }

        // ADD NEW PROGRESS DISPLAY
        elements.progress.after(
            createProgressDisplay(count, total)
        );

        // CLEAR OLD ENTRIES
        elements.entries.replaceChildren();

        // CREATE CRYSTAL ENTRIES
        for (const object of objects) {

            const discovery = discoveries.find(
                item => item.id === object.id
            );

            const discovered = !!discovery;

            const appearance =
                getCrystalAppearance(object.type);

            const entry = document.createElement("article");

            entry.className = discovered
                ? `journal-entry ${appearance.className}`
                : "journal-entry locked";

            // CRYSTAL SYMBOL
            const icon = document.createElement("div");

            icon.className = "journal-crystal-icon";

            icon.textContent = discovered
                ? appearance.symbol
                : "?";

            // CRYSTAL NAME
            const title = document.createElement("h3");

            title.textContent = discovered
                ? object.name
                : "Unknown Discovery";

            // CLASSIFICATION
            const classification = document.createElement("span");

            classification.className =
                `journal-classification ${appearance.className}`;

            classification.textContent = discovered
                ? object.type || "Unknown"
                : "Unclassified";

            // DESCRIPTION
            const description = document.createElement("p");

            description.textContent = discovered
                ? object.description
                : "This discovery has not yet been recorded.";

            entry.append(
                icon,
                title,
                classification,
                description
            );

            // DISCOVERY DATE
            if (discovered) {

                const date = document.createElement("small");

                date.className = "journal-date";

                date.textContent = discovery.discoveredAt
                    ? "Discovered: " +
                      new Date(
                          discovery.discoveredAt
                      ).toLocaleDateString()
                    : "Discovery date unavailable";

                entry.appendChild(date);
            }

            elements.entries.appendChild(entry);
        }
    }

    // INITIALIZE
    function initialize() {

        if (initialized) return;

        cacheElements();

        if (
            !elements.openButton ||
            !elements.closeButton ||
            !elements.panel ||
            !elements.progress ||
            !elements.entries
        ) {

            console.error(
                "Journal UI: Missing HTML elements."
            );

            return;
        }

        elements.openButton.addEventListener(
            "click",
            toggle
        );

        elements.closeButton.addEventListener(
            "click",
            close
        );

        initialized = true;

        console.log(
            "Discovery Journal UI Version 0.4 initialized."
        );
    }

    return {
        initialize,
        open,
        close,
        toggle,
        render
    };

})();
