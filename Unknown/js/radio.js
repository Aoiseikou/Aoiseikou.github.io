/* ============================================================
   AOISEIKOU — radio page behavior
   Renders playlist folder accordions from window.AOI_PLAYLISTS,
   drives the hero visualizer from the shared player analyser,
   wires transport controls and shuffle to window.AOI_PLAYER.
   ============================================================ */

(() => {
    "use strict";

    function init() {
        if (!window.AOI_PLAYER || !window.AOI_PLAYLISTS) {
            setTimeout(init, 50);
            return;
        }
        renderPlaylists();
        initHeroVisualizer();
        wireTransport();
        syncUI();
        setInterval(syncUI, 500);
        window.addEventListener("aoi:track-changed", syncUI);
    }

    /* ---------- playlist folders ---------- */

    function renderPlaylists() {
        const lib = document.getElementById("playlistLibrary");
        if (!lib) return;

        lib.innerHTML = "";
        // flat index across all tracks, for playback
        let globalIdx = 0;

        window.AOI_PLAYLISTS.forEach((pl) => {
            const folder = document.createElement("div");
            folder.className = "playlist-folder";

            const header = document.createElement("button");
            header.className = "playlist-folder-header";
            header.innerHTML = `
                <span class="folder-arrow">▶</span>
                <span class="folder-name">${pl.name}</span>
                <span class="folder-count">${pl.tracks.length} track${pl.tracks.length !== 1 ? "s" : ""}</span>`;

            const tracks = document.createElement("div");
            tracks.className = "playlist-tracks";

            header.addEventListener("click", () => {
                const open = tracks.classList.toggle("open");
                header.classList.toggle("open", open);
            });

            pl.tracks.forEach((track, localIdx) => {
                const capturedIdx = globalIdx + localIdx;
                const btn = document.createElement("button");
                btn.className = "lib-track";
                btn.dataset.globalIndex = String(capturedIdx);
                btn.innerHTML = `<span class="lib-index">${String(localIdx + 1).padStart(2, "0")}</span><span>${track.title}</span>`;
                btn.addEventListener("click", () => window.AOI_PLAYER.playTrackAt(capturedIdx));
                tracks.appendChild(btn);
            });

            globalIdx += pl.tracks.length;

            folder.appendChild(header);
            folder.appendChild(tracks);
            lib.appendChild(folder);
        });

        // auto-open the first folder
        const first = lib.querySelector(".playlist-folder-header");
        const firstTracks = lib.querySelector(".playlist-tracks");
        if (first && firstTracks) {
            first.classList.add("open");
            firstTracks.classList.add("open");
        }
    }

    /* ---------- transport wiring ---------- */

    function wireTransport() {
        const playBtn   = document.getElementById("radioPlay");
        const prevBtn   = document.getElementById("radioPrev");
        const nextBtn   = document.getElementById("radioNext");
        const shuffleBtn = document.getElementById("radioShuffle");
        if (!playBtn) return;

        playBtn.addEventListener("click", () => window.AOI_PLAYER.toggle());

        prevBtn && prevBtn.addEventListener("click", () => {
            const cur  = window.AOI_PLAYER.stationIndex;
            const prev = (cur - 1 + window.AOI_PLAYER.station.length) % window.AOI_PLAYER.station.length;
            window.AOI_PLAYER.playTrackAt(prev);
        });

        nextBtn && nextBtn.addEventListener("click", () => {
            const next = (window.AOI_PLAYER.stationIndex + 1) % window.AOI_PLAYER.station.length;
            window.AOI_PLAYER.playTrackAt(next);
        });

        shuffleBtn && shuffleBtn.addEventListener("click", () => {
            window.AOI_PLAYER.shuffle = !window.AOI_PLAYER.shuffle;
            shuffleBtn.classList.toggle("active", window.AOI_PLAYER.shuffle);
        });
    }

    /* ---------- sync hero label + track highlights ---------- */

    function syncUI() {
        const p = window.AOI_PLAYER;
        if (!p) return;

        const heroTrack = document.getElementById("radioHeroTrack");
        const radioPlay = document.getElementById("radioPlay");
        const shuffleBtn = document.getElementById("radioShuffle");

        const active = p.mode === "station" && p.isPlaying ? p.stationIndex : -1;

        if (heroTrack) {
            heroTrack.textContent = active >= 0
                ? p.station[active].title
                : "press ▶ to tune in";
        }

        if (radioPlay) radioPlay.textContent = p.isPlaying ? "❚❚" : "▶";
        if (shuffleBtn) shuffleBtn.classList.toggle("active", p.shuffle);

        document.querySelectorAll(".lib-track").forEach((btn) => {
            btn.classList.toggle("is-active", Number(btn.dataset.globalIndex) === active);
        });
    }

    /* ---------- hero visualizer ---------- */

    function initHeroVisualizer() {
        const canvas = document.getElementById("radioVisualizer");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            const r   = canvas.getBoundingClientRect();
            canvas.width  = r.width  * dpr;
            canvas.height = r.height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        window.addEventListener("resize", resize);
        resize();

        const resting = new Uint8Array(40).fill(3);
        function draw() {
            requestAnimationFrame(draw);
            const w = canvas.getBoundingClientRect().width;
            const h = canvas.getBoundingClientRect().height;
            ctx.clearRect(0, 0, w, h);

            const analyser = window.AOI_PLAYER && window.AOI_PLAYER.analyser;
            const playing  = window.AOI_PLAYER && window.AOI_PLAYER.isPlaying;
            let data = resting;
            if (analyser && playing) {
                data = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(data);
            }

            const n = 40, bw = w / n;
            for (let i = 0; i < n; i++) {
                const raw   = data[Math.floor(i/n * data.length)] || 3;
                const barH  = Math.max(2, (raw/255) * h);
                const alpha = 0.2 + (raw/255) * 0.65;
                ctx.fillStyle = `rgba(120,150,255,${alpha})`;
                ctx.fillRect(i*bw + bw*0.12, h - barH, bw*0.76, barH);
            }
        }
        draw();
    }

    init();
})();
