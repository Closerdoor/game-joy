# Game-Joy 游戏网站设计文档

## 概述

Game-Joy 是一个纯前端静态游戏网站，部署于 GitHub Pages，包含多款点开即玩的 H5 小游戏。

**核心特性：**
- 现代扁平式 UI 设计
- 侧边栏分类导航
- 游戏卡片展示（缩略图、名称、标签、热度）
- 本地存储高分记录
- 音效系统（默认关闭）
- 仅支持 PC 端

---

## 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式、动画 |
| JavaScript (ES6+) | 游戏逻辑、交互 |
| Canvas 2D | 游戏渲染 |
| localStorage | 数据持久化 |

**无框架依赖**，纯原生实现。

---

## 竞品参考

以下游戏网站可供参考，寻找灵感：

| 网站 | 地址 | 特点 |
|------|------|------|
| **CrazyGames** | https://www.crazygames.com | 大型商业平台，4500+ 游戏，卡片式展示 |
| **Poki 宝玩** | https://poki.com | 中文友好，1000+ 游戏，简洁现代 UI |
| **Miniclip** | https://www.miniclip.com | 老牌游戏站，月活 4 亿+ |
| **MonkeyGG2** | https://github.com/MonkeyGG2/monkeygg2.github.io | GitHub 开源项目，150+ 游戏，独立游戏目录结构 |

