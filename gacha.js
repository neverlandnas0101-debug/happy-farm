// ================= 抽獎轉蛋模組 (包含起司漢堡與精準機率) =================
function openGacha() {
    if(!isAlive) return;
    document.getElementById('gachaOverlay').style.display = 'flex';
    document.getElementById('gachaResult').innerText = "";
}

function closeGacha() {
    document.getElementById('gachaOverlay').style.display = 'none';
}

function playGacha() {
    if (coins < 10) {
        document.getElementById('gachaResult').innerText = "❌ 金幣不足 10 枚，快去打工賺錢！";
        playAnimation('shake');
        return;
    }

    coins -= 10; 
    updateUI();

    let rand = Math.random() * 100; // 0 ~ 100 隨機數
    let resultText = "";

    if (rand < 41) {
        resultText = "😢 銘謝惠顧，沒中獎！再接再厲！"; // 50% 沒中
    } else if (rand < 67) {
        bag.soda++;
        resultText = "🎉 恭喜抽中【🥤 活力汽水】已放入背包！"; // 15% 汽水
    } else if (rand < 82) {
        bag.cookie++;
        resultText = "🎉 恭喜抽中【🍪 充飢餅乾】已放入背包！"; // 15% 餅乾
    } else if (rand < 92) {
        bag.riceball++;
        resultText = "🎊 恭喜抽中【🍙 營養飯糰】已放入背包！"; // 8% 飯糰
    } else if (rand < 95) {
        bag.burger++;
        resultText = "🍔 恭喜抽中【🍔 起司漢堡】已放入背包！"; // 5% 起司漢堡 (新加入！)
    } else if (rand < 97) {
        coins += 50; 
        resultText = "💰 太神啦！中大獎獲得【50 金幣】！"; // 3% 50金幣
    } else if (rand < 99) {
        bag.bento++;
        resultText = "🌟 稀有獎品！抽中【🍱 豪華大便當】！"; // 3% 大便當
    } else {
        bag.cake++;
        resultText = "👑 傳說大獎！！抽中【🎂 慶祝蛋糕】！！"; // 1% 慶祝蛋糕
    }

    document.getElementById('gachaResult').innerText = resultText;
    playAnimation('jump');
    updateUI();
    saveGame();
}
