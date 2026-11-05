// ================= 🃏 翻牌對對碰 =================
const fruitPool = ['🍎','🍌','🍇','🍉','🍓','🥝','🍒','🍑','🍍','🥥','🍋','🍊','🍔','🍕'];
const pairsPerLevel = [2, 3, 4, 5, 6, 8, 10]; 
let memoryCurrentLevel = 0, pairsFound = 0, flippedCards = [];

function startMemoryGame() {
    initGame("🃏 翻牌對對碰 (無限生命)", true, false); 
    document.getElementById('gameStage').style.background = "#fff";
    memoryCurrentLevel = 0; loadMemoryLevel();
}

function loadMemoryLevel() {
    let stage = document.getElementById('gameStage');
    pairsFound = 0; flippedCards = []; updateLevel(memoryCurrentLevel + 1);
    
    let numPairs = pairsPerLevel[memoryCurrentLevel];
    let shuffledPool = [...fruitPool].sort(() => 0.5 - Math.random());
    let selectedFruits = shuffledPool.slice(0, numPairs);
    let emojis = [...selectedFruits, ...selectedFruits].sort(() => 0.5 - Math.random()); 

    let cols = 4, totalCards = numPairs * 2;
    if (totalCards % 5 === 0) cols = 5; else if (totalCards % 4 === 0) cols = 4; else if (totalCards % 3 === 0) cols = 3; else cols = 2;

    let gridHTML = `<div id="memoryGrid" style="grid-template-columns: repeat(${cols}, 1fr);">`;
    emojis.forEach((e) => { gridHTML += `<div class="memory-card" data-emoji="${e}" onclick="flipCard(this)">?</div>`; });
    gridHTML += `</div><div id="gameMsg"></div>`;
    stage.innerHTML = gridHTML;
}

function flipCard(card) {
    if(!isGameRunning || card.classList.contains('flipped') || flippedCards.length >= 2) return;
    card.classList.add('flipped'); card.innerText = card.getAttribute('data-emoji');
    flippedCards.push(card);

    if(flippedCards.length === 2) {
        let t = setTimeout(() => {
            if(flippedCards[0].getAttribute('data-emoji') === flippedCards[1].getAttribute('data-emoji')) {
                addScore(3); pairsFound++;
                if(pairsFound === pairsPerLevel[memoryCurrentLevel]) {
                    memoryCurrentLevel++;
                    if(memoryCurrentLevel < pairsPerLevel.length) { loadMemoryLevel(); } else { endGameMsg("太強啦！全破關！"); }
                }
            } else {
                flippedCards[0].classList.remove('flipped'); flippedCards[0].innerText = '?';
                flippedCards[1].classList.remove('flipped'); flippedCards[1].innerText = '?';
            }
            flippedCards = [];
        }, 700);
        gameIntervals.push(t);
    }
}