// ================= 🧱 經典打磚塊 =================
function startBreakout() {
    let stage = initGame("🧱 經典打磚塊 (掉落技能！)", true, true);
    let ctx = setupCanvas(stage, 300, 320);
    
    let level = 1; updateLevel(level);
    let paddle = {x: 120, y: 300, w: 60, h: 10};
    let ball = {x: 150, y: 280, r: 5, dx: 3, dy: -3};
    let bricks = [];
    let powerUps = []; 
    
    function initBricks() {
        bricks = []; powerUps = [];
        paddle.w = 60; 
        let rows = level + 2; 
        for(let r=0; r<rows; r++) {
            for(let c=0; c<6; c++) bricks.push({x: c*(45+5) + 5, y: r*(15+5) + 30, w: 45, h: 15, status: 1});
        }
        ball.x = 150; ball.y = 280; ball.dx = 3 + level*0.5; ball.dy = -(3 + level*0.5);
    }
    initBricks();

    stage.onmousemove = e => {
        if(!isGameRunning) return;
        let rect = document.getElementById('gameCanvas').getBoundingClientRect();
        paddle.x = e.clientX - rect.left - paddle.w/2;
        if(paddle.x < 0) paddle.x = 0;
        if(paddle.x + paddle.w > 300) paddle.x = 300 - paddle.w;
    };

    function draw() {
        if(!isGameRunning) return;
        ctx.fillStyle = '#222'; ctx.fillRect(0,0,300,320);
        
        ctx.fillStyle = '#09f'; ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.closePath();
        
        let activeBricks = 0;
        ctx.fillStyle = '#f90';
        bricks.forEach(b => {
            if(b.status === 1) {
                activeBricks++;
                ctx.fillRect(b.x, b.y, b.w, b.h);
                if(ball.x > b.x && ball.x < b.x+b.w && ball.y-ball.r < b.y+b.h && ball.y+ball.r > b.y) {
                    b.status = 0; ball.dy = -ball.dy; addScore(1);
                    
                    if(Math.random() < 0.2) {
                        powerUps.push({
                            x: b.x + b.w/2, y: b.y, 
                            type: Math.random() > 0.5 ? 'expand' : 'slow' 
                        });
                    }
                }
            }
        });

        for(let i = powerUps.length - 1; i >= 0; i--) {
            let p = powerUps[i];
            p.y += 2; 
            
            ctx.fillStyle = p.type === 'expand' ? '#32CD32' : '#00BFFF'; 
            ctx.fillRect(p.x - 6, p.y - 6, 12, 12);
            
            if(p.y + 6 > paddle.y && p.y - 6 < paddle.y + paddle.h && p.x > paddle.x && p.x < paddle.x + paddle.w) {
                if(p.type === 'expand') paddle.w = Math.min(120, paddle.w + 25);
                if(p.type === 'slow') {
                    ball.dx *= 0.75; 
                    ball.dy *= 0.75;
                }
                powerUps.splice(i, 1);
                addScore(2);
            } else if (p.y > 320) {
                powerUps.splice(i, 1); 
            }
        }

        if(activeBricks === 0) { level++; updateLevel(level); initBricks(); } 

        if(ball.x + ball.dx > 300-ball.r || ball.x + ball.dx < ball.r) ball.dx = -ball.dx;
        if(ball.y + ball.dy < ball.r) ball.dy = -ball.dy;
        
        if(ball.y + ball.dy > paddle.y - ball.r && ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            let hitPoint = ball.x - (paddle.x + paddle.w/2);
            ball.dx = hitPoint * 0.15;
            ball.dy = -ball.dy;
        }
        
        if(ball.y + ball.dy > 320) {
            loseLife();
            if(lives > 0) { ball.x = 150; ball.y = 280; ball.dx = 3 + level*0.5; ball.dy = -Math.abs(ball.dy); }
        } else {
            ball.x += ball.dx; ball.y += ball.dy;
        }

        if(isGameRunning) requestAnimationFrame(draw);
    }
    draw();
}