// ============================================================
// AOISEIKOU — BLOG
// ARTICLE PAGE
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
   IMAGE SAFETY
========================================================= */

document
    .querySelectorAll(
        "img"
    )
    .forEach(
        image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-missing"
                    );

                }
            );

        }
    );


/* =========================================================
   READY
========================================================= */

console.log(
    "AOISEIKOU // BLOG DOCUMENT ONLINE"
);