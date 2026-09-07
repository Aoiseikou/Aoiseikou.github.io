/* ============================================================
   AOISEIKOU — blogs page behavior
   Windows 8-style live tiles: each flips on its own random
   timer (never synced), independent of hover. Hovering also
   updates the shared sidebar Preview widget, same pattern used
   on the home hub.

   Runs immediately rather than waiting for DOMContentLoaded —
   by the time this script executes (end of #content, on a
   direct load OR re-injected by router.js after a navigation)
   the tiles it needs are already in the DOM either way.
   ============================================================ */

(() => {
    "use strict";

    const tiles = document.querySelectorAll(".blog-tile");
    if (!tiles.length) return;

    /* ---------- live tile auto-flip ---------- */

    function scheduleFlip(tile) {
        const delay = 4000 + Math.random() * 6000;
        setTimeout(() => {
            tile.classList.add("flipped");
            const holdTime = 2000 + Math.random() * 1200;
            setTimeout(() => {
                tile.classList.remove("flipped");
                scheduleFlip(tile);
            }, holdTime);
        }, delay);
    }

    tiles.forEach((tile, i) => {
        setTimeout(() => scheduleFlip(tile), i * 500);
    });

    /* ---------- hover -> shared sidebar preview ---------- */

    const pTitle = document.getElementById("p-title");
    const pDesc = document.getElementById("p-desc");

    const DEFAULT_TITLE = "Hover a blog";
    const DEFAULT_DESC = "Preview will appear here.";

    if (pTitle) pTitle.innerText = DEFAULT_TITLE;
    if (pDesc) pDesc.innerText = DEFAULT_DESC;

    tiles.forEach((tile) => {
        tile.addEventListener("mouseenter", () => {
            if (pTitle) pTitle.innerText = tile.dataset.title || DEFAULT_TITLE;
            if (pDesc) pDesc.innerText = tile.dataset.desc || DEFAULT_DESC;
        });

        tile.addEventListener("mouseleave", () => {
            if (pTitle) pTitle.innerText = DEFAULT_TITLE;
            if (pDesc) pDesc.innerText = DEFAULT_DESC;
        });
    });
})();
