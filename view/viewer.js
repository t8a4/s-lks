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
    setTimeout(fitSlide, 600);
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
/* ========================= */
/* SCALE PRESENTATION */
/* ========================= */

function fitSlide() {

    const slide = document.querySelector(".slide");
    const viewer = document.getElementById("viewer");

    if (!slide || !viewer) return;

    const scaleX = viewer.clientWidth / slide.offsetWidth;
    const scaleY = viewer.clientHeight / slide.offsetHeight;

    const scale = Math.min(scaleX, scaleY);

    slide.style.transform = `scale(${scale})`;
}
/* ========================= */
/* RESIZE FIX */
/* ========================= */

window.addEventListener("resize", () => {
    setTimeout(fitSlide, 150);
});

window.addEventListener("orientationchange", () => {
    setTimeout(fitSlide, 300);
});
