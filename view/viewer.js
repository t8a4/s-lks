function getTalkFromHash() {
    const hash = window.location.hash.replace("#", "");
    return hash || "talk1";
}

function loadPresentation() {
    const talk = getTalkFromHash();
    const file = `../presentations/${talk}.pptx`;

    document.getElementById("viewer").innerHTML = "";

    $("#viewer").pptxToHtml({
    pptxFileUrl: file,
    slideMode: true,
    keyBoardShortCut: true,
    mediaProcess: true,
    slideModeConfig: {
        transition: "random"
    },
    slideWidth: "100%",
    slideHeight: "100%"
});
    setTimeout(() => {
    if (window.divs2slides) {
        window.divs2slides.transition = "fade";
        window.divs2slides.transitionTime = 0.4;
    }
}, 600);
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
