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
            const play = document.getElementById("slides-play-pause");
        
            if (!toolbar || !prev || !next || !play) return;
        
            /* container за стрелките */
        
            const nav = document.createElement("div");
            nav.id = "customNav";
        
            nav.appendChild(prev);
            nav.appendChild(next);
        
            /* settings бутон */
        
            const settings = document.createElement("div");
            settings.id = "slides-settings";
        
            settings.innerHTML = `
            <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="white" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.8 7.8 0 00-.1-1l2.1-1.6-2-3.4-2.5 1a7.9 7.9 0 00-1.7-1l-.4-2.7H9.6l-.4 2.7a7.9 7.9 0 00-1.7 1l-2.5-1-2 3.4L5.1 11a7.8 7.8 0 000 2L3 14.6l2 3.4 2.5-1c.5.4 1.1.7 1.7 1l.4 2.7h4.8l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4L20.9 13c.1-.3.1-.7.1-1z"/>
            </svg>
            `;
        
            /* rebuild toolbar */
        
            toolbar.innerHTML = "";
        
            toolbar.appendChild(play);
            toolbar.appendChild(nav);
            toolbar.appendChild(settings);
        
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

