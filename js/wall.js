// ============================================================
// AOISEIKOU — THE WALL
// DISPLAY D—03
// ============================================================


const clock =
    document.getElementById("clock");


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
   RANDOM
   Nothing exists on the Wall yet, so this simply reports
   that the display is currently empty.
========================================================= */

const randomButton =
    document.querySelector(
        '[data-action="random"]'
    );


if (randomButton) {

    randomButton.addEventListener(
        "click",
        () => {

            alert(
                "THE WALL IS EMPTY."
            );

        }
    );

}


/* =========================================================
   READY
========================================================= */

console.log(
    "AOISEIKOU // WALL DISPLAY ONLINE // 000 OBJECTS"
);