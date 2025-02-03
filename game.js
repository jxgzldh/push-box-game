const levels = [
    { // 第1关
        map: [
            [1,1,1,1,1],
            [1,0,0,0,1],
            [1,4,2,3,1],  // ✅ 正确初始布局
            [1,1,1,1,1]
        ],
        targets: [{x:3,y:2}]
    },
    { // 第2关（最终修复版）
        map: [
            [1,1,1,1,1,1],
            [1,3,0,0,3,1],
            [1,0,2,4,2,1],  // ✅ 正确玩家位置
            [1,0,0,0,0,1],
            [1,1,1,1,1,1]
        ],
        targets: [
            {x:1,y:1},  // 左目标点
            {x:4,y:1}   // 右目标点
        ]
    }
];

// ...（保持其他代码不变，仅修改关卡数据部分）...

// 新增音频初始化函数
function initAudio() {
    const play = () => {
        moveSound.play().catch(() => {});
        winSound.play().then(() => winSound.pause());
    };
    document.body.addEventListener('click', play);
    document.body.addEventListener('touchstart', play);
}
initAudio();