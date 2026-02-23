function parseHash() {
    const raw = window.location.hash.replace("#", "");

    const defaults = {
        talk: "talk1",
        transition: "fade",
        speed: 0.4,
        autoplay: false,
        loop: false,
        start: 1
    };

    if (!raw) return defaults;

    const [talkPart, queryPart] = raw.split("?");
    const params = new URLSearchParams(queryPart || "");

    return {
        talk: talkPart || defaults.talk,
        transition: params.get("transition") || defaults.transition,
        speed: parseFloat(params.get("speed")) || defaults.speed,
        autoplay: params.get("autoplay") ? parseFloat(params.get("autoplay")) : defaults.autoplay,
        loop: params.get("loop") === "true",
        start: parseInt(params.get("start")) || defaults.start
    };
}

function loadPresentation() {

    // 🔥 HARD RESET – маха старите event listeners и divs2slides instance
    const oldViewer = document.getElementById("viewer");
    const newViewer = oldViewer.cloneNode(false);
    oldViewer.replaceWith(newViewer);

    const { talk, transition, speed, autoplay, loop, start } = parseHash();
    const file = `../presentations/${talk}.pptx`;

    $("#viewer").pptxToHtml({
        pptxFileUrl: file,
        slideMode: true,
        keyBoardShortCut: false,
        mediaProcess: true,

        slideModeConfig: {
            first: start,
            transition: transition,
            transitionTime: speed,
            autoSlide: autoplay,
            loop: loop,
            nav: true,
            showSlideNum: true,
            showTotalSlideNum: true,
            keyBoardShortCut: true
        },

        slideWidth: "100%",
        slideHeight: "100%"
    });
}

window.addEventListener("hashchange", () => {
    location.reload();
});
window.addEventListener("load", loadPresentation);

document.getElementById("fsBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
