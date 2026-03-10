function parseHash() {
    const raw = window.location.hash.replace("#", "");

    const defaults = {
        talk: "talk1",
        transition: "fade",
        speed: 0.4,
        loop: false,
        autoplay: 5
    };

    if (!raw) return defaults;

    const [talkPart, queryPart] = raw.split("?");
    const params = new URLSearchParams(queryPart || "");

    return {
        talk: talkPart || defaults.talk,
        transition: params.get("transition") || defaults.transition,
        speed: parseFloat(params.get("speed")) || defaults.speed,
        loop: params.get("loop") === "true",
        autoplay: params.get("autoplay") !== null
            ? parseFloat(params.get("autoplay"))
            : defaults.autoplay
    };
}

function loadPresentation() {
    const { talk, transition, speed, loop, autoplay } = parseHash();
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
        autoSlide: autoplay,
        nav: true,
    },

        slideWidth: 1280,
        slideHeight: 720
    });
    setTimeout(fitPresentation, 700);
    waitForToolbar();
    
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
        <svg height="23px" width="23px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="white"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:white;} </style> <g> <path class="st0" d="M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252 c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366 c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586 c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363 c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005 c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675 c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366 c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552 l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805 c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303 c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799 c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364 c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005 c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007 c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366 c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799 c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698 c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088 C339.815,267.771,320.972,313.262,281.292,329.698z"></path> </g> </g>
        </svg>
    `;

    toolbar.appendChild(settings);

    settings.addEventListener("click", (e) => {

        e.stopPropagation();
    
        createSettingsPopup();
    
        const popup = document.getElementById("settingsPopup");
        popup.classList.add("show");
    
    });

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

    let popup = document.getElementById("settingsPopup");

    if(!popup){

        const current = parseHash();

        popup = document.createElement("div");
        popup.id = "settingsPopup";

        popup.innerHTML = `
        <div class="settingsBox">

            <div class="settingsLogo">
                <img src="logo.svg">
            </div>

            <div class="settingsHeader">
                <span>⚙ Settings</span>
                <button id="closeSettings">✕</button>
            </div>
    
            <label>
                Speed
                <div class="sliderRow">
                    <input id="setSpeed" type="range" min="0.1" max="2" step="0.1" value="${current.speed}">
                    <span id="speedValue">${current.speed}</span>
                </div>
            </label>

            <label>
                Transition
                <select id="setTransition">
                    <option value="fade">fade</option>
                    <option value="slid">slid</option>
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
                <div class="delayRow">
                    <button id="delayMinus">◀</button>
                    <span id="delayValue">${current.autoplay}</span>
                    <button id="delayPlus">▶</button>
                </div>
            </label>

            <button id="applySettings">Apply</button>

        </div>
        `;

        document.body.appendChild(popup);

        const speedSlider = document.getElementById("setSpeed");
        const speedValue = document.getElementById("speedValue");
        
        speedSlider.oninput = () => {
            speedValue.textContent = speedSlider.value;
        };
        let delay = current.autoplay || 0;

        const delayValue = document.getElementById("delayValue");
        
        document.getElementById("delayMinus").onclick = () => {
            if(delay > 0){
                delay--;
                delayValue.textContent = delay;
            }
        };
        
        document.getElementById("delayPlus").onclick = () => {
            delay++;
            delayValue.textContent = delay;
        };
        document.getElementById("applySettings").onclick = () => {

            const speed = parseFloat(document.getElementById("setSpeed").value);
            const transition = document.getElementById("setTransition").value;
            const loop = document.getElementById("setLoop").value;
            const delay = parseFloat(document.getElementById("delayValue").textContent);
            
            const talk = parseHash().talk;
        
            let hash = `#${talk}?transition=${transition}&speed=${speed}&loop=${loop}`;
        
            if(delay && delay > 0){
                hash += `&autoplay=${delay}`;
            }
        
            window.location.hash = hash;
        
        };
        
        document.getElementById("closeSettings").onclick = () => {
            popup.classList.remove("show");
        };
        popup.addEventListener("click", (e)=>{
            e.stopPropagation();
        });

        document.getElementById("setTransition").value = current.transition;
        document.getElementById("setLoop").value = current.loop;

    }

}
