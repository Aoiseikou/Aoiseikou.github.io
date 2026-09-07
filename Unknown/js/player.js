/* ============================================================
   AOISEIKOU — player widget + radio engine
   Shell-level: runs once, never reloads, audio persists across
   all page navigations.

   PLAYLISTS defines the full library. The default station
   plays tracks from all playlists in order, auto-advancing.
   Each track: { title, src, playlist }

   Drop real .mp3 files into /media matching the src paths, or
   edit PLAYLISTS to point at whatever you actually add.
   ============================================================ */

(() => {
    "use strict";

    // ── LIBRARY ──────────────────────────────────────────────
    window.AOI_PLAYLISTS = [
        {
            name: "Night Drive",
            tracks: [
                { title: "Late Night Cruise",  src: "media/01-late-night-cruise.mp3" },
                { title: "Empty Lot",          src: "media/02-empty-lot.mp3" }
            ]
        },
        {
            name: "Garage Sessions",
            tracks: [
                { title: "Idle",               src: "media/03-idle.mp3" },
                { title: "Static Drift",       src: "media/04-static-drift.mp3" }
            ]
        },
        {
            name: "After Hours",
            tracks: [
                { title: "After Hours",        src: "media/05-after-hours.mp3" }
            ]
        }
    ];

    // flat list used by the station for sequential/shuffle playback
    const STATION = window.AOI_PLAYLISTS.flatMap(pl =>
        pl.tracks.map(t => ({ ...t, playlist: pl.name }))
    );

    // ── DOM ───────────────────────────────────────────────────
    const playBtn      = document.getElementById("playBtn");
    const volumeSlider = document.getElementById("volumeSlider");
    const loadTrackBtn = document.getElementById("loadTrackBtn");
    const fileInput    = document.getElementById("fileInput");
    const trackTitle   = document.getElementById("trackTitle");
    const trackSub     = document.getElementById("trackSub");
    const canvas       = document.getElementById("visualizer");
    const ctx2d        = canvas.getContext("2d");

    // ── STATE ─────────────────────────────────────────────────
    let audioCtx    = null;
    let analyser    = null;
    let gainNode    = null;
    let isPlaying   = false;
    let mode        = "idle";   // idle | synth | station | file
    let shuffle     = false;
    let stationIdx  = 0;
    let stationFail = 0;

    // synth nodes
    let osc1 = null, osc2 = null, lfo = null;
    // media nodes
    let mediaEl = null, mediaSource = null;

    // ── AUDIO CTX ─────────────────────────────────────────────
    function ensureCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser  = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            gainNode  = audioCtx.createGain();
            gainNode.gain.value = volumeSlider.value / 100;
            analyser.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }
    }

    function setPlayIcon(p) { playBtn.textContent = p ? "❚❚" : "▶"; }

    // ── SYNTH FALLBACK ────────────────────────────────────────
    function stopSynth() {
        [osc1, osc2, lfo].forEach(n => {
            if (!n) return;
            try { n.stop(); } catch(e) {}
            n.disconnect();
        });
        osc1 = osc2 = lfo = null;
    }

    function startSynth(reason) {
        ensureCtx();
        teardownMedia();
        osc1 = audioCtx.createOscillator(); osc1.type = "sine";   osc1.frequency.value = 110;
        osc2 = audioCtx.createOscillator(); osc2.type = "triangle"; osc2.frequency.value = 164.81;
        const pad = audioCtx.createGain(); pad.gain.value = 0.16;
        lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.12;
        const lfoG = audioCtx.createGain(); lfoG.gain.value = 0.07;
        lfo.connect(lfoG); lfoG.connect(pad.gain);
        osc1.connect(pad); osc2.connect(pad); pad.connect(analyser);
        osc1.start(); osc2.start(); lfo.start();
        mode = "synth";
        trackTitle.textContent = "ambient_loop";
        trackSub.textContent   = reason || "placeholder · no files in /media yet";
    }

    // ── MEDIA PLAYBACK ────────────────────────────────────────
    function teardownMedia() {
        if (mediaEl) {
            mediaEl.pause();
            mediaEl.removeEventListener("ended", onEnded);
            mediaEl.removeEventListener("error", onError);
        }
        if (mediaSource) { try { mediaSource.disconnect(); } catch(e) {} }
        mediaEl = null; mediaSource = null;
    }

    function onEnded() { if (mode === "station") advanceStation(); }
    function onError()  {
        if (mode === "station") {
            stationFail++;
            if (stationFail >= STATION.length) {
                startSynth("all tracks missing · add files to /media");
                isPlaying = true; setPlayIcon(true);
                return;
            }
            advanceStation();
        } else {
            startSynth("couldn't load that file");
            isPlaying = true; setPlayIcon(true);
        }
    }

    function playMediaSrc(src, title, sub) {
        ensureCtx();
        stopSynth();
        teardownMedia();
        mediaEl = new Audio(src);
        mediaEl.addEventListener("ended", onEnded);
        mediaEl.addEventListener("error", onError);
        mediaSource = audioCtx.createMediaElementSource(mediaEl);
        mediaSource.connect(analyser);
        trackTitle.textContent = title;
        trackSub.textContent   = sub;
        mediaEl.play().catch(onError);
    }

    function nextIndex() {
        if (shuffle) {
            let next;
            do { next = Math.floor(Math.random() * STATION.length); }
            while (STATION.length > 1 && next === stationIdx);
            return next;
        }
        return (stationIdx + 1) % STATION.length;
    }

    function advanceStation() {
        stationIdx = nextIndex();
        playStation(stationIdx, false);
    }

    function playStation(i, resetFail) {
        if (resetFail !== false) stationFail = 0;
        stationIdx = typeof i === "number" ? i : stationIdx;
        const t = STATION[stationIdx];
        mode = "station";
        playMediaSrc(t.src, t.title, shuffle ? "shuffle · on air" : "on air");
        isPlaying = true; setPlayIcon(true);
        window.dispatchEvent(new CustomEvent("aoi:track-changed", { detail: { index: stationIdx } }));
    }

    // ── TRANSPORT ─────────────────────────────────────────────
    async function togglePlay() {
        ensureCtx();
        if (audioCtx.state === "suspended") await audioCtx.resume();
        if (mode === "idle") { playStation(0); return; }
        if (mediaEl) {
            isPlaying ? mediaEl.pause() : mediaEl.play();
        } else {
            isPlaying ? stopSynth() : startSynth();
        }
        isPlaying = !isPlaying;
        setPlayIcon(isPlaying);
    }

    playBtn.addEventListener("click", togglePlay);

    document.addEventListener("keydown", (e) => {
        if (e.code !== "Space") return;
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        e.preventDefault();
        togglePlay();
    });

    volumeSlider.addEventListener("input", () => {
        if (gainNode) gainNode.gain.value = volumeSlider.value / 100;
    });

    loadTrackBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        ensureCtx();
        if (audioCtx.state === "suspended") await audioCtx.resume();
        mode = "file";
        playMediaSrc(URL.createObjectURL(file), file.name.replace(/\.[^/.]+$/, ""), "loaded from device");
        isPlaying = true; setPlayIcon(true);
    });

    // ── VISUALIZER ────────────────────────────────────────────
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const resting = new Uint8Array(24).fill(3);
    function draw() {
        requestAnimationFrame(draw);
        const w = canvas.getBoundingClientRect().width;
        const h = canvas.getBoundingClientRect().height;
        ctx2d.clearRect(0, 0, w, h);
        let data = resting;
        if (analyser && isPlaying) {
            data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
        }
        const n = 24, bw = w / n;
        for (let i = 0; i < n; i++) {
            const raw   = data[Math.floor(i/n * data.length)] || 3;
            const barH  = Math.max(2, (raw/255) * h);
            const alpha = 0.25 + (raw/255) * 0.55;
            ctx2d.fillStyle = `rgba(120,150,255,${alpha})`;
            ctx2d.fillRect(i*bw + bw*0.2, h - barH, bw*0.6, barH);
        }
    }
    draw();

    // ── PUBLIC API ────────────────────────────────────────────
    window.AOI_PLAYER = {
        get analyser()    { return analyser; },
        get isPlaying()   { return isPlaying; },
        get mode()        { return mode; },
        get station()     { return STATION; },
        get stationIndex(){ return stationIdx; },
        get shuffle()     { return shuffle; },
        set shuffle(v)    { shuffle = !!v; },
        playStation,
        playTrackAt(i)    { playStation(i); },
        toggle: togglePlay
    };
})();
