/* =====================================================
   AOISEIKOU
   ENTRY PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const enterButton =
        document.querySelector(".enter");


    /*
     * ENTER
     *
     * A small transition before moving
     * into the main warehouse.
     */

    if (enterButton) {

        enterButton.addEventListener("click", (event) => {

            event.preventDefault();

            const destination =
                enterButton.getAttribute("href");


            document.body.classList.add("leaving");


            setTimeout(() => {

                window.location.href =
                    destination;

            }, 280);

        });

    }


    /*
     * Keep the entry page quiet.
     *
     * No cursor gimmicks.
     * No looping animations.
     * No constantly moving flower.
     * The flower only appears once on load.
     */

});