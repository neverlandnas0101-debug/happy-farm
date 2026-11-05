// ================= 🔨 瘋狂打地鼠 =================
let activeHole = null, moleClicked = false, moleSpeed = 1000, moleLoop, lastThreshold = 0;

function startWhackGame() {
    initGame("🔨 瘋狂打地鼠 (逢 10 分加速)", false, true);
    let stage = document.getElementById('gameStage');
    stage.style.background = "#7cfc00"; 
    
    let gridHTML = `<div id="whackGrid">`;
    for(let i=0; i<9; i++) { gridHTML += `<div class="hole" onclick="whackMole(this)"><span class="mole">🐹</span></div>`; }
    gridHTML += `</div><div id="gameMsg"></div>`;
    stage.innerHTML = gridHTML;

    activeHole = null; moleClicked = false; moleSpeed = 1000; lastThreshold = 0; 
    startMoleLoop();
}

function startMoleLoop() {
    moleLoop = setInterval(() => {
        if(!isGameRunning) return;
        if(activeHole && !moleClicked) { loseLife(); }
        
        let holes = document.querySelectorAll('.hole');
        holes.forEach(h => h.classList.remove('active')); 
        moleClicked = false; activeHole = null;

        if(lives > 0) {
            activeHole = holes[Math.floor(Math.random() * 9)];
            activeHole.classList.add('active'); 
        }
    }, moleSpeed); 
    gameIntervals.push(moleLoop);
}

function whackMole(hole) {
    if(!isGameRunning) return;
    if(hole.classList.contains('active')) {
        addScore(1); moleClicked = true; hole.classList.remove('active'); 
        
        let moleText = hole.querySelector('.mole'); moleText.innerText = '😵';
        let t = setTimeout(() => { moleText.innerText = '🐹'; }, 300);
        gameIntervals.push(t);

        let currentThreshold = Math.floor(score / 10);
        if (currentThreshold > lastThreshold) {
            lastThreshold = currentThreshold;
            moleSpeed = Math.max(400, moleSpeed - 150); 
            clearInterval(moleLoop); startMoleLoop();
        }
    }
}