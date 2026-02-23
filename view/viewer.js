function parseHash() {
    const raw = window.location.hash.replace("#", "");

    if (!raw) {
        return { talk: "talk1", transition: "fade" };
    }

    const [talkPart, queryPart] = raw.split("?");

    let transition = "fade";

    if (queryPart) {
        const params = new URLSearchParams(queryPart);
        if (params.get("transition")) {
            transition = params.get("transition");
        }
    }

    return {
        talk: talkPart || "talk1",
        transition: transition
    };
}

function loadPresentation() {
    const { talk, transition } = parseHash();
    const file = `../presentations/${talk}.pptx`;

    document.getElementById("viewer").innerHTML = "";

    $("#viewer").pptxToHtml({
        pptxFileUrl: file,
        slideMode: true,
        keyBoardShortCut: true,
        mediaProcess: true,

        slideModeConfig: {
            transition: transition,
            transitionTime: 0.3,

        },

        slideWidth: "100%",
        slideHeight: "100%"
    });
}

window.addEventListener("hashchange", loadPresentation);
window.addEventListener("load", loadPresentation);

document.getElementById("fsBtn").addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
