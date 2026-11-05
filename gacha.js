// ================= 抽獎轉蛋模組 =================
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

    let rand = Math.random() * 100;
    let resultText = "";

    if (rand < 50) {
        resultText = "😢 銘謝惠顧，沒中獎！再接再厲！";
    } else if (rand < 65) {
        bag.soda++;
        resultText = "🎉 恭喜抽中【🥤 活力汽水】已放入背包！";
    } else if (rand < 80) {
        bag.cookie++;
        resultText = "🎉 恭喜抽中【🍪 充飢餅乾】已放入背包！";
    } else if (rand < 90) {
        bag.riceball++;
        resultText = "🎊 恭喜抽中【🍙 營養飯糰】已放入背包！";
    } else if (rand < 93) {
        coins += 50; 
        resultText = "💰 太神啦！中大獎獲得【50 金幣】！";
    } else if (rand < 95) {
        bag.bento++;
        resultText = "🌟 稀有獎品！抽中【🍱 豪華大便當】！";
    } else {
        bag.cake++;
        resultText = "👑 傳說大獎！！抽中【🎂 慶祝蛋糕】！！";
    }

    document.getElementById('gachaResult').innerText = resultText;
    playAnimation('jump');
    updateUI();
    saveGame();
}