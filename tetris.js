// ================= 🧩 俄羅斯方塊 =================
function startTetris() {
    let stage = initGame("🧩 俄羅斯方塊 (疊滿即結束)", true, false);
    let ctx = setupCanvas(stage, 300, 300);
    stage.style.paddingTop = "10px";
    
    let level = 1, linesCleared = 0; updateLevel(level);
    const ROWS = 20, COLS = 10, BS = 15, offsetX = 75; 
    let board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    
    const shapes = [
        [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[1,0,0],[1,1,1]],
        [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]]
    ];
    const colors = ['#00FFFF', '#FFFF00', '#800080', '#FFA500', '#0000FF', '#00FF00', '#FF0000'];
    
    let piece = genPiece(), nextPiece = genPiece();
    let dropCounter = 0, dropInterval = 800;

    function genPiece() {
        let id = Math.floor(Math.random() * shapes.length);
        return { m: shapes[id], x: 3, y: 0, c: id + 1 };
    }

    function collide(p) {
        for(let r=0; r<p.m.length; r++) {
            for(let c=0; c<p.m[r].length; c++) {
                if(p.m[r][c] !== 0) {
                    let ny = p.y + r, nx = p.x + c;
                    if(ny >= ROWS || nx < 0 || nx >= COLS || (ny >= 0 && board[ny][nx] !== 0)) return true;
                }
            }
        }
        return false;
    }

    function rotate(m) {
        let N = m.length, M = m[0].length, res = Array.from({length: M}, () => Array(N).fill(0));
        for(let r=0; r<N; r++) for(let c=0; c<M; c++) res[c][N-1-r] = m[r][c];
        return res;
    }

    setKeyHandler(e => {
        if(!isGameRunning) return;
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
        if(e.key === 'ArrowLeft') { piece.x--; if(collide(piece)) piece.x++; }
        if(e.key === 'ArrowRight') { piece.x++; if(collide(piece)) piece.x--; }
        if(e.key === 'ArrowDown') { piece.y++; if(collide(piece)) piece.y--; }
        if(e.key === 'ArrowUp') { let old = piece.m; piece.m = rotate(piece.m); if(collide(piece)) piece.m = old; }
    });

    let lastTime = 0;
    function draw(time = 0) {
        if(!isGameRunning) return;
        dropCounter += (time - lastTime); lastTime = time;

        if(dropCounter > dropInterval) {
            piece.y++;
            if(collide(piece)) {
                piece.y--;
                piece.m.forEach((row, r) => row.forEach((val, c) => { if(val) board[piece.y + r][piece.x + c] = piece.c; }));
                
                let lines = 0;
                for(let r=ROWS-1; r>=0; r--) {
                    if(board[r].every(val => val !== 0)) {
                        board.splice(r, 1); board.unshift(Array(COLS).fill(0));
                        lines++; r++; 
                    }
                }
                if(lines > 0) {
                    addScore(lines * 10); linesCleared += lines;
                    if(linesCleared >= 3) {
                        level++; updateLevel(level); linesCleared = 0;
                        dropInterval = Math.max(150, dropInterval - 100);
                    }
                }
                
                piece = nextPiece;
                nextPiece = genPiece();

                if(collide(piece)) { 
                    endGameMsg("方塊疊到頂了！遊戲結束！");
                    return; 
                }
            }
            dropCounter = 0;
        }

        ctx.fillStyle = '#111'; ctx.fillRect(0,0,300,300);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for(let r=0; r<ROWS; r++) {
            for(let c=0; c<COLS; c++) {
                ctx.strokeRect(offsetX + c*BS, r*BS, BS, BS);
            }
        }
        
        ctx.strokeStyle = '#666'; ctx.strokeRect(offsetX, 0, COLS*BS, ROWS*BS); 

        for(let r=0; r<ROWS; r++) for(let c=0; c<COLS; c++) {
            if(board[r][c]) { ctx.fillStyle = colors[board[r][c]-1]; ctx.fillRect(offsetX + c*BS, r*BS, BS-1, BS-1); }
        }
        
        piece.m.forEach((row, r) => row.forEach((val, c) => {
            if(val) { ctx.fillStyle = colors[piece.c-1]; ctx.fillRect(offsetX + (piece.x+c)*BS, (piece.y+r)*BS, BS-1, BS-1); }
        }));

        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText("NEXT", 240, 30);
        nextPiece.m.forEach((row, r) => row.forEach((val, c) => {
            if(val) {
                ctx.fillStyle = colors[nextPiece.c-1];
                ctx.fillRect(240 + c*BS, 45 + r*BS, BS-1, BS-1);
            }
        }));

        if(isGameRunning) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}