// game.js
const levels = [
    { // 第1关
        map: [
            [1,1,1,1,1],
            [1,0,4,0,1],
            [1,0,2,3,1],
            [1,1,1,1,1]
        ],
        targets: [{x:3,y:2}]
    },
    { // 第2关（完美测试版）
        map: [
            [1,1,1,1,1,1],
            [1,3,0,0,3,1],
            [1,0,2,0,2,1],
            [1,0,4,0,0,1],
            [1,1,1,1,1,1]
        ],
        targets: [{x:1,y:1}, {x:4,y:1}]
    }
];

let currentLevel = 0;
let gameMap = [];
let player = {x: 0, y: 0};

function initGame() {
    const level = levels[currentLevel];
    gameMap = JSON.parse(JSON.stringify(level.map));
    
    // 初始化玩家位置
    level.map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if(cell === 4) {
                player.x = x;
                player.y = y;
                gameMap[y][x] = 0; // 清除初始位置标记
            }
        });
    });
    
    render();
}

function render() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    document.getElementById('levelNum').textContent = currentLevel + 1;

    gameMap.forEach((row, y) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
        row.forEach((cell, x) => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            
            // 墙壁
            if(cell === 1) cellDiv.classList.add('wall');
            
            // 箱子
            if(cell === 2) {
                cellDiv.classList.add('box');
                if(isOnTarget(x, y)) cellDiv.classList.add('on-target');
            }
            
            // 目标点
            if(levels[currentLevel].targets.some(t => t.x === x && t.y === y)) {
                cellDiv.classList.add('target');
            }
            
            // 玩家
            if(x === player.x && y === player.y) {
                cellDiv.classList.add('player');
            }
            
            rowDiv.appendChild(cellDiv);
        });
        board.appendChild(rowDiv);
    });
}

function move(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    // 边界检查
    if(newY < 0 || newY >= gameMap.length) return;
    if(newX < 0 || newX >= gameMap[0].length) return;
    
    const targetCell = gameMap[newY][newX];
    
    // 撞墙检测
    if(targetCell === 1) return;
    
    // 推箱子逻辑
    if(targetCell === 2) {
        const boxX = newX + dx;
        const boxY = newY + dy;
        
        // 箱子边界检测
        if(boxY < 0 || boxY >= gameMap.length) return;
        if(boxX < 0 || boxX >= gameMap[0].length) return;
        if(gameMap[boxY][boxX] !== 0) return;
        
        // 移动箱子
        gameMap[newY][newX] = 0;
        gameMap[boxY][boxX] = 2;
        playSound('move');
    }
    
    // 移动玩家
    player.x = newX;
    player.y = newY;
    
    render();
    checkWin();
}

function isOnTarget(x, y) {
    return levels[currentLevel].targets.some(t => t.x === x && t.y === y);
}

function checkWin() {
    const win = levels[currentLevel].targets.every(t => gameMap[t.y][t.x] === 2);
    if(win) {
        playSound('win');
        setTimeout(() => {
            if(currentLevel < levels.length-1) {
                currentLevel++;
                initGame();
            } else {
                alert('🎉 恭喜通关！');
            }
        }, 500);
    }
}

function playSound(type) {
    const audio = document.getElementById(type + 'Sound');
    audio.currentTime = 0;
    audio.play().catch(() => {}); // 处理自动播放限制
}

// 游戏控制
function restart() { initGame(); }

function showLevels() {
    const grid = document.getElementById('levelGrid');
    grid.innerHTML = levels.map((_,i) => `
        <button class="btn" onclick="currentLevel=${i};hideLevels();initGame()">
            ${i+1}${i <= currentLevel ? '🔓' : '🔒'}
        </button>
    `).join('');
    document.getElementById('levelModal').style.display = 'flex';
}

function hideLevels() { 
    document.getElementById('levelModal').style.display = 'none';
}

// 事件监听
document.addEventListener('keydown', e => {
    if(e.key.startsWith('Arrow')) {
        const dir = {
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0]
        }[e.key];
        move(...dir);
    }
});

let touchStart = {x:0, y:0};
document.addEventListener('touchstart', e => {
    touchStart.x = e.touches[0].clientX;
    touchStart.y = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStart.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.y;
    
    if(Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
        const dir = Math.abs(deltaX) > Math.abs(deltaY) 
            ? [deltaX > 0 ? 1 : -1, 0]
            : [0, deltaY > 0 ? 1 : -1];
        move(...dir);
    }
});

// 初始化游戏
initGame();

// 处理音频自动播放限制
document.body.addEventListener('click', () => {
    document.getElementById('moveSound').play().catch(() => {});
    document.body.removeEventListener('click', this);
});