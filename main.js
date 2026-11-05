// ================= 確保全域優先定義的鍵盤事件控制函數 =================
let currentKeyHandler = null; 

function setKeyHandler(handler) {
    if (currentKeyHandler) document.removeEventListener('keydown', currentKeyHandler);
    currentKeyHandler = handler;
    document.addEventListener('keydown', currentKeyHandler);
}

// ================= 主控台、存檔、改名與打工計時模組 =================
let hungerTimer = null; 
let gameIntervals = [], score = 0, lives = 3, isGameRunning = false;
let petName = "小寶貝"; // 預設寵物名字

function startHungerTimer() {
    if (hungerTimer) clearInterval(hungerTimer);
    hungerTimer = setInterval(() => {
        if (isAlive && food > 0 && happy > 0) {
            food -= 1; happy -= 1; updateUI(); saveGame();
        }
    }, 20000); 
}

function loadGame() {
    if(localStorage.getItem('monsterFood')) {
        food = parseInt(localStorage.getItem('monsterFood'));
        happy = parseInt(localStorage.getItem('monsterHappy'));
        coins = parseInt(localStorage.getItem('monsterCoins')) || 0;
        petLevel = parseInt(localStorage.getItem('monsterLevel')) || 1;
        exp = parseInt(localStorage.getItem('monsterExp')) || 0;
        
        // 讀取寵物名字
        if(localStorage.getItem('monsterName')) {
            petName = localStorage.getItem('monsterName');
        }
        
        let savedBag = localStorage.getItem('monsterBag');
        if (savedBag) {
            bag = JSON.parse(savedBag);
        }
        
        let lastSaveTime = parseInt(localStorage.getItem('monsterLastTime')) || Date.now();
        let now = Date.now();
        let elapsedSeconds = Math.floor((now - lastSaveTime) / 1000); 
        
        if (elapsedSeconds > 20 && isAlive) {
            let loss = Math.floor(elapsedSeconds / 20);
            food = Math.max(0, food - loss);
            happy = Math.max(0, happy - loss);
            
            if (food === 0 || happy === 0) {
                say(`哎呀！你離開太久了，${petName} 餓到快昏倒了！快去背包吃東西救援！🆘`);
            } else {
                say(`你不在的這段時間，${petName} 好想你，掉了 ${loss} 點數值！🥺`);
            }
        } else {
            say(`歡迎回來！和 ${petName} 一起玩吧！`);
        }
    } else {
        food = 50; happy = 50; 
        let inputName = prompt("恭喜獲得新寵物！請幫牠取個名字：", "奇幻島小怪獸");
        if (inputName && inputName.trim() !== "") {
            petName = inputName.trim();
        }
        saveGame();
    }
    document.getElementById('pName').innerText = petName;
    updateUI();
}

function saveGame() {
    if(isAlive) {
        localStorage.setItem('monsterFood', food);
        localStorage.setItem('monsterHappy', happy);
        localStorage.setItem('monsterCoins', coins);
        localStorage.setItem('monsterLevel', petLevel);
        localStorage.setItem('monsterExp', exp);
        localStorage.setItem('monsterName', petName);
        localStorage.setItem('monsterBag', JSON.stringify(bag));
        localStorage.setItem('monsterLastTime', Date.now());
    }
}

function hardReset() {
    if(confirm("確定要刪除進度重新養一隻新寵物嗎？")) {
        localStorage.clear();
        let inputName = prompt("新寵物誕生了！請幫牠取個新名字：", "奇幻島小怪獸");
        petName = (inputName && inputName.trim() !== "") ? inputName.trim() : "小寶貝";
        
        food = 50; happy = 50; coins = 0; petLevel = 1; exp = 0; isAlive = true;
        bag = { soda: 0, cookie: 1, riceball: 0, burger: 0, bento: 0, cake: 0 };
        document.getElementById('btnFeed').disabled = false; document.getElementById('btnPlay').disabled = false;
        document.getElementById('title').innerText = "🐾 奇幻島專屬電子寵物 🐾";
        document.getElementById('pName').innerText = petName;
        petImg.classList.remove('run-away'); say(`新寵物 ${petName} 誕生了！`); updateUI(); saveGame();
    }
}

