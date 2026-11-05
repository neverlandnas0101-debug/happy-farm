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
    if(!isAlive) return;
    document.getElementById('shopOverlay').style.display = 'flex';
    document.getElementById('shopCoins').innerText = coins;
}

function closeShop() {
    document.getElementById('shopOverlay').style.display = 'none';
}

function buyFood(type) {
    let cost = 0;
    if (type === 'soda') cost = 5;
    if (type === 'cookie') cost = 10;
    if (type === 'riceball') cost = 20;
    if (type === 'burger') cost = 35;
    if (type === 'bento') cost = 50;
    if (type === 'cake') cost = 80;

    if (coins >= cost) {
        coins -= cost;
        bag[type]++; 
        say(`成功購買 ${foodData[type].name} 並放入背包！🛒`);
        playAnimation('jump');
        closeShop();
        updateUI(); 
        saveGame();
    } else {
        say("金幣不夠喔... 快去遊戲室打工賺錢吧！💰");
        playAnimation('shake');
    }
}

function openBag() {
    if(!isAlive) return;
    document.getElementById('bagOverlay').style.display = 'flex';
    renderBag();
}

function closeBag() {
    document.getElementById('bagOverlay').style.display = 'none';
}

function renderBag() {
    let container = document.getElementById('bagContainer');
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
        food += feedAmount;
        gainExp(feedAmount / 2); 

        if (food <= 100) { 
            say(`使用了 ${foodData[type].name}！好好吃喔！🍖`); 
            playAnimation('jump'); 
        } else if (food <= 150) { 
            say(`使用了 ${foodData[type].name}！太撐了... 嗝！😱`); 
            playAnimation('shake'); 
        } else {
            isAlive = false; 
            say("吃太飽啦！受不了啦～～ 🏃‍♂️💨");
            document.getElementById('title').innerText = "怪獸吃太飽逃跑了！";
            document.getElementById('btnFeed').disabled = true; 
            document.getElementById('btnPlay').disabled = true; 
            petImg.classList.add('run-away'); 
            localStorage.clear();
        }

        renderBag();
        updateUI();
        saveGame();
    } else {
        say("這個道具沒有了喔！快去商店買或抽獎吧！");
        playAnimation('shake');
    }
}