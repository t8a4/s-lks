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
    waitForToolbar();
    setTimeout(() => {
        
        const next = document.getElementById("slides-next");
        if(!next) return;
    
        const settings = document.createElement("div");
        settings.id = "slides-settings";
        
    
        settings.innerHTML = `
            <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="white" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.8 7.8 0 00-.1-1l2.1-1.6-2-3.4-2.5 1a7.9 7.9 0 00-1.7-1l-.4-2.7H9.6l-.4 2.7a7.9 7.9 0 00-1.7 1l-2.5-1-2 3.4L5.1 11a7.8 7.8 0 000 2L3 14.6l2 3.4 2.5-1c.5.4 1.1.7 1.7 1l.4 2.7h4.8l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4L20.9 13c.1-.3.1-.7.1-1z"/>
            </svg>
        `;
    
        next.after(settings);
    
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

function addSettingsButton(){

    const toolbar = document.querySelector(".slides-toolbar");
    if(!toolbar) return false;

    if(document.getElementById("slides-settings")) return true;

    const settings = document.createElement("div");
    settings.id = "slides-settings";

    settings.innerHTML = `
        <svg viewBox="0 0 24 24" width="22" height="22">
            <path fill="white" d="M12 8a4 4 0 100 8 4 4 0 000-8zm9 4a7.8 7.8 0 00-.1-1l2.1-1.6-2-3.4-2.5 1a7.9 7.9 0 00-1.7-1l-.4-2.7H9.6l-.4 2.7a7.9 7.9 0 00-1.7 1l-2.5-1-2 3.4L5.1 11a7.8 7.8 0 000 2L3 14.6l2 3.4 2.5-1c.5.4 1.1.7 1.7 1l.4 2.7h4.8l.4-2.7c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4L20.9 13c.1-.3.1-.7.1-1z"/>
        </svg>
    `;

    toolbar.appendChild(settings);
    settings.onclick = () => {
        
        createSettingsPopup();
    
        const popup = document.getElementById("settingsPopup");
        popup.classList.add("show");
    
    };

    return true;
}
function waitForToolbar(){

    const interval = setInterval(()=>{

        if(addSettingsButton()){
            clearInterval(interval);
        }

    },200);

}
function createSettingsPopup(){

    if(document.getElementById("settingsPopup")) return;

    const popup = document.createElement("div");
    popup.id = "settingsPopup";

    popup.innerHTML = `
    const current = parseHash();
        <div class="settingsBox">

            <div class="settingsLogo">
                <img src="logo.svg" alt="logo">
            </div>

            <div class="settingsTitle">⚙ Settings</div>

            <label>
                Speed
                <input id="setSpeed" type="number" step="0.1" value="${current.speed}">
            </label>

            <label>
                Transition
                <select id="setTransition">
                    <option value="fade">fade</option>
                    <option value="slide">slide</option>
                    <option value="default">default</option>
                    <option value="random">random</option>
                </select>
            </label>

            <label>
                Loop
                <select id="setLoop">
                    <option value="true">on</option>
                    <option value="false">off</option>
                </select>
            </label>

            <label>
                Autoplay delay
                <input id="setAutoplay" type="number" step="1" placeholder="0 = off">
            </label>

            <button id="applySettings">Apply</button>

        </div>
    `;

    document.body.appendChild(popup);
    document.getElementById("setTransition").value = current.transition;
    document.getElementById("setLoop").value = current.loop;
}
document.addEventListener("click",(e)=>{

    const popup = document.getElementById("settingsPopup");
    const box = document.querySelector(".settingsBox");

    if(!popup) return;

    if(popup.classList.contains("show")){

        if(!box.contains(e.target) && e.target.id !== "slides-settings"){
            popup.classList.remove("show");
        }

    }

});
document.addEventListener("click",(e)=>{

    if(e.target.id === "applySettings"){

        const speed = parseFloat(document.getElementById("setSpeed").value);
        const transition = document.getElementById("setTransition").value;
        const loop = document.getElementById("setLoop").value === "true";
        const autoplay = parseFloat(document.getElementById("setAutoplay").value);

        if(window.pptxjslideObj){

            window.pptxjslideObj.settings.transition = transition;
            window.pptxjslideObj.settings.transitionTime = speed;
            window.pptxjslideObj.settings.loop = loop;

            if(autoplay > 0){
                window.pptxjslideObj.settings.autoSlide = autoplay;
            }else{
                window.pptxjslideObj.settings.autoSlide = false;
            }

        }

        document.getElementById("settingsPopup").classList.remove("show");

    }

});
