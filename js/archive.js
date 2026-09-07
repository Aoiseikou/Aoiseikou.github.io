// ============================================================
// AOISEIKOU — ARCHIVE
// STORAGE C—12
// ============================================================


const records = [
    ...document.querySelectorAll(
        ".record, .list-record"
    )
];


const listRecords = [
    ...document.querySelectorAll(
        ".list-record"
    )
];


const filterButtons = [
    ...document.querySelectorAll(
        ".index-card"
    )
];


const clock =
    document.getElementById(
        "clock"
    );


const drawer =
    document.getElementById(
        "drawer"
    );


const drawerClose =
    document.getElementById(
        "drawerClose"
    );


const drawerType =
    document.getElementById(
        "drawerType"
    );


const drawerTitle =
    document.getElementById(
        "drawerTitle"
    );


const drawerText =
    document.getElementById(
        "drawerText"
    );


const drawerCategory =
    document.getElementById(
        "drawerCategory"
    );


const drawerDate =
    document.getElementById(
        "drawerDate"
    );


const drawerOpen =
    document.getElementById(
        "drawerOpen"
    );


const searchPanel =
    document.getElementById(
        "searchPanel"
    );


const searchClose =
    document.getElementById(
        "searchClose"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


const toast =
    document.getElementById(
        "toast"
    );


const filterStatus =
    document.getElementById(
        "filterStatus"
    );



/* =========================================================
   HELPERS
========================================================= */

function getTypes(
    record
) {

    return (
        record.dataset.type ||
        ""
    )
        .split(" ")
        .filter(Boolean);

}


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
   DRAWER
========================================================= */

function openDrawer(
    record
) {

    if (!record) {
        return;
    }


    const types =
        getTypes(
            record
        );


    let recordType =
        "RECORD";


    if (
        types.includes(
            "event"
        )
    ) {

        recordType =
            "EVENT / BLOG";

    }
    else if (
        types.includes(
            "blog"
        )
    ) {

        recordType =
            "BLOG";

    }


    drawerType.textContent =
        recordType;


    drawerTitle.textContent =
        record.dataset.title ||
        "UNTITLED";


    drawerCategory.textContent =
        record.dataset.category ||
        "ARCHIVE";


    drawerDate.textContent =
        record.dataset.date ||
        "2026";


    drawerText.textContent =
        record.dataset.description ||
        "An archived record inside Aoiseikou.";


    drawer.classList.add(
        "open"
    );


    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    drawerOpen.onclick =
        () => {

            const link =
                record.dataset.link;


            if (
                link &&
                link !== "#"
            ) {

                window.location.href =
                    link;

                return;

            }


            showToast(
                "FILE NOT YET ASSIGNED"
            );

        };

}



function closeDrawer() {

    drawer.classList.remove(
        "open"
    );


    drawer.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


drawerClose.addEventListener(
    "click",
    closeDrawer
);



/* =========================================================
   RECORD CLICKING
========================================================= */

records.forEach(
    record => {

        record.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "a"
                    )
                ) {

                    return;

                }


                /*
                 * Clicking a record opens its
                 * drawer only.
                 *
                 * No automatic scrolling.
                 */

                openDrawer(
                    record
                );

            }
        );

    }
);



/* =========================================================
   FILTERING
========================================================= */

function filterRecords(
    filter
) {

    listRecords.forEach(
        record => {

            const types =
                getTypes(
                    record
                );


            const visible =
                filter === "all" ||
                types.includes(
                    filter
                );


            record.classList.toggle(
                "hidden",
                !visible
            );

        }
    );


    filterButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.filter ===
                    filter
            );

        }
    );


    if (
        filter === "all"
    ) {

        filterStatus.textContent =
            "SHOWING ALL RECORDS";

        return;

    }


    const count =
        listRecords.filter(
            record =>
                getTypes(
                    record
                ).includes(
                    filter
                )
        ).length;


    const label =
        filter.toUpperCase();


    filterStatus.textContent =
        `SHOWING ${count} ${label} RECORD${count === 1 ? "" : "S"}`;

}


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                /*
                 * Filter only.
                 * No scrolling.
                 */

                filterRecords(
                    button.dataset.filter
                );

            }
        );

    }
);



