// ============================================================
// AOISEIKOU — HOME
// THE WAREHOUSE
// ============================================================


const objects = [
    ...document.querySelectorAll(
        ".object"
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



/* =========================================================
   OBJECT INFORMATION
========================================================= */

const objectInfo = {

    pinned: {

        type:
            "PINNED",

        category:
            "BLOG / EVENT",

        date:
            "02.05.2026",

        text:
            "Senka 47 × RCNC Autoshow. " +
            "Blog 006 documenting one autoshow " +
            "from the Aoiseikou archive."

    }

};



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
    object
) {

    if (!object) {
        return;
    }


    const type =
        object.dataset.type;


    const info =
        objectInfo[type] || {

            type:
                "OBJECT",

            category:
                "WAREHOUSE",

            date:
                "2026",

            text:
                "An object inside the Aoiseikou warehouse."

        };


    const destination =
        object.dataset.link ||
        "";


    drawerType.textContent =
        info.type;


    drawerTitle.textContent =
        object.dataset.title ||
        "UNTITLED";


    drawerCategory.textContent =
        info.category;


    drawerDate.textContent =
        info.date;


    drawerText.textContent =
        info.text;


    drawer.classList.add(
        "open"
    );


    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";


    if (destination) {

        drawerOpen.textContent =
            "OPEN OBJECT →";


        drawerOpen.onclick =
            () => {

                window.location.href =
                    destination;

            };

    }
    else {

        drawerOpen.textContent =
            "NO FILE ASSIGNED";


        drawerOpen.onclick =
            () => {

                showToast(
                    "THIS OBJECT HAS NO PAGE YET."
                );

            };

    }

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
   OBJECT CLICKING
========================================================= */

objects.forEach(
    object => {

        object.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "a"
                    )
                ) {

                    return;

                }


                openDrawer(
                    object
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
            objects.filter(
                object => {

                    const title =
                        (
                            object.dataset.title ||
                            ""
                        )
                        .toLowerCase();


                    const type =
                        (
                            object.dataset.type ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        title.includes(
                            query
                        ) ||

                        type.includes(
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
                    object => {

                        return `

                            <button
                                class="search-result"
                                data-title="${object.dataset.title}"
                                type="button"
                            >

                                <span>
                                    ${object.dataset.title}
                                </span>

                                <span>
                                    ${object.dataset.type.toUpperCase()}
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
                                objects.find(
                                    object =>
                                        object.dataset.title ===
                                        button.dataset.title
                                );


                            if (!target) {
                                return;
                            }


                            closeSearch();


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

function randomObject() {

    if (
        objects.length === 0
    ) {

        return;

    }


    const object =
        objects[
            Math.floor(
                Math.random() *
                objects.length
            )
        ];


    closeSearch();


    object.scrollIntoView(
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
                object
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

                        randomObject();

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

            randomObject();

        }

    }
);



/* =========================================================
   MAINTENANCE PANEL
========================================================= */

const maintenanceSwitches = [
    ...document.querySelectorAll(
        ".maintenance-switch"
    )
];


const maintenanceTime =
    document.getElementById(
        "maintenanceTime"
    );


const maintenanceFill =
    document.getElementById(
        "maintenanceFill"
    );


const maintenancePercent =
    document.getElementById(
        "maintenancePercent"
    );


const maintenanceMessage =
    document.getElementById(
        "maintenanceMessage"
    );


const initializeButton =
    document.getElementById(
        "initializeButton"
    );


const maintenanceResult =
    document.getElementById(
        "maintenanceResult"
    );



let maintenanceValue =
    74;


let maintenanceInitialized =
    false;



const maintenanceMessages = [

    "SYSTEM IS ALREADY RUNNING.",

    "NO MAINTENANCE REQUIRED.",

    "WHY DID YOU PRESS THAT?",

    "FACILITIES HAS BEEN NOTIFIED.",

    "THIS DID NOTHING.",

    "SYSTEM REMAINS OPERATIONAL.",

    "PLEASE STOP MAINTAINING."

];



/* =========================================================
   SWITCHES
========================================================= */

maintenanceSwitches.forEach(
    switchButton => {

        switchButton.addEventListener(
            "click",
            () => {

                switchButton.classList.toggle(
                    "active"
                );


                const activeCount =
                    document.querySelectorAll(
                        ".maintenance-switch.active"
                    ).length;


                maintenanceValue =
                    Math.min(
                        100,
                        68 +
                        (activeCount * 7)
                    );


                maintenanceFill.style.width =
                    `${maintenanceValue}%`;


                maintenancePercent.textContent =
                    `${maintenanceValue}%`;


                if (
                    activeCount ===
                    maintenanceSwitches.length
                ) {

                    maintenanceMessage.textContent =
                        "ALL SYSTEMS ENABLED. NOTHING CHANGED.";

                }
                else if (
                    activeCount === 0
                ) {

                    maintenanceMessage.textContent =
                        "SYSTEM IS ALREADY RUNNING.";

                }
                else {

                    maintenanceMessage.textContent =
                        maintenanceMessages[
                            Math.floor(
                                Math.random() *
                                maintenanceMessages.length
                            )
                        ];

                }

            }
        );

    }
);



/* =========================================================
   INITIALIZE
========================================================= */

initializeButton.addEventListener(
    "click",
    () => {

        maintenanceInitialized =
            !maintenanceInitialized;


        if (
            maintenanceInitialized
        ) {

            initializeButton.textContent =
                "REINITIALIZE";


            maintenanceResult.textContent =
                "INITIALIZATION COMPLETE. NOTHING HAPPENED.";


            maintenanceMessage.textContent =
                "SYSTEM WAS ALREADY INITIALIZED.";


            maintenanceValue =
                100;

        }
        else {

            initializeButton.textContent =
                "INITIALIZE";


            maintenanceResult.textContent =
                "AWAITING INPUT...";


            maintenanceMessage.textContent =
                "SYSTEM IS ALREADY RUNNING.";


            maintenanceValue =
                74;

        }


        maintenanceFill.style.width =
            `${maintenanceValue}%`;


        maintenancePercent.textContent =
            `${maintenanceValue}%`;

    }
);



/* =========================================================
   MAINTENANCE CLOCK
========================================================= */

function updateMaintenanceTime() {

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


    const seconds =
        String(
            now.getSeconds()
        ).padStart(
            2,
            "0"
        );


    maintenanceTime.textContent =
        `${hours}:${minutes}:${seconds}`;

}


updateMaintenanceTime();


setInterval(
    updateMaintenanceTime,
    1000
);



/* =========================================================
   RANDOM MAINTENANCE MESSAGE
========================================================= */

setInterval(
    () => {

        if (
            maintenanceInitialized
        ) {
            return;
        }


        if (
            Math.random() >
            .65
        ) {

            maintenanceMessage.textContent =
                maintenanceMessages[
                    Math.floor(
                        Math.random() *
                        maintenanceMessages.length
                    )
                ];

        }

    },
    5500
);



/* =========================================================
   READY
========================================================= */

console.log(
    "AOISEIKOU // WAREHOUSE ONLINE // MAINTENANCE STATION READY"
);