// ================= 游戏配置 =================
const levels = [
    [
        [1,1,1,1,1],
        [1,4,0,3,1],
        [1,0,2,0,1],
        [1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1],
        [1,3,0,0,3,1],
        [1,0,2,2,4,1],
        [1,1,1,1,1,1]
    ]
];

// ================= 游戏逻辑 =================
let currentLevel = 0;
let map = [];
let playerPos = {x:0, y:0};

function initGame() {
    // 更新关卡显示
    document.getElementById('currentLevel').textContent = currentLevel + 1;
    
    // 初始化地图
    map = JSON.parse(JSON.stringify(levels[currentLevel]));
    for(let y=0; y<map.length; y++){
        for(let x=0; x<map[y].length; x++){
            if(map[y][x] === 4) playerPos = {x, y};
        }
    }
    render();
}

function render() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    map.forEach(row => {
        const rowDiv = document.createElement('div');
        row.forEach(cell => {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            if(cell === 1) cellDiv.classList.add('wall');
            else if(cell === 2) cellDiv.classList.add('box');
            else if(cell === 3) cellDiv.classList.add('target');
            else if(cell === 4) cellDiv.classList.add('player');
            rowDiv.appendChild(cellDiv);
        });
        gameDiv.appendChild(rowDiv);
    });
}

function movePlayer(direction) {
    let dx=0, dy=0;
    switch(direction) {
        case 'up': dy = -1; break;
        case 'down': dy = 1; break;
        case 'left': dx = -1; break;
        case 'right': dx = 1; break;
    }

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // 边界检查
    if(newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) return;
    
    // 碰撞检测
    const targetCell = map[newY][newX];
    if(targetCell === 1) return; // 撞墙
    
    if(targetCell === 2) { // 推箱子
        const boxX = newX + dx;
        const boxY = newY + dy;
        if(boxY < 0 || boxY >= map.length || boxX < 0 || boxX >= map[0].length) return;
        if(map[boxY][boxX] !== 0 && map[boxY][boxX] !== 3) return;
        map[newY][newX] = 0;
        map[boxY][boxX] = 2;
    }

    // 移动玩家
    map[playerPos.y][playerPos.x] = 0;
    playerPos.x = newX;
    playerPos.y = newY;
    map[newY][newX] = 4;
    
    render();
    if(checkWin()) {
        if(currentLevel < levels.length-1) {
            setTimeout(() => {
                currentLevel++;
                initGame();
            }, 1000);
        } else {
            alert('恭喜完成所有关卡！');
        }
    }
}

function checkWin() {
    for(let y=0; y<map.length; y++){
        for(let x=0; x<map[y].length; x++){
            if(map[y][x] === 3) {
                let hasBox = false;
                for(let y2=0; y2<map.length; y2++){
                    for(let x2=0; x2<map[y2].length; x2++){
                        if(y2 === y && x2 === x && map[y2][x2] === 2) hasBox = true;
                    }
                }
                if(!hasBox) return false;
            }
        }
    }
    return true;
}

// ================= 事件绑定 =================
document.getElementById('up').addEventListener('touchstart', () => movePlayer('up'));
document.getElementById('left').addEventListener('touchstart', () => movePlayer('left'));
document.getElementById('down').addEventListener('touchstart', () => movePlayer('down'));
document.getElementById('right').addEventListener('touchstart', () => movePlayer('right'));

let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
document.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    
    if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            deltaX > 0 ? movePlayer('right') : movePlayer('left');
        } else {
            deltaY > 0 ? movePlayer('down') : movePlayer('up');
        }
    }
});

// 启动游戏
initGame();