/* =========================================================
   SEARCH
========================================================= */

function openSearch() {

    searchPanel.classList.add(
        "open"
    );


    searchPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    searchInput.value =
        "";


    searchResults.innerHTML =
        "";


    setTimeout(
        () => {

            searchInput.focus();

        },
        50
    );

}



function closeSearch() {

    searchPanel.classList.remove(
        "open"
    );


    searchPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


searchClose.addEventListener(
    "click",
    closeSearch
);



searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!query) {

            searchResults.innerHTML =
                "";

            return;

        }


        const matches =
            listRecords.filter(
                record => {

                    const title =
                        (
                            record.dataset.title ||
                            ""
                        )
                        .toLowerCase();


                    const search =
                        (
                            record.dataset.search ||
                            ""
                        )
                        .toLowerCase();


                    const type =
                        (
                            record.dataset.type ||
                            ""
                        )
                        .toLowerCase();


                    const category =
                        (
                            record.dataset.category ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        title.includes(
                            query
                        ) ||

                        search.includes(
                            query
                        ) ||

                        type.includes(
                            query
                        ) ||

                        category.includes(
                            query
                        )

                    );

                }
            );


        if (
            matches.length === 0
        ) {

            searchResults.innerHTML = `

                <p>
                    NO RESULTS FOR
                    "${query.toUpperCase()}"
                </p>

            `;

            return;

        }


        searchResults.innerHTML =
            matches
                .map(
                    record => {

                        return `

                            <button
                                class="search-result"
                                data-title="${record.dataset.title}"
                                type="button"
                            >

                                <span>
                                    ${record.dataset.title}
                                </span>

                                <span>
                                    ${record.dataset.category}
                                </span>

                            </button>

                        `;

                    }
                )
                .join("");


        searchResults
            .querySelectorAll(
                ".search-result"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const target =
                                listRecords.find(
                                    record =>
                                        record.dataset.title ===
                                        button.dataset.title
                                );


                            if (!target) {
                                return;
                            }


                            closeSearch();


                            /*
                             * Search opens the drawer
                             * without moving the page.
                             */

                            openDrawer(
                                target
                            );

                        }
                    );

                }
            );

    }
);



/* =========================================================
   RANDOM
========================================================= */

function randomRecord() {

    if (
        listRecords.length === 0
    ) {

        return;

    }


    const record =
        listRecords[
            Math.floor(
                Math.random() *
                listRecords.length
            )
        ];


    closeSearch();


    /*
     * RANDOM intentionally navigates to
     * the selected record.
     */

    record.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "center"
        }
    );


    setTimeout(
        () => {

            openDrawer(
                record
            );

        },
        400
    );

}



/* =========================================================
   TOP CONTROLS
========================================================= */

document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const action =
                        button.dataset.action;


                    if (
                        action === "random"
                    ) {

                        randomRecord();

                    }


                    if (
                        action === "search"
                    ) {

                        openSearch();

                    }

                }
            );

        }
    );



/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {


        if (
            event.key === "Escape"
        ) {

            closeDrawer();

            closeSearch();

        }


        if (

            event.key === "/" &&

            document.activeElement.tagName !==
                "INPUT"

        ) {

            event.preventDefault();

            openSearch();

        }


        if (

            event.key.toLowerCase() ===
                "r" &&

            document.activeElement.tagName !==
                "INPUT"

        ) {

            randomRecord();

        }

    }
);



/* =========================================================
   SUBTLE LIFE
========================================================= */

document
    .querySelectorAll(
        ".record, .index-card, .related-card"
    )
    .forEach(
        (element, index) => {

            const duration =
                4800 +
                index * 260;


            const amount =
                index % 2 === 0
                    ? 1
                    : 2;


            element.animate(
                [

                    {
                        translate:
                            "0 0"
                    },

                    {
                        translate:
                            `0 ${amount}px`
                    },

                    {
                        translate:
                            "0 0"
                    }

                ],
                {

                    duration:
                        duration,

                    iterations:
                        Infinity,

                    easing:
                        "ease-in-out"

                }
            );

        }
    );



/* =========================================================
   READY
========================================================= */

console.log(
    "AOISEIKOU // ARCHIVE STORAGE ONLINE"
);