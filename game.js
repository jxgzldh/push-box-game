// ================ 游戏数据 ================
// 关卡地图数据（0:空地, 1:墙, 2:箱子, 3:目标点, 4:玩家）
const levels = [
    // 第1关（新手关）
    [
        [1,1,1,1,1],
        [1,4,0,0,1],  // 4代表玩家初始位置
        [1,0,2,3,1],  // 2是箱子，3是目标点
        [1,1,1,1,1]
    ],
    // 第2关（中等难度）
    [
        [1,1,1,1,1,1],
        [1,0,0,0,0,1],
        [1,0,2,2,4,1], // 两个箱子
        [1,0,3,3,0,1], // 两个目标点
        [1,1,1,1,1,1]
    ],
    // 第3关（挑战关）
    [
        [1,1,1,1,1,1,1],
        [1,0,0,1,0,0,1],
        [1,0,2,3,2,0,1], // 两个箱子
        [1,0,3,2,3,0,1], // 三个目标点
        [1,4,0,1,0,0,1],
        [1,1,1,1,1,1,1]
    ]
];

// ================ 游戏变量 ================
let currentLevel = 0; // 当前关卡
let map = [];         // 当前地图数据
let playerPos = { x: 0, y: 0 }; // 玩家位置

// ================ 初始化游戏 ================
function initGame() {
    // 1. 复制当前关卡地图
    map = JSON.parse(JSON.stringify(levels[currentLevel]));
    
    // 2. 查找玩家初始位置
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 4) {
                playerPos = { x, y };
            }
        }
    }
    
    // 3. 渲染地图
    render();
}

// ================ 渲染地图 ================
function render() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = ''; // 清空旧内容
    
    // 逐行逐列生成地图
    for (let y = 0; y < map.length; y++) {
        const row = document.createElement('div'); // 创建行
        for (let x = 0; x < map[y].length; x++) {
            const cell = document.createElement('div'); // 创建格子
            cell.className = 'cell'; // 基础样式
            
            // 根据数字添加不同样式
            switch (map[y][x]) {
                case 1: cell.classList.add('wall'); break;   // 墙
                case 2: cell.classList.add('box'); break;    // 箱子
                case 3: cell.classList.add('target'); break; // 目标点
                case 4: cell.classList.add('player'); break; // 玩家
            }
            
            row.appendChild(cell); // 将格子添加到行
        }
        gameDiv.appendChild(row); // 将行添加到游戏区域
    }
}

// ================ 玩家移动逻辑 ================
function movePlayer(direction) {
    // 计算移动方向
    let dx = 0, dy = 0;
    switch (direction) {
        case 'up': dy = -1; break;    // 向上
        case 'down': dy = 1; break;   // 向下
        case 'left': dx = -1; break;  // 向左
        case 'right': dx = 1; break;  // 向右
    }
    
    // 计算新位置
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // 如果新位置是墙，不能移动
    if (map[newY][newX] === 1) return;
    
    // 如果新位置是箱子
    if (map[newY][newX] === 2) {
        // 计算箱子新位置
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;
        
        // 如果箱子前面是墙或其他箱子，不能推动
        if (map[boxNewY][boxNewX] === 1 || map[boxNewY][boxNewX] === 2) return;
        
        // 移动箱子
        map[newY][newX] = 0;        // 原箱子位置清空
        map[boxNewY][boxNewX] = 2;  // 新位置放置箱子
    }
    
    // 移动玩家
    map[playerPos.y][playerPos.x] = 0; // 原玩家位置清空
    playerPos.x = newX;                // 更新玩家坐标
    playerPos.y = newY;
    map[newY][newX] = 4;               // 新位置放置玩家
    
    render();       // 重新渲染地图
    checkWin();     // 检查是否胜利
}

// ================ 胜利检测 ================
function checkWin() {
    let allCorrect = true;
    
    // 遍历所有格子，检查目标点是否都有箱子
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 3) {     // 如果是目标点
                if (map[y][x] !== 2) { // 且没有箱子
                    allCorrect = false;
                }
            }
        }
    }
    
    if (allCorrect) {
        if (currentLevel < levels.length - 1) {
            // 进入下一关
            currentLevel++;
            alert('太棒了！进入第' + (currentLevel + 1) + '关！');
            initGame();
        } else {
            alert('恭喜你，通关所有关卡！🎉');
        }
    }
}

// ================ 关卡选择功能 ================
function createLevelButtons() {
    const buttonsDiv = document.getElementById('levelButtons');
    
    // 为每个关卡创建按钮
    for (let i = 0; i < levels.length; i++) {
        const button = document.createElement('button');
        button.className = 'level-btn';
        button.textContent = '第' + (i + 1) + '关';
        
        // 点击按钮切换关卡
        button.onclick = () => {
            currentLevel = i;
            initGame();
        };
        
        buttonsDiv.appendChild(button); // 添加按钮
    }
}

// ================ 手机触摸控制 ================
// 虚拟方向键控制
document.getElementById('up').addEventListener('touchstart', () => movePlayer('up'));
document.getElementById('left').addEventListener('touchstart', () => movePlayer('left'));
document.getElementById('down').addEventListener('touchstart', () => movePlayer('down'));
document.getElementById('right').addEventListener('touchstart', () => movePlayer('right'));

// 滑动控制（与按钮共存）
let touchStartX = 0, touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
document.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    
    if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) { // 滑动超过20像素才响应
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            deltaX > 0 ? movePlayer('right') : movePlayer('left');
        } else {
            deltaY > 0 ? movePlayer('down') : movePlayer('up');
        }
    }
});

// ================ 启动游戏 ================
createLevelButtons(); // 生成关卡按钮
initGame();           // 初始化第一关