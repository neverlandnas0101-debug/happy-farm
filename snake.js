// ================= 🐍 貪吃蛇 =================
function startSnake() {
    let stage = initGame("🐍 貪吃蛇 (方向鍵控制)", true, false);
    let ctx = setupCanvas(stage, 300, 300);
    stage.style.paddingTop = "10px"; 
    
    let gridSize = 15, level = 1, speed = 200, applesEaten = 0;
    updateLevel(level);
    
    let snake = [{x: 90, y: 90}];
    let dx = gridSize, dy = 0;
    let food = {x: 150, y: 150};

    setKeyHandler(e => {
        if(!isGameRunning) return;
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); 
        if(e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -gridSize; }
        if(e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = gridSize; }
        if(e.key === 'ArrowLeft' && dx === 0) { dx = -gridSize; dy = 0; }
        if(e.key === 'ArrowRight' && dx === 0) { dx = gridSize; dy = 0; }
    });

    function draw() {
        if(!isGameRunning) return;
        let head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (head.x < 0) head.x = 300 - gridSize;
        else if (head.x >= 300) head.x = 0;
        if (head.y < 0) head.y = 300 - gridSize;
        else if (head.y >= 300) head.y = 0;

        if(snake.some(s => s.x === head.x && s.y === head.y)) {
            endGameMsg("咬到自己了！遊戲結束！");
            return;
        }
        snake.unshift(head); 
        
        if(head.x === food.x && head.y === food.y) {
            addScore(2); applesEaten++;
            if(applesEaten >= 5) {
                level++; updateLevel(level); applesEaten = 0;
                speed = Math.max(60, speed - 20); 
                clearGameIntervals();
                gameIntervals.push(setInterval(draw, speed));
            }
            food = {x: Math.floor(Math.random()*(300/gridSize))*gridSize, y: Math.floor(Math.random()*(300/gridSize))*gridSize};
        } else { snake.pop(); } 

        ctx.fillStyle = '#a8e6cf'; 
        ctx.fillRect(0, 0, 300, 300);
        
        ctx.strokeStyle = 'rgba(0, 150, 0, 0.2)'; 
        ctx.lineWidth = 1;
        for(let i = 0; i < 300; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 300); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(300, i); ctx.stroke();
        }

        ctx.fillStyle = 'red'; ctx.fillRect(food.x, food.y, gridSize-1, gridSize-1);
        ctx.fillStyle = '#333'; snake.forEach(s => ctx.fillRect(s.x, s.y, gridSize-1, gridSize-1));
    }
    gameIntervals.push(setInterval(draw, speed));
}