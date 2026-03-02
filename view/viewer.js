function parseHash() {
    const raw = window.location.hash.replace("#", "");

    const defaults = {
        talk: "talk1",
        transition: "fade",
        speed: 0.4,
        loop: false
    };

    if (!raw) return defaults;

    const [talkPart, queryPart] = raw.split("?");
    const params = new URLSearchParams(queryPart || "");

    return {
        talk: talkPart || defaults.talk,
        transition: params.get("transition") || defaults.transition,
        speed: parseFloat(params.get("speed")) || defaults.speed,
        loop: params.get("loop") === "true"
    };
}

function loadPresentation() {
    const { talk, transition, speed, loop } = parseHash();
    const file = `../presentations/${talk}.pptx`;

    document.getElementById("viewer").innerHTML = "";

    $("#viewer").pptxToHtml({
        pptxFileUrl: file,
        slideMode: true,
        keyBoardShortCut: true,
        mediaProcess: true,

        slideModeConfig: {
            transition: transition,
            transitionTime: speed,
            loop: loop,
            nav: true,
        },

        slideWidth: "100%",
        slideHeight: "100%"
    });
    waitAndScale();
}

window.addEventListener("hashchange", () => {
    window.location.reload();
});
window.addEventListener("load", loadPresentation);

document.getElementById("fsBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/* ============================= */
/* RESPONSIVE AUTO SCALE */
/* ============================= */

function scalePresentation() {

    const slide = document.querySelector(".slide");
    if (!slide) return;

    const wrapper = document.getElementById("viewerWrapper");

    const slideWidth = slide.offsetWidth;
    const slideHeight = slide.offsetHeight;

    const scaleX = wrapper.clientWidth / slideWidth;
    const scaleY = wrapper.clientHeight / slideHeight;

    const scale = Math.min(scaleX, scaleY);

    document.getElementById("viewer").style.transform =
        `scale(${scale})`;
}


/* чака pptxjs да render-не */
function waitAndScale() {

    const interval = setInterval(() => {

        const slide = document.querySelector(".slide");

        if (slide && slide.offsetWidth > 0) {

            clearInterval(interval);

            scalePresentation();

            // pptxjs прави късен layout update
            setTimeout(scalePresentation, 300);
            setTimeout(scalePresentation, 700);
        }

    }, 100);
}
/* resize events */
/* ============================= */
/* SMART AUTO RESCALE */
/* ============================= */

let resizeTimeout;

function triggerRescale() {

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        scalePresentation();
    }, 150);
}

window.addEventListener("resize", triggerRescale);
window.addEventListener("orientationchange", triggerRescale);

/* ============================= */
/* RESCALE WHEN SLIDE CHANGES */
/* ============================= */

document.addEventListener("click", () => {
    setTimeout(scalePresentation, 120);
});

document.addEventListener("keydown", () => {
    setTimeout(scalePresentation, 120);
});
