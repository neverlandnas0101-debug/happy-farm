// ================= 商店與背包模組 =================
let bag = {
    soda: 0,
    cookie: 1, 
    riceball: 0,
    burger: 0,
    bento: 0,
    cake: 0
};

const foodData = {
    soda: { name: '🥤 活力汽水', feed: 5 },
    cookie: { name: '🍪 充飢餅乾', feed: 10 },
    riceball: { name: '🍙 營養飯糰', feed: 25 },
    burger: { name: '🍔 起司漢堡', feed: 45 },
    bento: { name: '🍱 豪華大便當', feed: 70 },
    cake: { name: '🎂 慶祝蛋糕', feed: 90 }
};

function openShop() {
    if (typeof isAlive !== 'undefined' && !isAlive) return;
    let shopOverlay = document.getElementById('shopOverlay');
    let shopCoins = document.getElementById('shopCoins');
    if (shopOverlay) shopOverlay.style.display = 'flex';
    if (shopCoins && typeof coins !== 'undefined') shopCoins.innerText = coins;
}

function closeShop() {
    let shopOverlay = document.getElementById('shopOverlay');
    if (shopOverlay) shopOverlay.style.display = 'none';
}

function buyFood(type) {
    let cost = 0;
    if (type === 'soda') cost = 5;
    if (type === 'cookie') cost = 10;
    if (type === 'riceball') cost = 20;
    if (type === 'burger') cost = 35;
    if (type === 'bento') cost = 50;
    if (type === 'cake') cost = 80;

    if (typeof coins !== 'undefined' && coins >= cost) {
        coins -= cost;
        bag[type]++; 
        if (typeof say === 'function') say(`成功購買 ${foodData[type].name} 並放入背包！🛒`);
        if (typeof playAnimation === 'function') playAnimation('jump');
        closeShop();
        if (typeof updateUI === 'function') updateUI(); 
        if (typeof saveGame === 'function') saveGame();
    } else {
        if (typeof say === 'function') say("金幣不夠喔... 快去遊戲室打工賺錢吧！💰");
        if (typeof playAnimation === 'function') playAnimation('shake');
    }
}

function openBag() {
    if (typeof isAlive !== 'undefined' && !isAlive) return;
    let bagOverlay = document.getElementById('bagOverlay');
    if (bagOverlay) bagOverlay.style.display = 'flex';
    renderBag();
}

function closeBag() {
    let bagOverlay = document.getElementById('bagOverlay');
    if (bagOverlay) bagOverlay.style.display = 'none';
}

function renderBag() {
    let container = document.getElementById('bagContainer');
    if (!container) return;
    let html = '';
    for (let key in bag) {
        let count = bag[key];
        let item = foodData[key];
        html += `<div class="bag-item" onclick="useFoodFromBag('${key}')">
                    ${item.name}<br>
                    <span>數量: ${count}</span><br>
                    <span style="color:#008000;">+${item.feed} 飽食度</span>
                   </div>`;
    }
    container.innerHTML = html;
}

function useFoodFromBag(type) {
    if (bag[type] > 0) {
        bag[type]--;
        let feedAmount = foodData[type].feed;
        if (typeof food !== 'undefined') food += feedAmount;
        if (typeof gainExp === 'function') gainExp(feedAmount / 2); 

        if (typeof food !== 'undefined') {
            if (food <= 100) { 
                if (typeof say === 'function') say(`使用了 ${foodData[type].name}！好好吃喔！🍖`); 
                if (typeof playAnimation === 'function') playAnimation('jump'); 
            } else if (food <= 150) { 
                if (typeof say === 'function') say(`使用了 ${foodData[type].name}！太撐了... 嗝！😱`); 
                if (typeof playAnimation === 'function') playAnimation('shake'); 
            } else {
                if (typeof isAlive !== 'undefined') isAlive = false; 
                if (typeof say === 'function') say("吃太飽啦！受不了啦～～ 🏃‍♂️💨");
                let titleEl = document.getElementById('title');
                if (titleEl) titleEl.innerText = "怪獸吃太飽逃跑了！";
                let btnFeed = document.getElementById('btnFeed');
                let btnPlay = document.getElementById('btnPlay');
                if (btnFeed) btnFeed.disabled = true; 
                if (btnPlay) btnPlay.disabled = true; 
                if (typeof petImg !== 'undefined' && petImg) petImg.classList.add('run-away'); 
                localStorage.clear();
            }
        }

        renderBag();
        if (typeof updateUI === 'function') updateUI();
        if (typeof saveGame === 'function') saveGame();
    } else {
        if (typeof say === 'function') say("這個道具沒有了喔！快去商店買或抽獎吧！");
        if (typeof playAnimation === 'function') playAnimation('shake');
    }
}
