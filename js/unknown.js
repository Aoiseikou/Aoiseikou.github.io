// ============================================================
// AOISEIKOU — UNKNOWN STORAGE
// STORAGE X—00
// ============================================================


const clock =
    document.getElementById(
        "clock"
    );


const randomButton =
    document.getElementById(
        "randomButton"
    );


const records = [
    ...document.querySelectorAll(
        ".unknown-record"
    )
];


const audioPlayer =
    document.getElementById(
        "audioPlayer"
    );


const audioButtons = [
    ...document.querySelectorAll(
        ".audio-play"
    )
];


const toast =
    document.getElementById(
        "toast"
    );



/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();


    const hours =
        String(
            now.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            now.getMinutes()
        ).padStart(
            2,
            "0"
        );


    clock.textContent =
        `${hours}:${minutes}`;

}


updateClock();


setInterval(
    updateClock,
    1000
);



/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1700
        );

}



/* =========================================================
   RANDOM
========================================================= */

if (
    randomButton
) {

    randomButton.addEventListener(
        "click",
        () => {

            if (
                records.length === 0
            ) {

                return;

            }


            const target =
                records[
                    Math.floor(
                        Math.random() *
                        records.length
                    )
                ];


            target.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );


            target.classList.add(
                "random-highlight"
            );


            setTimeout(
                () => {

                    target.classList.remove(
                        "random-highlight"
                    );

                },
                1200
            );

        }
    );

}



/* =========================================================
   AUDIO
========================================================= */

audioButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const source =
                    button.dataset.audio;


                /*
                 * Empty paths are intentional right now.
                 * Replace data-audio with a real path when
                 * you add an audio file.
                 */

                if (
                    !source
                ) {

                    showToast(
                        "AUDIO FILE NOT ASSIGNED."
                    );

                    return;

                }


                if (
                    audioPlayer.src ===
                    new URL(
                        source,
                        window.location.href
                    ).href
                ) {

                    if (
                        audioPlayer.paused
                    ) {

                        audioPlayer.play();

                        button.textContent =
                            "STOP";

                    }
                    else {

                        audioPlayer.pause();

                        button.textContent =
                            "PLAY";

                    }

                    return;

                }


                audioButtons.forEach(
                    otherButton => {

                        otherButton.textContent =
                            "PLAY";

                    }
                );


                audioPlayer.src =
                    source;


                audioPlayer.currentTime =
                    0;


                audioPlayer.play()
                    .then(
                        () => {

                            button.textContent =
                                "STOP";

                        }
                    )
                    .catch(
                        () => {

                            button.textContent =
                                "PLAY";

                            showToast(
                                "COULD NOT PLAY FILE."
                            );

                        }
                    );

            }
        );

    }
);



/* =========================================================
   AUDIO END
========================================================= */

audioPlayer.addEventListener(
    "ended",
    () => {

        audioButtons.forEach(
            button => {

                button.textContent =
                    "PLAY";

            }
        );

    }
);



/* =========================================================
   AUDIO ERROR
========================================================= */

audioPlayer.addEventListener(
    "error",
    () => {

        audioButtons.forEach(
            button => {

                button.textContent =
                    "PLAY";

            }
        );


        showToast(
            "AUDIO FILE COULD NOT BE LOADED."
        );

    }
);



/* =========================================================
   READY
========================================================= */

console.log(
    "AOISEIKOU // UNKNOWN STORAGE ONLINE // X—00"
);