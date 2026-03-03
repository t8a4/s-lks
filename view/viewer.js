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
function fitViewer() {

    const wrapper = document.getElementById("viewerWrapper");
    const viewer = document.getElementById("viewer");

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const targetRatio = 16 / 9;

    let width, height;

    if (vw / vh > targetRatio) {
        height = vh;
        width = vh * targetRatio;
    } else {
        width = vw;
        height = vw / targetRatio;
    }

    viewer.style.width = width + "px";
    viewer.style.height = height + "px";

    viewer.style.left = (vw - width) / 2 + "px";
    viewer.style.top = (vh - height) / 2 + "px";
}

window.addEventListener("resize", fitViewer);
window.addEventListener("orientationchange", fitViewer);
