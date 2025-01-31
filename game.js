// ============== 游戏配置 ==============
const levels = [
  { // 第1关
    map: [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,4,2,3,1],
      [1,1,1,1,1]
    ],
    targets: [{x:3,y:2}]
  },
  { // 第2关
    map: [
      [1,1,1,1,1,1],
      [1,3,0,0,3,1],
      [1,0,2,2,0,1],
      [1,0,4,0,0,1],
      [1,1,1,1,1,1]
    ],
    targets: [{x:1,y:1}, {x:4,y:1}]
  },
  { // 第3关
    map: [
      [1,1,1,1,1,1,1],
      [1,0,1,0,1,0,1],
      [1,0,2,3,2,0,1],
      [1,0,3,2,3,0,1],
      [1,0,4,0,0,0,1],
      [1,1,1,1,1,1,1]
    ],
    targets: [{x:3,y:2}, {x:4,y:3}, {x:3,y:3}]
  }
];

// ============== 游戏状态 ==============
let currentLevel = 0;
let map = [];
let playerPos = {x:0, y:0};
let targets = [];
let completedLevels = new Set();

// ============== 核心函数 ==============
function initGame() {
  const level = levels[currentLevel];
  map = JSON.parse(JSON.stringify(level.map));
  targets = level.targets;
  
  // 查找玩家位置
  for(let y=0; y<map.length; y++){
    for(let x=0; x<map[y].length; x++){
      if(map[y][x] === 4) {
        playerPos = {x, y};
        map[y][x] = 0; // 清除玩家标记
      }
    }
  }
  
  render();
  updateLevelSelector();
}

function render() {
  const gameDiv = document.getElementById('game');
  gameDiv.innerHTML = '';
  
  map.forEach((row, y) => {
    const rowDiv = document.createElement('div');
    row.forEach((cell, x) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell floor';
      
      if(cell === 1) cellDiv.classList.add('wall');
      if(isTarget(x, y)) cellDiv.classList.add('target');
      if(cell === 2) cellDiv.classList.add('box');
      if(x === playerPos.x && y === playerPos.y) cellDiv.classList.add('player');
      
      rowDiv.appendChild(cellDiv);
    });
    gameDiv.appendChild(rowDiv);
  });
}

// ============== 移动逻辑 ==============
function movePlayer(dx, dy) {
  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  
  // 边界检查
  if(newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) return;
  
  // 撞墙检测
  if(map[newY][newX] === 1) return;
  
  // 推箱子逻辑
  if(map[newY][newX] === 2) {
    const boxX = newX + dx;
    const boxY = newY + dy;
    
    if(
      boxY < 0 || boxY >= map.length ||
      boxX < 0 || boxX >= map[0].length ||
      map[boxY][boxX] !== 0
    ) return;
    
    map[newY][newX] = 0;
    map[boxY][boxX] = 2;
  }
  
  // 更新玩家位置
  playerPos.x = newX;
  playerPos.y = newY;
  
  render();
  checkWin();
}

// ============== 胜利检测 ==============
function checkWin() {
  const win = targets.every(t => map[t.y][t.x] === 2);
  if(win) {
    completedLevels.add(currentLevel);
    setTimeout(() => {
      if(currentLevel < levels.length-1) {
        currentLevel++;
        alert(`🎉 通关成功！进入第 ${currentLevel+1} 关`);
        initGame();
      } else {
        alert('🏆 恭喜你成为推箱子大师！');
      }
    }, 300);
  }
  return win;
}

// ============== 辅助函数 ==============
function isTarget(x, y) {
  return targets.some(t => t.x === x && t.y === y);
}

function updateLevelSelector() {
  const container = document.getElementById('levelSelector');
  container.innerHTML = '';
  
  levels.forEach((_, index) => {
    const btn = document.createElement('button');
    btn.className = `level-btn ${completedLevels.has(index) ? 'completed' : ''}`;
    btn.textContent = `第 ${index+1} 关`;
    btn.onclick = () => {
      currentLevel = index;
      document.getElementById('levelModal').style.display = 'none';
      initGame();
    };
    container.appendChild(btn);
  });
}

// ============== 事件监听 ==============
// 键盘控制（电脑端）
document.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp': movePlayer(0, -1); break;
    case 'ArrowDown': movePlayer(0, 1); break;
    case 'ArrowLeft': movePlayer(-1, 0); break;
    case 'ArrowRight': movePlayer(1, 0); break;
  }
});

// 滑动控制（手机端）
let touchStart = {x:0, y:0};
document.addEventListener('touchstart', e => {
  e.preventDefault();
  touchStart.x = e.touches[0].clientX;
  touchStart.y = e.touches[0].clientY;
});

document.addEventListener('touchend', e => {
  e.preventDefault();
  const deltaX = e.changedTouches[0].clientX - touchStart.x;
  const deltaY = e.changedTouches[0].clientY - touchStart.y;
  
  if(Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
    if(Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaX > 0 ? movePlayer(1, 0) : movePlayer(-1, 0);
    } else {
      deltaY > 0 ? movePlayer(0, 1) : movePlayer(0, -1);
    }
  }
});

// 功能按钮
document.getElementById('restartBtn').onclick = initGame;
document.getElementById('selectLevelBtn').onclick = () => {
  document.getElementById('levelModal').style.display = 'block';
};

// ============== 启动游戏 ==============
initGame();