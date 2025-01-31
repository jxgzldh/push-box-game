// ================= 游戏配置 =================
const levels = [
    {
        // 第1关
        map: [
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,4,2,3,1], // 4:玩家 2:箱子 3:目标点
            [1,1,1,1,1]
        ],
        targets: [{x:3, y:2}] // 明确指定目标点坐标
    },
    {
        // 第2关
        map: [
            [1,1,1,1,1,1],
            [1,3,0,0,3,1],
            [1,0,2,2,0,1],
            [1,0,4,0,0,1],
            [1,1,1,1,1,1]
        ],
        targets: [{x:1,y:1}, {x:4,y:1}]
    }
];

// ================= 游戏变量 =================
let currentLevel = 0;    // 当前关卡
let map = [];            // 当前地图数据
let playerPos = {x:0, y:0}; // 玩家位置
let targets = [];        // 目标点坐标列表

// ================= 初始化游戏 =================
function initGame() {
    // 加载关卡配置
    const level = levels[currentLevel];
    map = JSON.parse(JSON.stringify(level.map));
    targets = level.targets;
    
    // 查找玩家初始位置
    for(let y=0; y<map.length; y++){
        for(let x=0; x<map[y].length; x++){
            if(map[y][x] === 4) {
                playerPos = {x, y};
                map[y][x] = 0; // 清除玩家标记方便后续判断
            }
        }
    }
    
    render();
}

// ================= 渲染地图 =================
function render() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    
    for(let y=0; y<map.length; y++){
        const rowDiv = document.createElement('div');
        for(let x=0; x<map[y].length; x++){
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // 先绘制地板
            cell.classList.add('floor');
            
            // 绘制墙
            if(map[y][x] === 1) cell.classList.add('wall');
            
            // 绘制目标点（始终显示）
            if(isTargetPosition(x, y)) cell.classList.add('target');
            
            // 绘制箱子
            if(map[y][x] === 2) cell.classList.add('box');
            
            // 绘制玩家
            if(x === playerPos.x && y === playerPos.y) cell.classList.add('player');
            
            rowDiv.appendChild(cell);
        }
        gameDiv.appendChild(rowDiv);
    }
}

// ================= 移动逻辑 =================
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
    
    // 撞墙检测
    if(targetCell === 1) return;
    
    // 推箱子检测
    if(targetCell === 2) {
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;
        
        // 箱子边界检测
        if(boxNewY < 0 || boxNewY >= map.length || boxNewX < 0 || boxNewX >= map[0].length) return;
        
        // 箱子碰撞检测
        if(map[boxNewY][boxNewX] !== 0) return;
        
        // 移动箱子
        map[newY][newX] = 0;
        map[boxNewY][boxNewX] = 2;
    }

    // 移动玩家
    playerPos.x = newX;
    playerPos.y = newY;
    
    render();
    checkWin();
}

// ================= 胜利检测 =================
function checkWin() {
    // 检查所有目标点是否都有箱子
    for(const target of targets) {
        if(map[target.y][target.x] !== 2) return false;
    }
    
    // 胜利处理
    setTimeout(() => {
        if(currentLevel < levels.length-1) {
            currentLevel++;
            alert(`进入第 ${currentLevel+1} 关！`);
            initGame();
        } else {
            alert('🎉 恭喜通关所有关卡！');
        }
    }, 300);
    return true;
}

// ================= 辅助函数 =================
function isTargetPosition(x, y) {
    return targets.some(t => t.x === x && t.y === y);
}

// ================= 事件绑定 =================
// 虚拟方向键控制
document.getElementById('up').addEventListener('touchstart', () => movePlayer('up'));
document.getElementById('left').addEventListener('touchstart', () => movePlayer('left'));
document.getElementById('down').addEventListener('touchstart', () => movePlayer('down'));
document.getElementById('right').addEventListener('touchstart', () => movePlayer('right'));

// 滑动控制
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