**GitHub 开源项目参考：**
- [leereilly/games](https://github.com/leereilly/games) - GitHub 上的游戏资源汇总（24.7k 星）
- [attogram/games](https://github.com/attogram/games) - 自动化游戏网站构建器
- [qwertyforce/gomoku_ai](https://github.com/qwertyforce/gomoku_ai) - JavaScript 五子棋 AI（Minimax、MCTS）

---

## 项目结构

采用 **独立游戏目录** 结构，每个游戏自包含，互不耦合：

```
Game-joy/
├── index.html              # 首页
├── css/
│   ├── common.css          # 公共样式（变量、重置、布局）
│   └── home.css            # 首页样式
├── js/
│   ├── common.js           # 公共模块（存储、音效、热度）
│   └── home.js             # 首页逻辑（渲染卡片、分类筛选）
├── assets/
│   ├── images/             # 网站图标、公共图片
│   └── sounds/             # 公共音效文件
├── data/
│   └── games.json          # 游戏元数据配置
│
├── games/                  # 游戏目录（每个游戏独立）
│   ├── minesweeper/        # 扫雷
│   │   ├── index.html      # 游戏页面
│   │   ├── game.js         # 游戏逻辑
│   │   ├── style.css       # 游戏样式
│   │   └── thumbnail.png   # 缩略图
│   │
│   ├── gomoku/             # 五子棋
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── ai.js           # AI 算法（独立文件）
│   │   ├── style.css
│   │   └── thumbnail.png
│   │
│   ├── 2048/               # 2048
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── style.css
│   │   └── thumbnail.png
│   │
│   ├── snake/              # 贪吃蛇
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── style.css
│   │   └── thumbnail.png
│   │
│   ├── tetris/             # 俄罗斯方块
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── style.css
│   │   └── thumbnail.png
│   │
│   └── pinball/            # 三维弹球
│   │   ├── index.html
│   │   ├── game.js
│   │   ├── style.css
│   │   └ thumbnail.png
│
└── docs/
    └── superpowers/
        └── specs/          # 设计文档
```

**设计原则：**
- 每个游戏目录完全独立，包含自己的 HTML、JS、CSS、缩略图
- 游戏之间互不依赖，可单独开发、测试、删除
- 公共模块（存储、音效）通过相对路径引用 `../../js/common.js`
- 添加新游戏只需创建新目录，更新 `games.json`

---

## 页面设计

### 首页布局

```
┌────────┬──────────────────────────────────────────┐
│        │  Logo              Game-Joy     🔊 音效   │
│  导航  ├──────────────────────────────────────────┤
│        │                                          │
│  全部  │  热门推荐                                 │
│  益智  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  街机  │  │ 游戏 │ │ 游戏 │ │ 游戏 │ │ 游戏 │     │
│  反应  │  └──────┘ └──────┘ └──────┘ └──────┘     │
│        │                                          │
│  ────  │  全部游戏                                 │
│  设置  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│  关于  │  │缩略图│ │      │ │      │ │      │     │
│        │  │名称  │ │      │ │      │ │      │     │
│        │  │标签  │ │      │ │      │ │      │     │
│        │  │🔥热度│ │      │ │      │ │      │     │
│        │  └──────┘ └──────┘ └──────┘ └──────┘     │
└────────┴──────────────────────────────────────────┘
   200px              主内容区自适应
```

**侧边栏：**
- 宽度：200px，固定定位
- 分类导航：全部、益智、街机、反应
- 分隔线
- 设置（音效开关、重置数据）
- 关于链接

**游戏卡片：**
- 尺寸：200px × 180px
- 内容：缩略图（200×120）、名称、标签、热度
- 悬停效果：上浮 4px + 阴影加深

---

### 游戏页布局

```
┌─────────────────────────────────────────────────────┐
│  ☰ 菜单    ← 返回首页          扫雷      最高分: 999 │
├─────────────────────────────────────────────────────┤
│                                                     │
│           ┌──────────────────────────────┐          │
│           │                              │          │
│           │       游戏区域               │          │
│           │       (Canvas/DOM)           │          │
│           │                              │          │
│           └──────────────────────────────┘          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  游戏说明                                            │
│  ────────────────────────────────────────────────   │
│  经典扫雷游戏，左键揭开格子，右键标记地雷...          │
│                                                     │
│  排行榜（本地）                                      │
│  ────────────────────────────────────────────────   │
│  1. 999分 - 2024-01-01                              │
│  2. 888分 - 2024-01-02                              │
└─────────────────────────────────────────────────────┘
```

**顶部栏：**
- 左侧：菜单按钮（展开侧边栏）、返回首页
- 中间：游戏名称
- 右侧：最高分显示

**游戏区域：**
- 最大宽度：800px
- 居中显示
- Canvas 或 DOM 渲染

**底部信息：**
- 游戏说明
- 本地排行榜（前 5 名）

**侧边栏（点击菜单展开）：**
- 覆盖式弹出，带遮罩层
- 点击遮罩或菜单项后收起

---

## 核心模块

### 1. 存储模块 (Storage)

```javascript
const Storage = {
  // 高分
  getHighScore(gameId) { ... },
  setHighScore(gameId, score) { ... },
  
  // 游戏记录
  getHistory(gameId) { ... },      // 返回 [{score, date}]
  addRecord(gameId, score) { ... },
  
  // 设置
  getSettings() { ... },           // 返回 {soundEnabled: false}
  setSettings(settings) { ... },
  
  // 热度统计
  getPlayCount(gameId) { ... },
  incrementPlayCount(gameId) { ... }
};
```

**localStorage 键名设计：**
- `gamejoy_settings` - 全局设置
- `gamejoy_highscore_{gameId}` - 各游戏最高分
- `gamejoy_history_{gameId}` - 各游戏历史记录
- `gamejoy_playcount_{gameId}` - 各游戏游玩次数

---

### 2. 音效模块 (Sound)

```javascript
const Sound = {
  init() { ... },           // 初始化，加载音频
  play(name) { ... },       // 播放音效：click, win, lose, move
  toggle() { ... },         // 切换开关
  isEnabled() { ... }       // 返回是否启用
};
```

**音效文件：**
- `click.mp3` - 点击音效
- `win.mp3` - 胜利音效
- `lose.mp3` - 失败音效
- `move.mp3` - 移动/落子音效

**默认状态：关闭**，用户需主动开启。

---

### 3. 游戏配置 (games.json)

```json
{
  "games": [
    {
      "id": "minesweeper",
      "name": "扫雷",
      "path": "games/minesweeper/index.html",
      "thumbnail": "games/minesweeper/thumbnail.png",
      "tags": ["益智", "经典"],
      "category": "puzzle",
      "description": "经典扫雷游戏，考验你的逻辑推理能力。",
      "instructions": "左键揭开格子，右键标记地雷，找出所有非地雷格子即可获胜。"
    },
    {
      "id": "gomoku",
      "name": "五子棋",
      "path": "games/gomoku/index.html",
      "thumbnail": "games/gomoku/thumbnail.png",
      "tags": ["益智", "AI对战"],
      "category": "puzzle",
      "description": "五子棋人机对战，挑战 AI 对手。",
      "instructions": "点击棋盘落子，先连成五子者获胜。"
    },
    {
      "id": "2048",
      "name": "2048",
      "path": "games/2048/index.html",
      "thumbnail": "games/2048/thumbnail.png",
      "tags": ["益智", "数字"],
      "category": "puzzle",
      "description": "经典数字合并游戏。",
      "instructions": "使用方向键滑动，相同数字合并，目标是达到 2048。"
    },
    {
      "id": "snake",
      "name": "贪吃蛇",
      "path": "games/snake/index.html",
      "thumbnail": "games/snake/thumbnail.png",
      "tags": ["街机", "经典"],
      "category": "arcade",
      "description": "经典贪吃蛇游戏。",
      "instructions": "使用方向键控制蛇的移动，吃掉食物增长，不要撞墙或撞到自己。"
    },
    {
      "id": "tetris",
      "name": "俄罗斯方块",
      "path": "games/tetris/index.html",
      "thumbnail": "games/tetris/thumbnail.png",
      "tags": ["街机", "经典"],
      "category": "arcade",
      "description": "经典俄罗斯方块游戏。",
      "instructions": "使用方向键移动和旋转方块，填满一行消除得分。"
    },
    {
      "id": "pinball",
      "name": "三维弹球",
      "path": "games/pinball/index.html",
      "thumbnail": "games/pinball/thumbnail.png",
      "tags": ["街机", "弹球"],
      "category": "arcade",
      "description": "经典三维弹球游戏。",
      "instructions": "使用左右键控制挡板，保持球不落地，击中目标得分。"
    }
  ],
  "categories": [
    { "id": "all", "name": "全部" },
    { "id": "puzzle", "name": "益智" },
    { "id": "arcade", "name": "街机" },
    { "id": "reaction", "name": "反应" }
  ]
}
```

---

## 游戏实现

### 扫雷 (Minesweeper)

**实现方式：** DOM + JavaScript

**核心逻辑：**
- 生成 9×9 / 16×16 / 16×30 三种难度
- 随机放置地雷
- 计算每个格子周围的地雷数
- 点击空白格子自动展开
- 右键标记地雷
- 判断胜负

**数据结构：**
```javascript
{
  rows: 9,
  cols: 9,
  mines: 10,
  board: [[{isMine, count, isRevealed, isFlagged}]],
  gameOver: false,
  isWin: false
}
```

---

### 五子棋 (Gomoku)

**实现方式：** Canvas + JavaScript + AI

**核心逻辑：**
- 15×15 棋盘
- 玩家执黑先行
- AI 执白应对
- 判断五连获胜

**AI 算法：** Minimax + α-β 剪枝（搜索深度 2 层）

**评分函数：**
```javascript
// 棋型评分
const SCORES = {
  FIVE: 100000,      // 连五
  LIVE_FOUR: 10000,  // 活四
  RUSH_FOUR: 1000,   // 冲四
  LIVE_THREE: 1000,  // 活三
  SLEEP_THREE: 100,  // 眠三
  LIVE_TWO: 100,     // 活二
  SLEEP_TWO: 10      // 眠二
};
```

**参考项目：** [qwertyforce/gomoku_ai](https://github.com/qwertyforce/gomoku_ai)

---

### 2048

**实现方式：** DOM + CSS 动画

**核心逻辑：**
- 4×4 网格
- 方向键滑动合并相同数字
- 每次移动后随机生成 2 或 4
- 达到 2048 获胜，无法移动则失败

**数据结构：**
```javascript
{
  grid: [[0, 2, 4, 0], [0, 0, 2, 0], ...],
  score: 0,
  gameOver: false,
  isWin: false
}
```

---

### 贪吃蛇 (Snake)

**实现方式：** Canvas

**核心逻辑：**
- 网格地图
- 蛇身数组存储
- 方向键控制
- 吃食物增长、加速
- 撞墙或撞自己失败

**数据结构：**
```javascript
{
  snake: [{x, y}],    // 蛇身坐标数组
  food: {x, y},       // 食物位置
  direction: 'right', // 当前方向
  score: 0,
  gameOver: false
}
```

---

### 俄罗斯方块 (Tetris)

**实现方式：** Canvas

**核心逻辑：**
- 10×20 游戏区域
- 7 种方块形状
- 方向键移动、旋转
- 消行得分
- 堆顶失败

**数据结构：**
```javascript
{
  board: [[0, 0, ...]],  // 20×10
  currentPiece: {shape, x, y, rotation},
  nextPiece: {shape},
  score: 0,
  level: 1,
  gameOver: false
}
```

---

### 三维弹球 (Pinball)

**实现方式：** Canvas 2D 模拟 3D 视角

**核心逻辑：**
- 球的物理运动（重力、反弹）
- 左右挡板控制
- 障碍物碰撞检测
- 得分目标

**简化方案：**
- 使用 2D Canvas 绘制
- 透视变换模拟 3D 效果
- 简化物理引擎

---

## UI 规范

### 颜色

| 用途 | 颜色值 |
|------|--------|
| 主色 | `#4A90E2` |
| 主色悬停 | `#357ABD` |
| 背景 | `#F5F7FA` |
| 侧边栏背景 | `#FFFFFF` |
| 卡片背景 | `#FFFFFF` |
| 文字 | `#333333` |
| 次要文字 | `#666666` |
| 边框 | `#E0E0E0` |
| 成功 | `#52C41A` |
| 失败 | `#F5222D` |

### 尺寸

| 元素 | 尺寸 |
|------|------|
| 侧边栏宽度 | 200px |
| 卡片宽度 | 200px |
| 卡片高度 | 180px |
| 缩略图 | 200×120px |
| 卡片圆角 | 8px |
| 游戏区域最大宽度 | 800px |

### 字体

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### 交互

- 卡片悬停：`transform: translateY(-4px)` + 阴影加深
- 侧边栏项悬停：`background: #F0F0F0`
- 过渡动画：`transition: all 0.2s ease`
- 按钮点击：`transform: scale(0.98)`

---

## 文件清单

### 首次实现需创建的文件

**公共文件：**
- `index.html` - 首页
- `css/common.css` - 公共样式
- `css/home.css` - 首页样式
- `js/common.js` - 公共模块（存储、音效、热度）
- `js/home.js` - 首页逻辑
- `data/games.json` - 游戏配置
- `assets/sounds/click.mp3` - 点击音效
- `assets/sounds/win.mp3` - 胜利音效
- `assets/sounds/lose.mp3` - 失败音效
- `assets/sounds/move.mp3` - 移动音效

**游戏目录（每个游戏独立）：**

| 游戏 | 文件 |
|------|------|
| 扫雷 | `games/minesweeper/index.html`, `game.js`, `style.css`, `thumbnail.png` |
| 五子棋 | `games/gomoku/index.html`, `game.js`, `ai.js`, `style.css`, `thumbnail.png` |
| 2048 | `games/2048/index.html`, `game.js`, `style.css`, `thumbnail.png` |
| 贪吃蛇 | `games/snake/index.html`, `game.js`, `style.css`, `thumbnail.png` |
| 俄罗斯方块 | `games/tetris/index.html`, `game.js`, `style.css`, `thumbnail.png` |
| 三维弹球 | `games/pinball/index.html`, `game.js`, `style.css`, `thumbnail.png` |

---

## 部署

**GitHub Pages 配置：**
1. 仓库 Settings → Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. 访问地址: `https://{username}.github.io/Game-joy/`

**无需构建步骤**，直接推送即可部署。

---

## 后续扩展

**可添加的游戏：**
- 打砖块
- 记忆翻牌
- 数独
- 马里奥风格平台游戏（需引入 Phaser 引擎）

**可添加的功能：**
- 游戏难度选择
- 成就系统
- 多语言支持
- 游戏收藏功能
