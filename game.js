// 关卡数据（0:空, 1:墙, 2:箱子, 3:目标, 4:玩家）
const levels = [
    [
        [1,1,1,1,1],
        [1,4,0,0,1],
        [1,0,2,3,1],
        [1,1,1,1,1]
    ]
];
let currentLevel = 0;
let map = [];
let playerPos = {x:0, y:0};

function initGame() {
    map = JSON.parse(JSON.stringify(levels[currentLevel]));
    // 找到玩家初始位置
    for(let y=0; y<map.length; y++){
        for(let x=0; x<map[y].length; x++){
            if(map[y][x] === 4){
                playerPos = {x, y};
            }
        }
    }
    render();
}

function render() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';
    for(let y=0; y<map.length; y++){
        const row = document.createElement('div');
        row.className = 'row';
        for(let x=0; x<map[y].length; x++){
            const cell = document.createElement('div');
            cell.className = 'cell';
            if(map[y][x] === 1) cell.classList.add('wall');
            else if(map[y][x] === 2) cell.classList.add('box');
            else if(map[y][x] === 3) cell.classList.add('target');
            else if(map[y][x] === 4) cell.classList.add('player');
            row.appendChild(cell);
        }
        gameDiv.appendChild(row);
    }
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    let dx=0, dy=0;
    if(key === 'ArrowUp') dy = -1;
    else if(key === 'ArrowDown') dy = 1;
    else if(key === 'ArrowLeft') dx = -1;
    else if(key === 'ArrowRight') dx = 1;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if(map[newY][newX] === 1) return; // 撞墙
    
    if(map[newY][newX] === 2) { // 推箱子
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;
        if(map[boxNewY][boxNewX] !== 0 && map[boxNewY][boxNewX] !== 3) return;
        map[newY][newX] = 0;
        map[boxNewY][boxNewX] = 2;
    }

    map[playerPos.y][playerPos.x] = 0;
    playerPos.x = newX;
    playerPos.y = newY;
    map[newY][newX] = 4;
    
    render();
    checkWin();
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) movePlayer('right');
        else movePlayer('left');
    } else {
        if (deltaY > 0) movePlayer('down');
        else movePlayer('up');
    }
});

function checkWin() {
    let win = true;
    for(let y=0; y<map.length; y++){
        for(let x=0; x<map[y].length; x++){
            if(map[y][x] === 3 && map[y][x] !== 2) win = false;
        }
    }
    if(win) alert('你赢了！');
}

initGame();