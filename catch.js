// ================= 🍎 天降接物 =================
function startCatchGame() {
    let stage = initGame("🍎 天降接物 (漏接扣血)", false, true);
    stage.style.background = "#87CEEB";
    stage.innerHTML += `<div id="catcher">🧺</div><div id="fallingFood">🍎</div>`;
    let catcher = document.getElementById('catcher'), falling = document.getElementById('fallingFood');
    let fallY = -50, fallX = 200, catcherX = 200;

    stage.onmousemove = (e) => {
        if(!isGameRunning) return;
        let rect = stage.getBoundingClientRect();
        catcherX = e.clientX - rect.left;
        if(catcherX < 30) catcherX = 30;
        if(catcherX > rect.width - 30) catcherX = rect.width - 30;
        catcher.style.left = catcherX + 'px';
    };

    let loop = setInterval(() => {
        if(!isGameRunning) return;
        fallY += 7; falling.style.top = fallY + 'px'; falling.style.left = fallX + 'px';

        if(fallY > 260 && Math.abs(fallX - (catcherX - 30)) < 60) {
            addScore(2); fallY = -50; fallX = Math.random() * (stage.offsetWidth - 40);
        } else if (fallY > 350) {
            loseLife(); fallY = -50; fallX = Math.random() * (stage.offsetWidth - 40);
        }
    }, 30);
    gameIntervals.push(loop);
}