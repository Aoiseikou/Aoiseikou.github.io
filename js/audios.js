/* =========================================================
   AOISEIKOU — AUDIOS
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CLOCK
    ===================================================== */

    const clock =
        document.getElementById("clock");


    function updateClock() {

        if (!clock) {
            return;
        }


        const now =
            new Date();


        clock.textContent =
            now.toLocaleTimeString(
                [],
                {
                    hour12: false,

                    hour: "2-digit",

                    minute: "2-digit",

                    second: "2-digit"
                }
            );

    }


    updateClock();


    setInterval(
        updateClock,
        1000
    );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const recordings =
        Array.from(
            document.querySelectorAll(
                ".audio-spine"
            )
        );


    const player =
        document.getElementById(
            "audio-player"
        );


    const count =
        document.getElementById(
            "audio-count"
        );


    const footerCount =
        document.getElementById(
            "footer-count"
        );


    const deskTitle =
        document.getElementById(
            "desk-title"
        );


    const deskType =
        document.getElementById(
            "desk-type"
        );


    const deskNumber =
        document.getElementById(
            "desk-track-number"
        );


    const deskDescription =
        document.getElementById(
            "desk-description"
        );


    const deskSource =
        document.getElementById(
            "desk-source"
        );


    const deskIndicator =
        document.getElementById(
            "desk-indicator"
        );


    const deskCurrent =
        document.getElementById(
            "current-time"
        );


    const deskDuration =
        document.getElementById(
            "total-time"
        );


    const deskProgress =
        document.getElementById(
            "desk-progress"
        );


    const deskProgressFill =
        document.getElementById(
            "desk-progress-fill"
        );


    const deskWaveform =
        document.getElementById(
            "desk-waveform"
        );


    const playButton =
        document.getElementById(
            "play"
        );


    const previousButton =
        document.getElementById(
            "previous"
        );


    const nextButton =
        document.getElementById(
            "next"
        );


    const volume =
        document.getElementById(
            "volume"
        );


    const volumeLabel =
        document.getElementById(
            "volume-label"
        );


    const shuffle =
        document.getElementById(
            "shuffle"
        );


    let currentRecording =
        null;


    /* =====================================================
       COUNT
    ===================================================== */

    const total =
        recordings.length;


    if (count) {

        count.textContent =
            String(total).padStart(
                3,
                "0"
            );

    }


    if (footerCount) {

        footerCount.textContent =
            String(total).padStart(
                3,
                "0"
            );

    }


    /* =====================================================
       DESK WAVEFORM
    ===================================================== */

    function buildDeskWaveform() {

        if (!deskWaveform) {
            return;
        }


        deskWaveform.innerHTML = "";


        for (
            let index = 0;
            index < 100;
            index++
        ) {

            const bar =
                document.createElement(
                    "span"
                );


            bar.className =
                "desk-wave-bar";


            const height =
                10 +
                Math.random() * 85;


            bar.style.height =
                `${height}%`;


            deskWaveform.appendChild(
                bar
            );

        }

    }


    buildDeskWaveform();


    /* =====================================================
       TIME FORMAT
    ===================================================== */

    function formatTime(
        seconds
    ) {

        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {

            return "00:00";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remainder =
            Math.floor(
                seconds % 60
            );


        return (
            String(minutes).padStart(
                2,
                "0"
            )
            +
            ":"
            +
            String(remainder).padStart(
                2,
                "0"
            )
        );

    }


    /* =====================================================
       LOAD RECORDING
    ===================================================== */

    function loadRecording(
        recording,
        playAfterLoad = false
    ) {

        if (
            !recording ||
            !player
        ) {

            return;

        }


        const file =
            recording.dataset.file;


        if (!file) {
            return;
        }


        /* Clear selection */

        recordings.forEach(
            (item) => {

                item.classList.remove(
                    "is-loaded"
                );

            }
        );


        /* Select */

        recording.classList.add(
            "is-loaded"
        );


        currentRecording =
            recording;


        /* Metadata */

        const title =
            recording.dataset.title ||
            "UNTITLED";


        const type =
            recording.dataset.type ||
            "RECORDING";


        const year =
            recording.dataset.year ||
            "----";


        const number =
            recording.dataset.number ||
            "000";


        const description =
            recording.dataset.description ||
            "";


        /* Desk */

        if (deskTitle) {

            deskTitle.textContent =
                title;

        }


        if (deskType) {

            deskType.textContent =
                `${type} / ${year}`;

        }


        if (deskNumber) {

            deskNumber.textContent =
                `AUDIO—${number}`;

        }


        if (deskDescription) {

            deskDescription.textContent =
                description;

        }


        if (deskSource) {

            deskSource.textContent =
                file;

        }


        if (deskIndicator) {

            deskIndicator.textContent =
                "LOADED";

        }


        /* Reset UI */

        if (deskCurrent) {

            deskCurrent.textContent =
                "00:00";

        }


        if (deskDuration) {

            deskDuration.textContent =
                "00:00";

        }


        if (deskProgressFill) {

            deskProgressFill.style.width =
                "0%";

        }


        if (playButton) {

            playButton.textContent =
                "PLAY";

        }


        /* Load */

        player.src =
            file;

        player.load();


        updateWaveform();


        if (playAfterLoad) {

            player.play().catch(
                () => {}
            );

        }

    }


    /* =====================================================
       CLICK SHELF ITEM
    ===================================================== */

    recordings.forEach(
        (recording) => {

            recording.addEventListener(
                "click",
                () => {

                    loadRecording(
                        recording,
                        false
                    );

                }
            );

        }
    );


    /* =====================================================
       PLAYER EVENTS
    ===================================================== */

    if (player) {

        player.volume =
            0.8;


        player.addEventListener(
            "loadedmetadata",
            () => {

                if (deskDuration) {

                    deskDuration.textContent =
                        formatTime(
                            player.duration
                        );

                }

            }
        );


        player.addEventListener(
            "play",
            () => {

                if (playButton) {

                    playButton.textContent =
                        "PAUSE";

                }


                if (deskIndicator) {

                    deskIndicator.textContent =
                        "PLAYING";

                }

            }
        );


        player.addEventListener(
            "pause",
            () => {

                if (playButton) {

                    playButton.textContent =
                        "PLAY";

                }


                if (deskIndicator) {

                    deskIndicator.textContent =
                        "LOADED";

                }

            }
        );


        player.addEventListener(
            "ended",
            () => {

                if (playButton) {

                    playButton.textContent =
                        "PLAY";

                }


                if (deskIndicator) {

                    deskIndicator.textContent =
                        "ENDED";

                }

            }
        );


        player.addEventListener(
            "timeupdate",
            updatePlayer
        );

    }


    /* =====================================================
       PLAYER UI
    ===================================================== */

    function updatePlayer() {

        if (
            !player ||
            !Number.isFinite(
                player.duration
            )
        ) {

            return;

        }


        const progress =
            (
                player.currentTime /
                player.duration
            ) * 100;


        if (deskCurrent) {

            deskCurrent.textContent =
                formatTime(
                    player.currentTime
                );

        }


        if (deskDuration) {

            deskDuration.textContent =
                formatTime(
                    player.duration
                );

        }


        if (deskProgressFill) {

            deskProgressFill.style.width =
                `${progress}%`;

        }


        updateWaveform();

    }


    /* =====================================================
       WAVEFORM PROGRESS
    ===================================================== */

    function updateWaveform() {

        if (
            !deskWaveform ||
            !player ||
            !Number.isFinite(
                player.duration
            )
        ) {

            return;

        }


        const bars =
            deskWaveform.querySelectorAll(
                ".desk-wave-bar"
            );


        const progress =
            player.duration > 0
                ? (
                    player.currentTime /
                    player.duration
                ) * 100
                : 0;


        bars.forEach(
            (
                bar,
                index
            ) => {

                const position =
                    (
                        index /
                        bars.length
                    ) * 100;


                bar.classList.toggle(
                    "played",
                    position <= progress
                );

            }
        );

    }


    /* =====================================================
       PLAY BUTTON
    ===================================================== */

    if (playButton) {

        playButton.addEventListener(
            "click",
            () => {

                if (!currentRecording) {

                    if (recordings.length) {

                        loadRecording(
                            recordings[0],
                            true
                        );

                    }

                    return;

                }


                if (player.paused) {

                    player.play().catch(
                        () => {}
                    );

                } else {

                    player.pause();

                }

            }
        );

    }


    /* =====================================================
       PROGRESS SEEK
    ===================================================== */

    if (deskProgress) {

        deskProgress.addEventListener(
            "click",
            (event) => {

                if (
                    !player ||
                    !Number.isFinite(
                        player.duration
                    )
                ) {

                    return;

                }


                const rect =
                    deskProgress.getBoundingClientRect();


                const position =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                player.currentTime =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            position
                        )
                    ) *
                    player.duration;

            }
        );

    }


    /* =====================================================
       VOLUME
    ===================================================== */

    if (volume) {

        volume.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        volume.value
                    );


                if (player) {

                    player.volume =
                        value;

                }


                if (volumeLabel) {

                    volumeLabel.textContent =
                        Math.round(
                            value * 100
                        );

                }

            }
        );

    }


    /* =====================================================
       PREVIOUS / NEXT
    ===================================================== */

    function moveSelection(
        direction
    ) {

        if (
            !recordings.length
        ) {

            return;

        }


        let index =
            recordings.indexOf(
                currentRecording
            );


        if (index === -1) {

            index =
                direction > 0
                    ? -1
                    : 0;

        }


        let nextIndex =
            index + direction;


        if (
            nextIndex < 0
        ) {

            nextIndex =
                recordings.length - 1;

        }


        if (
            nextIndex >=
            recordings.length
        ) {

            nextIndex =
                0;

        }


        loadRecording(
            recordings[nextIndex],
            false
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                moveSelection(
                    -1
                );

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                moveSelection(
                    1
                );

            }
        );

    }


    /* =====================================================
       SHUFFLE
    ===================================================== */

    if (shuffle) {

        shuffle.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                if (
                    !recordings.length
                ) {

                    return;

                }


                let randomIndex =
                    Math.floor(
                        Math.random() *
                        recordings.length
                    );


                if (
                    recordings.length > 1 &&
                    recordings[randomIndex] ===
                    currentRecording
                ) {

                    randomIndex =
                        (
                            randomIndex + 1
                        ) %
                        recordings.length;

                }


                loadRecording(
                    recordings[
                        randomIndex
                    ],
                    false
                );

            }
        );

    }


    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !currentRecording
            ) {

                return;

            }


            if (
                event.code === "Space" &&
                event.target.tagName !== "INPUT"
            ) {

                event.preventDefault();


                if (player.paused) {

                    player.play().catch(
                        () => {}
                    );

                } else {

                    player.pause();

                }

            }


            if (
                event.key === "ArrowLeft"
            ) {

                moveSelection(
                    -1
                );

            }


            if (
                event.key === "ArrowRight"
            ) {

                moveSelection(
                    1
                );

            }

        }
    );

})();