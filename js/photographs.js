/* =========================================================
   AOISEIKOU — PHOTOGRAPHS
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
       IMAGE VIEWER
    ===================================================== */

    const viewer =
        document.getElementById("viewer");

    const viewerImage =
        document.getElementById("viewer-image");

    const viewerCaption =
        document.getElementById("viewer-caption");

    const viewerClose =
        document.getElementById("viewer-close");


    const photoButtons =
        document.querySelectorAll(
            ".photo-open"
        );


    function openViewer(photo) {

        if (
            !viewer ||
            !viewerImage ||
            !viewerCaption
        ) {
            return;
        }


        const image =
            photo.querySelector("img");

        const caption =
            photo.querySelector(".photo-caption");


        if (!image) {
            return;
        }


        viewerImage.src =
            image.src;


        viewerImage.alt =
            image.alt;


        if (caption) {

            viewerCaption.textContent =
                caption.textContent.trim();

        } else {

            viewerCaption.textContent =
                image.alt;

        }


        viewer.classList.add(
            "is-open"
        );


        viewer.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeViewer() {

        if (!viewer) {
            return;
        }


        viewer.classList.remove(
            "is-open"
        );


        viewer.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    photoButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const photo =
                        button.closest(
                            ".photo-object"
                        );


                    if (photo) {
                        openViewer(photo);
                    }

                }
            );

        }
    );


    if (viewerClose) {

        viewerClose.addEventListener(
            "click",
            closeViewer
        );

    }


    if (viewer) {

        viewer.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === viewer
                ) {
                    closeViewer();
                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeViewer();

            }

        }
    );


    /* =====================================================
       RANDOM PHOTO
    ===================================================== */

    const randomButton =
        document.getElementById(
            "random-photo"
        );


    if (randomButton) {

        randomButton.addEventListener(
            "click",
            (event) => {

                event.preventDefault();


                const photos =
                    document.querySelectorAll(
                        ".photo-object"
                    );


                if (!photos.length) {
                    return;
                }


                const randomIndex =
                    Math.floor(
                        Math.random() *
                        photos.length
                    );


                const selected =
                    photos[randomIndex];


                selected.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                setTimeout(
                    () => {

                        const button =
                            selected.querySelector(
                                ".photo-open"
                            );


                        if (button) {
                            button.focus();
                        }

                    },
                    450
                );

            }
        );

    }

})();