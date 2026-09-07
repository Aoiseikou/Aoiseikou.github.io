/* =========================================================
   AOISEIKOU — MEDIA
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
       RANDOM MEDIA DEPARTMENT
    ===================================================== */

    const randomButton =
        document.getElementById("random-media");


    const departments = [

        "films.html",
        "dvds.html",
        "raw.html",
        "audios.html",
        "photographs.html"

    ];


    if (randomButton) {

        randomButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const randomIndex =
                    Math.floor(
                        Math.random() *
                        departments.length
                    );


                window.location.href =
                    departments[randomIndex];

            }
        );

    }

})();