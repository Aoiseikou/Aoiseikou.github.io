/* ============================================================
   AOISEIKOU — hub behavior
   Tile focus, keyboard nav, hover preview, ray parallax.

   Bound via delegation on stable elements (document, #content)
   rather than per-tile, since the router replaces #content's
   children on every navigation — delegated listeners survive
   that; per-element ones wouldn't.
   ============================================================ */

(() => {
    "use strict";

    const data = [
        ["Blogs", "Documentation logs", "Culture Core"],
        ["Media", "Photo and video archive", "Culture Core"],
        ["Radio", "Tune in. Always playing.", "Culture Core"],
        ["Community", "System overview", "System Layer"],
        ["Nex", "Individual archive", "System Layer"],
        ["AOI DVD", "Footage, compiled", "System Layer"]
    ];

    let catIndex = 0;
    let tileIndex = 0;

    function update() {
        const categories = document.querySelectorAll(".category");
        if (!categories.length) return;

        const currentCategory = categories[catIndex];
        if (!currentCategory) return;
        const tiles = currentCategory.querySelectorAll(".tile");

        document.querySelectorAll(".tile").forEach((t) => t.classList.remove("focused"));
        categories.forEach((c) => c.classList.remove("active"));
        currentCategory.classList.add("active");

        if (tileIndex < 0) tileIndex = 0;
        if (tileIndex >= tiles.length) tileIndex = tiles.length - 1;
        if (!tiles[tileIndex]) return;
        tiles[tileIndex].classList.add("focused");

        let globalIndex = tileIndex;
        if (catIndex === 1) globalIndex += 3;
        const item = data[globalIndex];
        if (!item) return;

        const preview = document.querySelector(".preview");
        if (preview) {
            preview.classList.remove("pulse");
            void preview.offsetWidth; // force reflow so the animation can replay
            preview.classList.add("pulse");
        }

        const pTitle = document.getElementById("p-title");
        const pDesc = document.getElementById("p-desc");
        const pCat = document.getElementById("p-cat");
        if (pTitle) pTitle.innerText = item[0];
        if (pDesc) pDesc.innerText = item[1];
        if (pCat) pCat.innerText = item[2];
    }

    // called on first load and whenever the router swaps #content
    function resetHub() {
        catIndex = 0;
        tileIndex = 0;
        if (document.querySelectorAll(".category").length) update();
    }

    /* ---------- keyboard nav (bound once on document, queries live DOM) ---------- */

    document.addEventListener("keydown", (e) => {
        const categories = document.querySelectorAll(".category");
        if (!categories.length) return;

        const navKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        if (!navKeys.includes(e.key) && e.key !== "Enter") return;

        if (e.key === "ArrowLeft") tileIndex--;
        if (e.key === "ArrowRight") tileIndex++;
        if (e.key === "ArrowUp") { catIndex--; tileIndex = 0; }
        if (e.key === "ArrowDown") { catIndex++; tileIndex = 0; }

        if (catIndex < 0) catIndex = 0;
        if (catIndex >= categories.length) catIndex = categories.length - 1;

        if (navKeys.includes(e.key)) update();

        if (e.key === "Enter") {
            const tiles = categories[catIndex].querySelectorAll(".tile");
            const link = tiles[tileIndex] && tiles[tileIndex].dataset.link;
            if (link) {
                if (window.AOI_NAVIGATE) window.AOI_NAVIGATE(link);
                else window.location.href = link;
            }
        }
    });

    /* ---------- hover preview (delegated on #content, survives swaps) ---------- */

    const contentEl = document.getElementById("content");
    if (contentEl) {
        contentEl.addEventListener("mouseover", (e) => {
            const tile = e.target.closest(".tile");
            if (!tile) return;

            const categories = Array.from(document.querySelectorAll(".category"));
            const category = tile.closest(".category");
            const tiles = Array.from(category.querySelectorAll(".tile"));

            const cIndex = categories.indexOf(category);
            const tIndex = tiles.indexOf(tile);
            if (cIndex === -1 || tIndex === -1) return;

            catIndex = cIndex;
            tileIndex = tIndex;
            update();
        });
    }

    document.addEventListener("DOMContentLoaded", resetHub);
    window.addEventListener("aoi:content-loaded", resetHub);

    /* ---------- ray parallax (shell-level, persists for the whole session) ---------- */

    const bgRays = document.querySelector(".bg");
    if (bgRays) {
        document.addEventListener("mousemove", (e) => {
            const dx = (e.clientX / window.innerWidth - 0.5) * 14;
            const dy = (e.clientY / window.innerHeight - 0.5) * 10;
            bgRays.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    }
})();