// 隨時更名函數 (掛載到 window 供全域 HTML 呼叫)
window.changePetName = function() {
    let newName = prompt(`請輸入新的寵物名字：`, petName);
    if (newName && newName.trim() !== "") {
        petName = newName.trim();
        document.getElementById('pName').innerText = petName;
        say(`太棒了！以後我就叫做【${petName}】囉！🎉`);
        playAnimation('jump');
        saveGame();
    }
};

// 遊戲室選單
function openMenu() {
    if(!isAlive) return;

    if (hungerTimer) clearInterval(hungerTimer);

    document.getElementById('menuOverlay').style.display = 'flex'; 
    document.getElementById('menuGrid').style.display = 'grid';
    document.getElementById('gameStage').style.display = 'none'; 
    document.getElementById('gameScoreBoard').style.display = 'none';
    document.getElementById('btnEndGame').style.display = 'none'; 
    document.getElementById('gameMsg').style.display = 'none';
    document.getElementById('modalTitle').innerText = "選擇要打工的遊戲！(10分=1金幣)";
}

// 點擊具體遊戲才扣 10 點飽食度
function payAndStartGame(gameInitFunction) {
    if(!isAlive) return;
    
    food = Math.max(0, food - 10);
    updateUI();
    saveGame();

    if (food === 0) {
        say(`哎呀！打工讓 ${petName} 肚子好餓，快撐不住啦！趕快賺錢買便當救牠！🆘`);
    } else {
        say(`開始打工賺錢囉！${petName} 消耗了 10 點體力！💪`);
    }

    gameInitFunction();
}

function closeModal() {
    isGameRunning = false;
    clearGameIntervals();
    if (currentKeyHandler) document.removeEventListener('keydown', currentKeyHandler);
    currentKeyHandler = null;
    document.getElementById('menuOverlay').style.display = 'none';
    
    if(score > 0) {
        let earnedCoins = Math.floor(score / 10); 
        coins += earnedCoins;
        happy += score * 2; if(happy > 100) happy = 100;
        gainExp(score); 

        say(`打工結束！${petName} 賺了 ${earnedCoins} 金幣！💰`);
        playAnimation('shake'); updateUI(); saveGame(); score = 0;
    }

    startHungerTimer();
}

function clearGameIntervals() {
    gameIntervals.forEach(clearInterval); gameIntervals.forEach(clearTimeout); gameIntervals = [];
}

function initGame(title, hasLevel = false, hasLives = true) {
    score = 0; lives = 3; isGameRunning = true;
    document.getElementById('gScore').innerText = score; updateLivesDisplay();
    document.getElementById('modalTitle').innerText = title; document.getElementById('menuGrid').style.display = 'none';
    document.getElementById('gameScoreBoard').style.display = 'flex';
    
    document.getElementById('gLevelDisplay').style.display = hasLevel ? 'inline-block' : 'none';
    document.getElementById('gLivesDisplay').style.display = hasLives ? 'inline-block' : 'none';
    
    let stage = document.getElementById('gameStage');
    stage.style.display = 'block'; stage.innerHTML = `<div id="gameMsg"></div>`; 
    document.getElementById('btnEndGame').style.display = 'inline-block'; document.getElementById('btnEndGame').innerText = "提早領薪水結束";
    clearGameIntervals();
    return stage;
}

function setupCanvas(stage, width=300, height=320) {
    stage.innerHTML += `<canvas id="gameCanvas" width="${width}" height="${height}"></canvas>`;
    stage.style.background = "#222"; 
    return document.getElementById('gameCanvas').getContext('2d');
}

function updateLevel(lvl) { document.getElementById('gLevel').innerText = lvl; }
function updateLivesDisplay() { document.getElementById('gLives').innerText = '❤️'.repeat(lives) + '💔'.repeat(3 - lives); }

function loseLife() {
    if(!isGameRunning) return;
    lives--; updateLivesDisplay();
    if(lives <= 0) { endGameMsg("血量耗盡，打工結束！"); }
}

function addScore(pts) {
    if(!isGameRunning) return;
    score += pts; document.getElementById('gScore').innerText = score;
}

function endGameMsg(text) {
    isGameRunning = false; clearGameIntervals();
    let msg = document.getElementById('gameMsg');
    msg.innerText = text; msg.style.display = 'block';
    document.getElementById('btnEndGame').innerText = "領取薪水並返回";
}

// 啟動主程式
loadGame();
startHungerTimer();
