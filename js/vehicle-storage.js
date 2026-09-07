// ============================================================
// AOISEIKOU — VEHICLE STORAGE
// GARAGE A—01
// ============================================================


const clock =
    document.getElementById(
        "clock"
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
   READY
========================================================= */

console.log(
    "AOISEIKOU // VEHICLE STORAGE // UPDATING SOON"
);