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

        slideWidth: 1280,
        slideHeight: 720
    });
    setTimeout(scalePresentation, 500);
    setTimeout(fitSlide, 700);
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
function scalePresentation() {

    const baseWidth = 1280;
    const baseHeight = 720;

    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;

    const scale = Math.min(scaleX, scaleY);

    const container = document.getElementById("scaleContainer");

    container.style.transform =
        `translate(-50%, -50%) scale(${scale})`;
}
window.addEventListener("resize", scalePresentation);
window.addEventListener("orientationchange", scalePresentation);
function fitSlide() {

    const baseWidth = 1280;
    const baseHeight = 720;

    const scaleX = window.innerWidth / baseWidth;
    const scaleY = window.innerHeight / baseHeight;

    const scale = Math.min(scaleX, scaleY);

    document.getElementById("scaleContainer")
        .style.transform = `scale(${scale})`;
}
window.addEventListener("resize", fitSlide);
window.addEventListener("orientationchange", () => {
    setTimeout(fitSlide, 300);
});
