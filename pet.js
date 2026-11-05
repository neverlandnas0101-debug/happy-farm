// ================= 寵物主系統與狀態模組 =================
let food = 50, happy = 50, isAlive = true;
let coins = 0, petLevel = 1, exp = 0; 
const maxLevel = 60; 

const imgStage1 = "https://api.dicebear.com/7.x/bottts/svg?seed=baby123";  
const imgStage2 = "https://api.dicebear.com/7.x/bottts/svg?seed=normal456"; 
const imgStage3 = "https://api.dicebear.com/7.x/bottts/svg?seed=king789";   
const imgSad = "https://api.dicebear.com/7.x/bottts/svg?seed=sad";       
const imgDead = "https://api.dicebear.com/7.x/bottts/svg?seed=dead";     

const petImg = document.getElementById('petImg');
const dialogue = document.getElementById('dialogue');

function say(text) { dialogue.innerText = text; }

function playAnimation(anim) {
    petImg.classList.remove('jump', 'shake');
    void petImg.offsetWidth; 
    petImg.classList.add(anim);
}

function gainExp(amount) {
    if (petLevel >= maxLevel || !isAlive) return; 
    exp += amount;
    let expNeeded = petLevel * 100; 
    
    if (exp >= expNeeded) {
        exp -= expNeeded;
        petLevel++;
        
        if (petLevel === 21 || petLevel === 41) {
            say(`太神奇了！怪獸進化到全新外型了！✨`);
        } else {
            say(`等級提升！目前等級 ${petLevel} 級！🎉`);
        }
        playAnimation('jump');
    }
}

function updateUI() {
    document.getElementById('food').innerText = food; 
    document.getElementById('happy').innerText = happy;
    document.getElementById('coins').innerText = coins;
    document.getElementById('shopCoins').innerText = coins; 
    document.getElementById('pLevel').innerText = petLevel;
    document.getElementById('pExp').innerText = Math.floor(exp);
    document.getElementById('pMaxExp').innerText = petLevel * 100;

    if (!isAlive) return; 

    let baseSize = 120 + Math.floor((petLevel - 1) * 1.5); 
    if (food > 100) baseSize += (food - 100) * 2; 
    
    petImg.style.width = baseSize + "px"; 
    petImg.style.height = baseSize + "px";

    if (food > 100) { 
        petImg.src = imgSad; 
    } else if (food <= 0 || happy <= 0) {
        isAlive = false; petImg.src = imgDead; say("我先離開囉，掰掰 👻");
        document.getElementById('title').innerText = "遊戲結束...";
        document.getElementById('btnFeed').disabled = true; document.getElementById('btnPlay').disabled = true; 
        localStorage.clear(); 
    } else if (food < 30 || happy < 30) { 
        petImg.src = imgSad; say("肚子空空... 也不開心 😭"); 
    } else {
        if (petLevel <= 20) petImg.src = imgStage1;
        else if (petLevel <= 40) petImg.src = imgStage2;
        else petImg.src = imgStage3;
    }
}