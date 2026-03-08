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
    setTimeout(fitPresentation, 700);
    setTimeout(() => {

        const toolbar = document.querySelector(".slides-toolbar");
        const prev = document.getElementById("slides-prev");
        const next = document.getElementById("slides-next");

        if (!toolbar || !prev || !next) return;

        const nav = document.createElement("div");
        nav.id = "customNav";
        
        nav.appendChild(prev);
        nav.appendChild(next);
        
        toolbar.appendChild(nav);
        prev.style.display = "flex";

    }, 900);
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

function fitPresentation() {

    const viewer = document.getElementById("viewer");

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const scaleX = screenW / 1280;
    const scaleY = screenH / 720;

    const scale = Math.min(scaleX, scaleY);

    viewer.style.transform =
        `scale(${scale})`;
}
window.addEventListener("resize", fitPresentation);

window.addEventListener("orientationchange", () => {
    setTimeout(fitPresentation, 300);
});

