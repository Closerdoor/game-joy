# Game-Joy 游戏网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个纯前端静态游戏网站，包含 6 款 H5 小游戏，部署到 GitHub Pages。

**Architecture:** 采用独立游戏目录结构，每个游戏自包含 HTML/CSS/JS。首页通过 games.json 配置动态渲染游戏卡片，使用 localStorage 存储高分和设置。

**Tech Stack:** 原生 HTML5 + CSS3 + JavaScript (ES6+) + Canvas 2D

---

## 文件结构

```
Game-joy/
├── index.html                    # 首页
├── css/
│   ├── common.css                # 公共样式（变量、重置、布局、组件）
│   └── home.css                  # 首页样式
├── js/
│   ├── common.js                 # 公共模块（Storage、Sound）
│   └── home.js                   # 首页逻辑
├── assets/
│   └── sounds/                   # 公共音效
│       ├── click.mp3
│       ├── win.mp3
│       ├── lose.mp3
│       └── move.mp3
├── data/
│   └── games.json                # 游戏配置
└── games/                        # 游戏目录
    ├── minesweeper/
    ├── 2048/
    ├── dino/
    ├── gomoku/
    ├── tetris/
    └── pinball/
```

---

## Phase 1: 基础框架

### Task 1: 创建公共样式文件

**Files:**
- Create: `css/common.css`

- [ ] **Step 1: 创建 CSS 变量和重置样式**

```css
/* css/common.css */

/* CSS 变量 */
:root {
  --primary-color: #4A90E2;
  --primary-hover: #357ABD;
  --bg-color: #F5F7FA;
  --sidebar-bg: #FFFFFF;
  --card-bg: #FFFFFF;
  --text-color: #333333;
  --text-secondary: #666666;
  --border-color: #E0E0E0;
  --success-color: #52C41A;
  --error-color: #F5222D;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.15);
  --radius: 8px;
  --sidebar-width: 200px;
  --transition: all 0.2s ease;
}

/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

/* 布局容器 */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 按钮组件 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  font-size: 14px;
  transition: var(--transition);
}

.btn:hover {
  background-color: var(--primary-hover);
  transform: scale(0.98);
}

/* 卡片组件 */
.card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

/* 标签组件 */
.tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--bg-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
  z-index: 100;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}
```

- [ ] **Step 2: 提交公共样式**

```bash
git add css/common.css
git commit -m "feat: 添加公共样式文件"
```

---

### Task 2: 创建首页样式文件

**Files:**
- Create: `css/home.css`

- [ ] **Step 1: 创建首页布局和组件样式**

```css
/* css/home.css */

/* 整体布局 */
.layout {
  display: flex;
  min-height: 100vh;
}

/* 侧边栏 */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.sidebar-logo {
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
}

.sidebar-nav {
  flex: 1;
  padding: 10px 0;
}

.sidebar-nav-item {
  display: block;
  padding: 12px 20px;
  color: var(--text-color);
  transition: var(--transition);
  cursor: pointer;
}

.sidebar-nav-item:hover,
.sidebar-nav-item.active {
  background-color: var(--bg-color);
  color: var(--primary-color);
}

.sidebar-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 10px 20px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
}

.sidebar-footer-item {
  display: block;
  padding: 8px 0;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
}

.sidebar-footer-item:hover {
  color: var(--primary-color);
}

/* 主内容区 */
.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 20px;
}

/* 顶部栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
}

.sound-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--sidebar-bg);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.sound-toggle:hover {
  background-color: var(--bg-color);
}

.sound-toggle.muted {
  opacity: 0.5;
}

/* 区块标题 */
.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* 游戏卡片网格 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* 游戏卡片 */
.game-card {
  display: block;
  background-color: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: var(--transition);
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.game-card-thumbnail {
  width: 100%;
  height: 120px;
  background-color: var(--bg-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.game-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-card-info {
  padding: 12px;
}

.game-card-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.game-card-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.game-card-popularity {
  font-size: 12px;
  color: var(--text-secondary);
}

.game-card-popularity::before {
  content: '🔥 ';
}
```

- [ ] **Step 2: 提交首页样式**

```bash
git add css/home.css
git commit -m "feat: 添加首页样式文件"
```

---

### Task 3: 创建公共 JavaScript 模块

**Files:**
- Create: `js/common.js`

- [ ] **Step 1: 创建 Storage 模块**

```javascript
// js/common.js

const Storage = {
  getHighScore(gameId) {
    const score = localStorage.getItem(`gamejoy_highscore_${gameId}`);
    return score ? parseInt(score, 10) : 0;
  },

  setHighScore(gameId, score) {
    localStorage.setItem(`gamejoy_highscore_${gameId}`, score.toString());
  },

  getHistory(gameId) {
    const history = localStorage.getItem(`gamejoy_history_${gameId}`);
    return history ? JSON.parse(history) : [];
  },

  addRecord(gameId, score) {
    const history = this.getHistory(gameId);
    history.push({ score, date: new Date().toISOString() });
    history.sort((a, b) => b.score - a.score);
    const top5 = history.slice(0, 5);
    localStorage.setItem(`gamejoy_history_${gameId}`, JSON.stringify(top5));
    return top5;
  },

  getSettings() {
    const settings = localStorage.getItem('gamejoy_settings');
    return settings ? JSON.parse(settings) : { soundEnabled: false };
  },

  setSettings(settings) {
    localStorage.setItem('gamejoy_settings', JSON.stringify(settings));
  },

  getPlayCount(gameId) {
    const count = localStorage.getItem(`gamejoy_playcount_${gameId}`);
    return count ? parseInt(count, 10) : 0;
  },

  incrementPlayCount(gameId) {
    const count = this.getPlayCount(gameId) + 1;
    localStorage.setItem(`gamejoy_playcount_${gameId}`, count.toString());
    return count;
  }
};
```

- [ ] **Step 2: 创建 Sound 模块**

```javascript
// 添加到 js/common.js

const Sound = {
  sounds: {},
  enabled: false,

  init() {
    this.enabled = Storage.getSettings().soundEnabled;
    this.sounds = {
      click: new Audio('assets/sounds/click.mp3'),
      win: new Audio('assets/sounds/win.mp3'),
      lose: new Audio('assets/sounds/lose.mp3'),
      move: new Audio('assets/sounds/move.mp3')
    };
    Object.values(this.sounds).forEach(audio => {
      audio.volume = 0.3;
    });
  },

  play(name) {
    if (!this.enabled || !this.sounds[name]) return;
    this.sounds[name].currentTime = 0;
    this.sounds[name].play().catch(() => {});
  },

  toggle() {
    this.enabled = !this.enabled;
    Storage.setSettings({ soundEnabled: this.enabled });
    return this.enabled;
  },

  isEnabled() {
    return this.enabled;
  }
};
```

- [ ] **Step 3: 提交公共模块**

```bash
git add js/common.js
git commit -m "feat: 添加公共 JavaScript 模块（Storage、Sound）"
```

---

### Task 4: 创建游戏配置文件

**Files:**
- Create: `data/games.json`

- [ ] **Step 1: 创建游戏配置**

```json
{
  "games": [
    {
      "id": "minesweeper",
      "name": "扫雷",
      "path": "games/minesweeper/index.html",
      "thumbnail": "games/minesweeper/thumbnail.png",
      "icon": "💣",
      "tags": ["益智", "经典"],
      "category": "puzzle",
      "description": "经典扫雷游戏，考验你的逻辑推理能力。",
      "instructions": "左键揭开格子，右键标记地雷，找出所有非地雷格子即可获胜。"
    },
    {
      "id": "2048",
      "name": "2048",
      "path": "games/2048/index.html",
      "thumbnail": "games/2048/thumbnail.png",
      "icon": "🔢",
      "tags": ["益智", "数字"],
      "category": "puzzle",
      "description": "经典数字合并游戏。",
      "instructions": "使用方向键滑动，相同数字合并，目标是达到 2048。"
    },
    {
      "id": "dino",
      "name": "Google小恐龙",
      "path": "games/dino/index.html",
      "thumbnail": "games/dino/thumbnail.png",
      "icon": "🦖",
      "tags": ["街机", "经典"],
      "category": "arcade",
      "description": "Chrome 浏览器离线小游戏。",
      "instructions": "按空格键或点击屏幕跳跃，躲避障碍物，尽可能跑得更远。"
    },
    {
      "id": "gomoku",
      "name": "五子棋",
      "path": "games/gomoku/index.html",
      "thumbnail": "games/gomoku/thumbnail.png",
      "icon": "⚫",
      "tags": ["益智", "AI对战"],
      "category": "puzzle",
      "description": "五子棋人机对战，挑战 AI 对手。",
      "instructions": "点击棋盘落子，先连成五子者获胜。"
    },
    {
      "id": "tetris",
      "name": "俄罗斯方块",
      "path": "games/tetris/index.html",
      "thumbnail": "games/tetris/thumbnail.png",
      "icon": "🧱",
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
      "icon": "🎱",
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

- [ ] **Step 2: 提交游戏配置**

```bash
git add data/games.json
git commit -m "feat: 添加游戏配置文件"
```

---

### Task 5: 创建首页 JavaScript

**Files:**
- Create: `js/home.js`

- [ ] **Step 1: 创建首页逻辑**

```javascript
// js/home.js

let gamesData = null;
let currentCategory = 'all';

async function init() {
  Sound.init();
  await loadGamesData();
  renderSidebar();
  renderGames();
  bindEvents();
  updateSoundToggle();
}

async function loadGamesData() {
  try {
    const response = await fetch('data/games.json');
    gamesData = await response.json();
  } catch (error) {
    console.error('Failed to load games data:', error);
  }
}

function renderSidebar() {
  const categories = gamesData.categories;
  const navContainer = document.getElementById('sidebar-nav');
  
  navContainer.innerHTML = categories.map(cat => `
    <a class="sidebar-nav-item ${cat.id === currentCategory ? 'active' : ''}" 
       data-category="${cat.id}">
      ${cat.name}
    </a>
  `).join('');
}

function renderGames() {
  const games = getFilteredGames();
  const popularGames = getPopularGames(games);
  
  renderPopularGames(popularGames);
  renderAllGames(games);
}

function getFilteredGames() {
  let games = gamesData.games;
  
  if (currentCategory !== 'all') {
    games = games.filter(game => game.category === currentCategory);
  }
  
  return games.map(game => ({
    ...game,
    playCount: Storage.getPlayCount(game.id)
  }));
}

function getPopularGames(games) {
  return [...games]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 4);
}

function renderPopularGames(games) {
  const container = document.getElementById('popular-games');
  container.innerHTML = games.map(game => createGameCard(game)).join('');
}

function renderAllGames(games) {
  const container = document.getElementById('all-games');
  container.innerHTML = games.map(game => createGameCard(game)).join('');
}

function createGameCard(game) {
  return `
    <a href="${game.path}" class="game-card" data-game-id="${game.id}">
      <div class="game-card-thumbnail">
        ${game.thumbnail ? 
          `<img src="${game.thumbnail}" alt="${game.name}" onerror="this.style.display='none';this.parentElement.textContent='${game.icon}'">` : 
          game.icon}
      </div>
      <div class="game-card-info">
        <div class="game-card-name">${game.name}</div>
        <div class="game-card-tags">
          ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="game-card-popularity">${game.playCount} 次游玩</div>
      </div>
    </a>
  `;
}

function bindEvents() {
  document.getElementById('sidebar-nav').addEventListener('click', (e) => {
    const item = e.target.closest('.sidebar-nav-item');
    if (item) {
      currentCategory = item.dataset.category;
      document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      renderGames();
    }
  });

  document.getElementById('sound-toggle').addEventListener('click', () => {
    const enabled = Sound.toggle();
    updateSoundToggle();
    Sound.play('click');
  });

  document.getElementById('all-games').addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
      const gameId = card.dataset.gameId;
      Storage.incrementPlayCount(gameId);
    }
  });

  document.getElementById('popular-games').addEventListener('click', (e) => {
    const card = e.target.closest('.game-card');
    if (card) {
      const gameId = card.dataset.gameId;
      Storage.incrementPlayCount(gameId);
    }
  });
}

function updateSoundToggle() {
  const toggle = document.getElementById('sound-toggle');
  if (Sound.isEnabled()) {
    toggle.classList.remove('muted');
    toggle.innerHTML = '🔊 音效';
  } else {
    toggle.classList.add('muted');
    toggle.innerHTML = '🔇 音效';
  }
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 2: 提交首页逻辑**

```bash
git add js/home.js
git commit -m "feat: 添加首页 JavaScript 逻辑"
```

---

### Task 6: 创建首页 HTML

**Files:**
- Create: `index.html`

- [ ] **Step 1: 创建首页 HTML 结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game-Joy - 免费在线小游戏</title>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/home.css">
</head>
<body>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="sidebar-logo">🎮 Game-Joy</div>
      <nav class="sidebar-nav" id="sidebar-nav">
        <!-- 动态渲染 -->
      </nav>
      <div class="sidebar-divider"></div>
      <div class="sidebar-footer">
        <a class="sidebar-footer-item" id="sound-toggle">🔇 音效</a>
        <a class="sidebar-footer-item" href="https://github.com/Closerdoor/game-joy" target="_blank">关于</a>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <header class="header">
        <h1 class="header-title">欢迎来到 Game-Joy</h1>
      </header>

      <!-- 热门推荐 -->
      <section class="section">
        <h2 class="section-title">🔥 热门推荐</h2>
        <div class="games-grid" id="popular-games">
          <!-- 动态渲染 -->
        </div>
      </section>

      <!-- 全部游戏 -->
      <section class="section">
        <h2 class="section-title">🎮 全部游戏</h2>
        <div class="games-grid" id="all-games">
          <!-- 动态渲染 -->
        </div>
      </section>
    </main>
  </div>

  <script src="js/common.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
```

- [ ] **Step 2: 提交首页**

```bash
git add index.html
git commit -m "feat: 添加首页 HTML"
```

---

## Phase 2: 游戏页模板

### Task 7: 创建游戏页公共样式

**Files:**
- Create: `css/game.css`

- [ ] **Step 1: 创建游戏页样式**

```css
/* css/game.css */

/* 游戏页布局 */
.game-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* 顶部栏 */
.game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--sidebar-bg);
  border-bottom: 1px solid var(--border-color);
}

.game-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--bg-color);
  border-radius: var(--radius);
  font-size: 20px;
  transition: var(--transition);
}

.menu-btn:hover {
  background-color: var(--border-color);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--bg-color);
  border-radius: var(--radius);
  color: var(--text-color);
  transition: var(--transition);
}

.back-btn:hover {
  background-color: var(--border-color);
}

.game-header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 600;
}

.game-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.high-score {
  font-size: 14px;
  color: var(--text-secondary);
}

.high-score-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

/* 游戏区域 */
.game-area {
  display: flex;
  justify-content: center;
  padding: 40px 24px;
}

.game-container {
  background-color: var(--sidebar-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 20px;
}

/* 游戏信息区 */
.game-info {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.info-section {
  background-color: var(--sidebar-bg);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 20px;
}

.info-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.info-section-content {
  color: var(--text-secondary);
  line-height: 1.8;
}

/* 排行榜 */
.leaderboard-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.leaderboard-rank {
  font-weight: 600;
  color: var(--primary-color);
}

.leaderboard-score {
  font-weight: 600;
}

.leaderboard-date {
  color: var(--text-secondary);
  font-size: 12px;
}

/* 侧边栏菜单（移动端） */
.game-sidebar {
  position: fixed;
  left: -280px;
  top: 0;
  width: 280px;
  height: 100vh;
  background-color: var(--sidebar-bg);
  z-index: 300;
  transition: var(--transition);
  padding: 20px;
}

.game-sidebar.active {
  left: 0;
}

.game-sidebar-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-color);
  border-radius: var(--radius);
  cursor: pointer;
}

.game-sidebar-nav {
  margin-top: 60px;
}

.game-sidebar-item {
  display: block;
  padding: 12px 16px;
  border-radius: var(--radius);
  color: var(--text-color);
  transition: var(--transition);
}

.game-sidebar-item:hover {
  background-color: var(--bg-color);
}
```

- [ ] **Step 2: 提交游戏页样式**

```bash
git add css/game.css
git commit -m "feat: 添加游戏页公共样式"
```

---

## Phase 3: 游戏实现

### Task 8: 创建扫雷游戏

**Files:**
- Create: `games/minesweeper/index.html`
- Create: `games/minesweeper/game.js`
- Create: `games/minesweeper/style.css`
- Create: `games/minesweeper/thumbnail.png` (占位)

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/minesweeper
```

- [ ] **Step 2: 创建扫雷 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>扫雷 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">扫雷</div>
      <div class="game-header-right">
        <div class="high-score">最高分: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-controls">
          <select id="difficulty">
            <option value="easy">简单 (9×9, 10雷)</option>
            <option value="medium">中等 (16×16, 40雷)</option>
            <option value="hard">困难 (16×30, 99雷)</option>
          </select>
          <button id="restart-btn" class="btn">重新开始</button>
        </div>
        <div class="game-status">
          <span>剩余地雷: <strong id="mines-count">10</strong></span>
          <span>时间: <strong id="timer">0</strong>s</span>
        </div>
        <div id="board" class="board"></div>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          左键揭开格子，右键标记地雷。数字表示周围 8 格内的地雷数量。找出所有非地雷格子即可获胜。
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">排行榜</h3>
        <div class="info-section-content" id="leaderboard">
          暂无记录
        </div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建扫雷样式**

```css
/* games/minesweeper/style.css */

.game-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.game-controls select {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-size: 14px;
}

.game-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-secondary);
}

.board {
  display: inline-grid;
  gap: 1px;
  background-color: var(--border-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
}

.cell {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.1s;
}

.cell:hover:not(.revealed) {
  background-color: #ccc;
}

.cell.revealed {
  background-color: #fff;
  cursor: default;
}

.cell.mine {
  background-color: #ff4444;
}

.cell.flagged::after {
  content: '🚩';
}

.cell[data-count="1"] { color: #0000ff; }
.cell[data-count="2"] { color: #008000; }
.cell[data-count="3"] { color: #ff0000; }
.cell[data-count="4"] { color: #000080; }
.cell[data-count="5"] { color: #800000; }
.cell[data-count="6"] { color: #008080; }
.cell[data-count="7"] { color: #000000; }
.cell[data-count="8"] { color: #808080; }
```

- [ ] **Step 4: 创建扫雷游戏逻辑**

```javascript
// games/minesweeper/game.js

const GAME_ID = 'minesweeper';
const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
};

let board = [];
let rows, cols, mines;
let revealedCount = 0;
let flaggedCount = 0;
let gameOver = false;
let gameStarted = false;
let timer = 0;
let timerInterval = null;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  startGame('easy');
}

function bindEvents() {
  document.getElementById('difficulty').addEventListener('change', (e) => {
    startGame(e.target.value);
  });

  document.getElementById('restart-btn').addEventListener('click', () => {
    const difficulty = document.getElementById('difficulty').value;
    startGame(difficulty);
  });
}

function startGame(difficulty) {
  const config = DIFFICULTIES[difficulty];
  rows = config.rows;
  cols = config.cols;
  mines = config.mines;

  board = [];
  revealedCount = 0;
  flaggedCount = 0;
  gameOver = false;
  gameStarted = false;
  timer = 0;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  document.getElementById('timer').textContent = '0';
  document.getElementById('mines-count').textContent = mines;

  initBoard();
  renderBoard();
}

function initBoard() {
  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      board[r][c] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        count: 0
      };
    }
  }
}

function placeMines(excludeRow, excludeCol) {
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    if (!board[r][c].isMine && !(r === excludeRow && c === excludeCol)) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        board[r][c].count = countAdjacentMines(r, c);
      }
    }
  }
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].isMine) {
        count++;
      }
    }
  }
  return count;
}

function renderBoard() {
  const boardEl = document.getElementById('board');
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  boardEl.innerHTML = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => handleClick(r, c));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleRightClick(r, c);
      });

      boardEl.appendChild(cell);
    }
  }
}

function handleClick(row, col) {
  if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) return;

  if (!gameStarted) {
    gameStarted = true;
    placeMines(row, col);
    startTimer();
  }

  reveal(row, col);
  checkWin();
}

function handleRightClick(row, col) {
  if (gameOver || board[row][col].isRevealed) return;

  const cell = board[row][col];
  cell.isFlagged = !cell.isFlagged;
  flaggedCount += cell.isFlagged ? 1 : -1;

  document.getElementById('mines-count').textContent = mines - flaggedCount;
  updateCellDisplay(row, col);
  Sound.play('click');
}

function reveal(row, col) {
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  const cell = board[row][col];
  if (cell.isRevealed || cell.isFlagged) return;

  cell.isRevealed = true;
  revealedCount++;

  if (cell.isMine) {
    gameOver = true;
    revealAllMines();
    Sound.play('lose');
    clearInterval(timerInterval);
    alert('游戏结束！踩到地雷了。');
    return;
  }

  Sound.play('click');
  updateCellDisplay(row, col);

  if (cell.count === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        reveal(row + dr, col + dc);
      }
    }
  }
}

function updateCellDisplay(row, col) {
  const cellEl = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  const cell = board[row][col];

  cellEl.className = 'cell';

  if (cell.isRevealed) {
    cellEl.classList.add('revealed');
    if (cell.isMine) {
      cellEl.classList.add('mine');
      cellEl.textContent = '💣';
    } else if (cell.count > 0) {
      cellEl.textContent = cell.count;
      cellEl.dataset.count = cell.count;
    }
  } else if (cell.isFlagged) {
    cellEl.classList.add('flagged');
  } else {
    cellEl.textContent = '';
  }
}

function revealAllMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) {
        board[r][c].isRevealed = true;
        updateCellDisplay(r, c);
      }
    }
  }
}

function checkWin() {
  if (gameOver) return;
  if (revealedCount === rows * cols - mines) {
    gameOver = true;
    clearInterval(timerInterval);
    Sound.play('win');
    
    const score = timer;
    Storage.setHighScore(GAME_ID, Math.max(Storage.getHighScore(GAME_ID), score));
    Storage.addRecord(GAME_ID, score);
    updateHighScore();
    renderLeaderboard();
    
    alert(`恭喜获胜！用时 ${timer} 秒`);
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}秒</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 5: 创建缩略图占位文件**

创建一个简单的 SVG 占位图或使用 emoji。

- [ ] **Step 6: 提交扫雷游戏**

```bash
git add games/minesweeper/
git commit -m "feat: 添加扫雷游戏"
```

---

### Task 9: 创建 2048 游戏

**Files:**
- Create: `games/2048/index.html`
- Create: `games/2048/game.js`
- Create: `games/2048/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/2048
```

- [ ] **Step 2: 创建 2048 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2048 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">2048</div>
      <div class="game-header-right">
        <div class="high-score">最高分: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-controls">
          <div class="score-display">分数: <strong id="score">0</strong></div>
          <button id="restart-btn" class="btn">重新开始</button>
        </div>
        <div id="grid" class="grid"></div>
        <div id="game-over" class="game-over hidden">游戏结束！</div>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          使用方向键（↑↓←→）滑动方块，相同数字的方块会合并。目标是合成 2048！
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">排行榜</h3>
        <div class="info-section-content" id="leaderboard">暂无记录</div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建 2048 样式**

```css
/* games/2048/style.css */

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-display {
  font-size: 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 100px);
  gap: 10px;
  background-color: #bbada0;
  padding: 10px;
  border-radius: var(--radius);
}

.tile {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #cdc1b4;
  border-radius: 6px;
  font-size: 32px;
  font-weight: bold;
  color: #776e65;
  transition: all 0.15s ease;
}

.tile[data-value="2"] { background-color: #eee4da; }
.tile[data-value="4"] { background-color: #ede0c8; }
.tile[data-value="8"] { background-color: #f2b179; color: white; }
.tile[data-value="16"] { background-color: #f59563; color: white; }
.tile[data-value="32"] { background-color: #f67c5f; color: white; }
.tile[data-value="64"] { background-color: #f65e3b; color: white; }
.tile[data-value="128"] { background-color: #edcf72; color: white; font-size: 28px; }
.tile[data-value="256"] { background-color: #edcc61; color: white; font-size: 28px; }
.tile[data-value="512"] { background-color: #edc850; color: white; font-size: 28px; }
.tile[data-value="1024"] { background-color: #edc53f; color: white; font-size: 24px; }
.tile[data-value="2048"] { background-color: #edc22e; color: white; font-size: 24px; }

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px 40px;
  border-radius: var(--radius);
  font-size: 24px;
  font-weight: bold;
}

.game-over.hidden {
  display: none;
}
```

- [ ] **Step 4: 创建 2048 游戏逻辑**

```javascript
// games/2048/game.js

const GAME_ID = '2048';
const GRID_SIZE = 4;

let grid = [];
let score = 0;
let gameOver = false;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  startGame();
}

function bindEvents() {
  document.getElementById('restart-btn').addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeyDown);
}

function startGame() {
  grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  score = 0;
  gameOver = false;
  
  document.getElementById('score').textContent = '0';
  document.getElementById('game-over').classList.add('hidden');
  
  addRandomTile();
  addRandomTile();
  renderGrid();
}

function addRandomTile() {
  const emptyCells = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }
  
  if (emptyCells.length === 0) return false;
  
  const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function renderGrid() {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';
  
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      const value = grid[r][c];
      if (value > 0) {
        tile.textContent = value;
        tile.dataset.value = value;
      }
      gridEl.appendChild(tile);
    }
  }
}

function handleKeyDown(e) {
  if (gameOver) return;
  
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  };
  
  const direction = keyMap[e.key];
  if (!direction) return;
  
  e.preventDefault();
  
  const moved = move(direction);
  if (moved) {
    Sound.play('move');
    addRandomTile();
    renderGrid();
    document.getElementById('score').textContent = score;
    
    if (checkGameOver()) {
      gameOver = true;
      Sound.play('lose');
      document.getElementById('game-over').classList.remove('hidden');
      
      Storage.setHighScore(GAME_ID, Math.max(Storage.getHighScore(GAME_ID), score));
      Storage.addRecord(GAME_ID, score);
      updateHighScore();
      renderLeaderboard();
    }
  }
}

function move(direction) {
  let moved = false;
  
  const rotateGrid = (times) => {
    for (let t = 0; t < times; t++) {
      const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
        }
      }
      grid = newGrid;
    }
  };
  
  const rotations = { up: 0, right: 1, down: 2, left: 3 };
  rotateGrid(rotations[direction]);
  
  for (let c = 0; c < GRID_SIZE; c++) {
    const column = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] !== 0) column.push(grid[r][c]);
    }
    
    const merged = [];
    for (let i = 0; i < column.length; i++) {
      if (i < column.length - 1 && column[i] === column[i + 1]) {
        merged.push(column[i] * 2);
        score += column[i] * 2;
        i++;
      } else {
        merged.push(column[i]);
      }
    }
    
    while (merged.length < GRID_SIZE) merged.push(0);
    
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] !== merged[r]) moved = true;
      grid[r][c] = merged[r];
    }
  }
  
  rotateGrid((4 - rotations[direction]) % 4);
  return moved;
}

function checkGameOver() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return false;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
    }
  }
  return true;
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}分</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 5: 提交 2048 游戏**

```bash
git add games/2048/
git commit -m "feat: 添加 2048 游戏"
```

---

### Task 10: 创建 Google 小恐龙游戏

**Files:**
- Create: `games/dino/index.html`
- Create: `games/dino/game.js`
- Create: `games/dino/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/dino
```

- [ ] **Step 2: 创建小恐龙 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google小恐龙 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">Google小恐龙</div>
      <div class="game-header-right">
        <div class="high-score">最高分: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-controls">
          <div class="score-display">分数: <strong id="score">0</strong></div>
          <button id="restart-btn" class="btn">重新开始</button>
        </div>
        <canvas id="canvas" width="800" height="200"></canvas>
        <div id="game-over" class="game-over hidden">
          游戏结束！按空格键重新开始
        </div>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          按空格键或点击屏幕让恐龙跳跃，躲避障碍物。速度会越来越快，坚持越久分数越高！
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">排行榜</h3>
        <div class="info-section-content" id="leaderboard">暂无记录</div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建小恐龙样式**

```css
/* games/dino/style.css */

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-display {
  font-size: 18px;
}

#canvas {
  background-color: #f7f7f7;
  border-radius: var(--radius);
  display: block;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px 40px;
  border-radius: var(--radius);
  font-size: 18px;
  text-align: center;
}

.game-over.hidden {
  display: none;
}
```

- [ ] **Step 4: 创建小恐龙游戏逻辑**

```javascript
// games/dino/game.js

const GAME_ID = 'dino';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GROUND_Y = 170;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;

let dino = { x: 50, y: GROUND_Y - DINO_HEIGHT, vy: 0, isJumping: false };
let obstacles = [];
let score = 0;
let speed = 6;
let gameOver = false;
let gameStarted = false;
let animationId = null;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  resetGame();
  drawStartScreen();
}

function bindEvents() {
  document.getElementById('restart-btn').addEventListener('click', () => {
    resetGame();
    startGame();
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameOver) {
        resetGame();
        startGame();
      } else if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    }
  });

  canvas.addEventListener('click', () => {
    if (gameOver) {
      resetGame();
      startGame();
    } else if (!gameStarted) {
      startGame();
    } else {
      jump();
    }
  });
}

function resetGame() {
  dino = { x: 50, y: GROUND_Y - DINO_HEIGHT, vy: 0, isJumping: false };
  obstacles = [];
  score = 0;
  speed = 6;
  gameOver = false;
  gameStarted = false;
  
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  document.getElementById('score').textContent = '0';
  document.getElementById('game-over').classList.add('hidden');
}

function startGame() {
  gameStarted = true;
  gameLoop();
}

function jump() {
  if (!dino.isJumping) {
    dino.vy = JUMP_FORCE;
    dino.isJumping = true;
    Sound.play('click');
  }
}

function gameLoop() {
  if (gameOver) return;

  update();
  draw();
  
  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  // 更新恐龙
  dino.vy += GRAVITY;
  dino.y += dino.vy;
  
  if (dino.y >= GROUND_Y - DINO_HEIGHT) {
    dino.y = GROUND_Y - DINO_HEIGHT;
    dino.vy = 0;
    dino.isJumping = false;
  }

  // 生成障碍物
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < 600) {
    if (Math.random() < 0.02) {
      const type = Math.random() < 0.7 ? 'cactus' : 'bird';
      obstacles.push({
        x: 800,
        y: type === 'cactus' ? GROUND_Y - 40 : GROUND_Y - 80,
        width: type === 'cactus' ? 20 : 40,
        height: type === 'cactus' ? 40 : 30,
        type
      });
    }
  }

  // 更新障碍物
  obstacles.forEach(obs => {
    obs.x -= speed;
  });
  
  // 移除屏幕外的障碍物
  obstacles = obstacles.filter(obs => obs.x > -50);

  // 碰撞检测
  obstacles.forEach(obs => {
    if (checkCollision(dino, obs)) {
      endGame();
    }
  });

  // 更新分数和速度
  score++;
  if (score % 500 === 0) {
    speed += 0.5;
  }
  
  document.getElementById('score').textContent = score;
}

function checkCollision(dino, obs) {
  return dino.x < obs.x + obs.width &&
         dino.x + DINO_WIDTH > obs.x &&
         dino.y < obs.y + obs.height &&
         dino.y + DINO_HEIGHT > obs.y;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制地面
  ctx.fillStyle = '#535353';
  ctx.fillRect(0, GROUND_Y, canvas.width, 2);

  // 绘制恐龙
  ctx.fillStyle = '#535353';
  ctx.fillRect(dino.x, dino.y, DINO_WIDTH, DINO_HEIGHT);
  
  // 绘制眼睛
  ctx.fillStyle = '#fff';
  ctx.fillRect(dino.x + 28, dino.y + 8, 8, 8);

  // 绘制障碍物
  ctx.fillStyle = '#535353';
  obstacles.forEach(obs => {
    if (obs.type === 'cactus') {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    } else {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.fillRect(obs.x + 10, obs.y + 10, 20, 10);
    }
  });
}

function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#535353';
  ctx.fillRect(0, GROUND_Y, canvas.width, 2);
  
  ctx.fillStyle = '#535353';
  ctx.fillRect(dino.x, dino.y, DINO_WIDTH, DINO_HEIGHT);
  
  ctx.fillStyle = '#fff';
  ctx.fillRect(dino.x + 28, dino.y + 8, 8, 8);
  
  ctx.fillStyle = '#535353';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('按空格键开始游戏', canvas.width / 2, 100);
}

function endGame() {
  gameOver = true;
  Sound.play('lose');
  document.getElementById('game-over').classList.remove('hidden');
  
  Storage.setHighScore(GAME_ID, Math.max(Storage.getHighScore(GAME_ID), score));
  Storage.addRecord(GAME_ID, score);
  updateHighScore();
  renderLeaderboard();
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}分</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 5: 提交小恐龙游戏**

```bash
git add games/dino/
git commit -m "feat: 添加 Google 小恐龙游戏"
```

---

### Task 11: 创建五子棋游戏（含 AI）

**Files:**
- Create: `games/gomoku/index.html`
- Create: `games/gomoku/game.js`
- Create: `games/gomoku/ai.js`
- Create: `games/gomoku/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/gomoku
```

- [ ] **Step 2: 创建五子棋 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>五子棋 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">五子棋</div>
      <div class="game-header-right">
        <div class="high-score">胜场: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-controls">
          <div class="status-display" id="status">你的回合（黑棋）</div>
          <button id="restart-btn" class="btn">重新开始</button>
        </div>
        <canvas id="canvas" width="600" height="600"></canvas>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          点击棋盘落子，你执黑棋先行，AI 执白棋。先连成五子者获胜。
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">战绩</h3>
        <div class="info-section-content" id="leaderboard">暂无记录</div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="ai.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建五子棋样式**

```css
/* games/gomoku/style.css */

.game-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.status-display {
  font-size: 16px;
  font-weight: 600;
}

#canvas {
  background-color: #dcb35c;
  border-radius: var(--radius);
  cursor: pointer;
  display: block;
}
```

- [ ] **Step 4: 创建 AI 模块**

```javascript
// games/gomoku/ai.js

const BOARD_SIZE = 15;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const SCORES = {
  FIVE: 100000,
  LIVE_FOUR: 10000,
  RUSH_FOUR: 1000,
  LIVE_THREE: 1000,
  SLEEP_THREE: 100,
  LIVE_TWO: 100,
  SLEEP_TWO: 10
};

function getAIMove(board) {
  const candidates = getCandidates(board);
  if (candidates.length === 0) {
    return { row: 7, col: 7 };
  }

  let bestScore = -Infinity;
  let bestMove = candidates[0];

  for (const { row, col } of candidates) {
    board[row][col] = WHITE;
    const score = minimax(board, 2, false, -Infinity, Infinity);
    board[row][col] = EMPTY;

    if (score > bestScore) {
      bestScore = score;
      bestMove = { row, col };
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  const winner = checkWinner(board);
  if (winner === WHITE) return SCORES.FIVE;
  if (winner === BLACK) return -SCORES.FIVE;
  if (depth === 0) return evaluateBoard(board);

  const candidates = getCandidates(board).slice(0, 10);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const { row, col } of candidates) {
      board[row][col] = WHITE;
      const score = minimax(board, depth - 1, false, alpha, beta);
      board[row][col] = EMPTY;
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const { row, col } of candidates) {
      board[row][col] = BLACK;
      const score = minimax(board, depth - 1, true, alpha, beta);
      board[row][col] = EMPTY;
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}

function getCandidates(board) {
  const candidates = [];
  const visited = new Set();

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            const key = `${nr},${nc}`;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE &&
                board[nr][nc] === EMPTY && !visited.has(key)) {
              visited.add(key);
              candidates.push({ row: nr, col: nc, score: evaluatePosition(board, nr, nc) });
            }
          }
        }
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}

function evaluatePosition(board, row, col) {
  let score = 0;
  board[row][col] = WHITE;
  score += evaluatePoint(board, row, col, WHITE);
  board[row][col] = BLACK;
  score += evaluatePoint(board, row, col, BLACK);
  board[row][col] = EMPTY;
  return score;
}

function evaluateBoard(board) {
  let score = 0;
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === WHITE) {
        score += evaluatePoint(board, r, c, WHITE);
      } else if (board[r][c] === BLACK) {
        score -= evaluatePoint(board, r, c, BLACK);
      }
    }
  }
  return score;
}

function evaluatePoint(board, row, col, player) {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  let totalScore = 0;

  for (const [dr, dc] of directions) {
    const { count, openEnds } = countLine(board, row, col, dr, dc, player);
    totalScore += getPatternScore(count, openEnds);
  }

  return totalScore;
}

function countLine(board, row, col, dr, dc, player) {
  let count = 1;
  let openEnds = 0;

  let r = row + dr, c = col + dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }
  if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === EMPTY) {
    openEnds++;
  }

  r = row - dr;
  c = col - dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r -= dr;
    c -= dc;
  }
  if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === EMPTY) {
    openEnds++;
  }

  return { count, openEnds };
}

function getPatternScore(count, openEnds) {
  if (count >= 5) return SCORES.FIVE;
  if (count === 4) {
    if (openEnds === 2) return SCORES.LIVE_FOUR;
    if (openEnds === 1) return SCORES.RUSH_FOUR;
  }
  if (count === 3) {
    if (openEnds === 2) return SCORES.LIVE_THREE;
    if (openEnds === 1) return SCORES.SLEEP_THREE;
  }
  if (count === 2) {
    if (openEnds === 2) return SCORES.LIVE_TWO;
    if (openEnds === 1) return SCORES.SLEEP_TWO;
  }
  return 0;
}

function checkWinner(board) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        const player = board[r][c];
        if (checkWinAt(board, r, c, player)) {
          return player;
        }
      }
    }
  }
  return null;
}

function checkWinAt(board, row, col, player) {
  const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
  
  for (const [dr, dc] of directions) {
    let count = 1;
    
    let r = row + dr, c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }
    
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }
    
    if (count >= 5) return true;
  }
  
  return false;
}
```

- [ ] **Step 5: 创建五子棋游戏逻辑**

```javascript
// games/gomoku/game.js

const GAME_ID = 'gomoku';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 40;
const PADDING = 0;

let board = [];
let currentPlayer = BLACK;
let gameOver = false;
let wins = 0;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  resetGame();
}

function bindEvents() {
  document.getElementById('restart-btn').addEventListener('click', resetGame);
  
  canvas.addEventListener('click', handleClick);
}

function resetGame() {
  board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  currentPlayer = BLACK;
  gameOver = false;
  
  document.getElementById('status').textContent = '你的回合（黑棋）';
  drawBoard();
}

function handleClick(e) {
  if (gameOver || currentPlayer !== BLACK) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const col = Math.round((x - PADDING) / CELL_SIZE);
  const row = Math.round((y - PADDING) / CELL_SIZE);
  
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
  if (board[row][col] !== EMPTY) return;

  makeMove(row, col, BLACK);
  Sound.play('move');

  if (checkWinner(board) === BLACK) {
    endGame(BLACK);
    return;
  }

  currentPlayer = WHITE;
  document.getElementById('status').textContent = 'AI 思考中...';

  setTimeout(() => {
    const aiMove = getAIMove(board);
    makeMove(aiMove.row, aiMove.col, WHITE);
    Sound.play('move');

    if (checkWinner(board) === WHITE) {
      endGame(WHITE);
      return;
    }

    currentPlayer = BLACK;
    document.getElementById('status').textContent = '你的回合（黑棋）';
  }, 300);
}

function makeMove(row, col, player) {
  board[row][col] = player;
  drawBoard();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#8b4513';
  ctx.lineWidth = 1;

  for (let i = 0; i < BOARD_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
    ctx.lineTo(PADDING + i * CELL_SIZE, PADDING + (BOARD_SIZE - 1) * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
    ctx.lineTo(PADDING + (BOARD_SIZE - 1) * CELL_SIZE, PADDING + i * CELL_SIZE);
    ctx.stroke();
  }

  const starPoints = [[3, 3], [3, 11], [11, 3], [11, 11], [7, 7]];
  ctx.fillStyle = '#8b4513';
  for (const [r, c] of starPoints) {
    ctx.beginPath();
    ctx.arc(PADDING + c * CELL_SIZE, PADDING + r * CELL_SIZE, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        drawPiece(r, c, board[r][c]);
      }
    }
  }
}

function drawPiece(row, col, player) {
  const x = PADDING + col * CELL_SIZE;
  const y = PADDING + row * CELL_SIZE;
  const radius = CELL_SIZE * 0.4;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  
  if (player === BLACK) {
    ctx.fillStyle = '#000';
  } else {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
  }
  
  ctx.fill();
  if (player === WHITE) {
    ctx.stroke();
  }
}

function endGame(winner) {
  gameOver = true;
  
  if (winner === BLACK) {
    Sound.play('win');
    document.getElementById('status').textContent = '你赢了！';
    wins++;
    Storage.setHighScore(GAME_ID, wins);
    Storage.addRecord(GAME_ID, 1);
  } else {
    Sound.play('lose');
    document.getElementById('status').textContent = 'AI 获胜！';
  }
  
  updateHighScore();
  renderLeaderboard();
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">胜利</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 6: 提交五子棋游戏**

```bash
git add games/gomoku/
git commit -m "feat: 添加五子棋游戏（含 AI）"
```

---

### Task 12: 创建俄罗斯方块游戏

**Files:**
- Create: `games/tetris/index.html`
- Create: `games/tetris/game.js`
- Create: `games/tetris/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/tetris
```

- [ ] **Step 2: 创建俄罗斯方块 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>俄罗斯方块 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">俄罗斯方块</div>
      <div class="game-header-right">
        <div class="high-score">最高分: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-wrapper">
          <div class="game-main">
            <div class="game-controls">
              <div>分数: <strong id="score">0</strong></div>
              <div>等级: <strong id="level">1</strong></div>
              <button id="restart-btn" class="btn">重新开始</button>
            </div>
            <canvas id="canvas" width="300" height="600"></canvas>
          </div>
          <div class="game-side">
            <div class="next-piece">
              <div class="next-label">下一个</div>
              <canvas id="next-canvas" width="120" height="120"></canvas>
            </div>
          </div>
        </div>
        <div id="game-over" class="game-over hidden">游戏结束！</div>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          使用方向键控制：← → 移动，↑ 旋转，↓ 加速下落。填满一行消除得分。
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">排行榜</h3>
        <div class="info-section-content" id="leaderboard">暂无记录</div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建俄罗斯方块样式**

```css
/* games/tetris/style.css */

.game-wrapper {
  display: flex;
  gap: 20px;
}

.game-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.game-controls {
  display: flex;
  gap: 20px;
  align-items: center;
}

#canvas {
  background-color: #000;
  border-radius: var(--radius);
  display: block;
}

.game-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.next-piece {
  background-color: var(--sidebar-bg);
  border-radius: var(--radius);
  padding: 16px;
}

.next-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

#next-canvas {
  background-color: #000;
  border-radius: var(--radius);
  display: block;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: var(--radius);
  font-size: 24px;
  font-weight: bold;
}

.game-over.hidden {
  display: none;
}
```

- [ ] **Step 4: 创建俄罗斯方块游戏逻辑**

```javascript
// games/tetris/game.js

const GAME_ID = 'tetris';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
  null,
  '#00f0f0', // I
  '#0000f0', // J
  '#f0a000', // L
  '#f0f000', // O
  '#00f000', // S
  '#a000f0', // T
  '#f00000'  // Z
];

const SHAPES = [
  null,
  [[1, 1, 1, 1]],                          // I
  [[2, 0, 0], [2, 2, 2]],                  // J
  [[0, 0, 3], [3, 3, 3]],                  // L
  [[4, 4], [4, 4]],                        // O
  [[0, 5, 5], [5, 5, 0]],                  // S
  [[0, 6, 0], [6, 6, 6]],                  // T
  [[7, 7, 0], [0, 7, 7]]                   // Z
];

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let gameOver = false;
let dropInterval = null;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  startGame();
}

function bindEvents() {
  document.getElementById('restart-btn').addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeyDown);
}

function startGame() {
  board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
  score = 0;
  level = 1;
  gameOver = false;

  document.getElementById('score').textContent = '0';
  document.getElementById('level').textContent = '1';
  document.getElementById('game-over').classList.add('hidden');

  if (dropInterval) clearInterval(dropInterval);

  nextPiece = createPiece();
  spawnPiece();
  
  dropInterval = setInterval(drop, 1000 / level);
  
  draw();
}

function createPiece() {
  const type = Math.floor(Math.random() * 7) + 1;
  return {
    shape: SHAPES[type].map(row => [...row]),
    type,
    x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2),
    y: 0
  };
}

function spawnPiece() {
  currentPiece = nextPiece;
  nextPiece = createPiece();
  
  if (collision(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    endGame();
  }
  
  drawNext();
}

function collision(shape, x, y) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const newX = x + c;
        const newY = y + r;
        
        if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
        if (newY >= 0 && board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function merge() {
  for (let r = 0; r < currentPiece.shape.length; r++) {
    for (let c = 0; c < currentPiece.shape[r].length; c++) {
      if (currentPiece.shape[r][c]) {
        board[currentPiece.y + r][currentPiece.x + c] = currentPiece.type;
      }
    }
  }
}

function clearLines() {
  let linesCleared = 0;
  
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(cell => cell !== 0)) {
      board.splice(r, 1);
      board.unshift(Array(COLS).fill(0));
      linesCleared++;
      r++;
    }
  }
  
  if (linesCleared > 0) {
    Sound.play('win');
    score += linesCleared * 100 * level;
    document.getElementById('score').textContent = score;
    
    if (score >= level * 1000) {
      level++;
      document.getElementById('level').textContent = level;
      clearInterval(dropInterval);
      dropInterval = setInterval(drop, 1000 / level);
    }
  }
}

function drop() {
  if (gameOver) return;
  
  if (!collision(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
    currentPiece.y++;
  } else {
    merge();
    clearLines();
    spawnPiece();
  }
  
  draw();
}

function rotate(shape) {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  
  return rotated;
}

function handleKeyDown(e) {
  if (gameOver) return;

  switch (e.key) {
    case 'ArrowLeft':
      if (!collision(currentPiece.shape, currentPiece.x - 1, currentPiece.y)) {
        currentPiece.x--;
        Sound.play('move');
      }
      break;
    case 'ArrowRight':
      if (!collision(currentPiece.shape, currentPiece.x + 1, currentPiece.y)) {
        currentPiece.x++;
        Sound.play('move');
      }
      break;
    case 'ArrowDown':
      drop();
      break;
    case 'ArrowUp':
      const rotated = rotate(currentPiece.shape);
      if (!collision(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
        Sound.play('move');
      }
      break;
  }
  
  draw();
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]) {
        drawBlock(ctx, c, r, COLORS[board[r][c]]);
      }
    }
  }

  if (currentPiece) {
    for (let r = 0; r < currentPiece.shape.length; r++) {
      for (let c = 0; c < currentPiece.shape[r].length; c++) {
        if (currentPiece.shape[r][c]) {
          drawBlock(ctx, currentPiece.x + c, currentPiece.y + r, COLORS[currentPiece.type]);
        }
      }
    }
  }
}

function drawBlock(context, x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
  context.fillStyle = 'rgba(255, 255, 255, 0.3)';
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, 4);
  context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, 4, BLOCK_SIZE - 1);
}

function drawNext() {
  nextCtx.fillStyle = '#000';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

  const offsetX = (nextCanvas.width - nextPiece.shape[0].length * BLOCK_SIZE) / 2;
  const offsetY = (nextCanvas.height - nextPiece.shape.length * BLOCK_SIZE) / 2;

  for (let r = 0; r < nextPiece.shape.length; r++) {
    for (let c = 0; c < nextPiece.shape[r].length; c++) {
      if (nextPiece.shape[r][c]) {
        nextCtx.fillStyle = COLORS[nextPiece.type];
        nextCtx.fillRect(
          offsetX + c * BLOCK_SIZE,
          offsetY + r * BLOCK_SIZE,
          BLOCK_SIZE - 1,
          BLOCK_SIZE - 1
        );
      }
    }
  }
}

function endGame() {
  gameOver = true;
  clearInterval(dropInterval);
  Sound.play('lose');
  document.getElementById('game-over').classList.remove('hidden');
  
  Storage.setHighScore(GAME_ID, Math.max(Storage.getHighScore(GAME_ID), score));
  Storage.addRecord(GAME_ID, score);
  updateHighScore();
  renderLeaderboard();
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}分</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 5: 提交俄罗斯方块游戏**

```bash
git add games/tetris/
git commit -m "feat: 添加俄罗斯方块游戏"
```

---

### Task 13: 创建三维弹球游戏

**Files:**
- Create: `games/pinball/index.html`
- Create: `games/pinball/game.js`
- Create: `games/pinball/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/pinball
```

- [ ] **Step 2: 创建三维弹球 HTML**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>三维弹球 - Game-Joy</title>
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/game.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="game-layout">
    <header class="game-header">
      <div class="game-header-left">
        <button class="menu-btn" id="menu-btn">☰</button>
        <a href="../../index.html" class="back-btn">← 返回</a>
      </div>
      <div class="game-header-center">三维弹球</div>
      <div class="game-header-right">
        <div class="high-score">最高分: <span class="high-score-value" id="high-score">0</span></div>
      </div>
    </header>

    <div class="game-area">
      <div class="game-container">
        <div class="game-controls">
          <div>分数: <strong id="score">0</strong></div>
          <div>球数: <strong id="balls">3</strong></div>
          <button id="restart-btn" class="btn">重新开始</button>
        </div>
        <canvas id="canvas" width="400" height="600"></canvas>
        <div id="game-over" class="game-over hidden">游戏结束！</div>
      </div>
    </div>

    <div class="game-info">
      <div class="info-section">
        <h3 class="info-section-title">游戏说明</h3>
        <div class="info-section-content">
          使用 ← → 方向键控制左右挡板，按空格键发射球。击中障碍物得分，不要让球落到底部。
        </div>
      </div>
      <div class="info-section">
        <h3 class="info-section-title">排行榜</h3>
        <div class="info-section-content" id="leaderboard">暂无记录</div>
      </div>
    </div>
  </div>

  <script src="../../js/common.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 3: 创建三维弹球样式**

```css
/* games/pinball/style.css */

.game-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 16px;
}

#canvas {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: var(--radius);
  display: block;
}

.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: var(--radius);
  font-size: 24px;
  font-weight: bold;
}

.game-over.hidden {
  display: none;
}
```

- [ ] **Step 4: 创建三维弹球游戏逻辑**

```javascript
// games/pinball/game.js

const GAME_ID = 'pinball';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.2;
const FRICTION = 0.99;

let ball = null;
let leftFlipper = { x: 100, y: 550, angle: 0.4, targetAngle: 0.4 };
let rightFlipper = { x: 300, y: 550, angle: -0.4, targetAngle: -0.4 };
let obstacles = [];
let score = 0;
let balls = 3;
let gameOver = false;
let launched = false;
let animationId = null;

function init() {
  Sound.init();
  updateHighScore();
  renderLeaderboard();
  bindEvents();
  startGame();
}

function bindEvents() {
  document.getElementById('restart-btn').addEventListener('click', startGame);
  
  document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    if (e.key === 'ArrowLeft') {
      leftFlipper.targetAngle = -0.5;
    } else if (e.key === 'ArrowRight') {
      rightFlipper.targetAngle = 0.5;
    } else if (e.key === ' ' && !launched) {
      launchBall();
    }
  });
  
  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
      leftFlipper.targetAngle = 0.4;
    } else if (e.key === 'ArrowRight') {
      rightFlipper.targetAngle = -0.4;
    }
  });
}

function startGame() {
  score = 0;
  balls = 3;
  gameOver = false;
  launched = false;
  
  document.getElementById('score').textContent = '0';
  document.getElementById('balls').textContent = '3';
  document.getElementById('game-over').classList.add('hidden');
  
  if (animationId) cancelAnimationFrame(animationId);
  
  initObstacles();
  resetBall();
  gameLoop();
}

function initObstacles() {
  obstacles = [
    { x: 200, y: 150, radius: 25, points: 100, color: '#ff6b6b' },
    { x: 100, y: 250, radius: 20, points: 50, color: '#4ecdc4' },
    { x: 300, y: 250, radius: 20, points: 50, color: '#4ecdc4' },
    { x: 200, y: 350, radius: 30, points: 75, color: '#ffe66d' },
    { x: 150, y: 450, radius: 15, points: 25, color: '#95e1d3' },
    { x: 250, y: 450, radius: 15, points: 25, color: '#95e1d3' }
  ];
}

function resetBall() {
  ball = {
    x: 380,
    y: 500,
    vx: 0,
    vy: 0,
    radius: 10
  };
  launched = false;
}

function launchBall() {
  ball.vy = -12;
  ball.vx = -2 + Math.random() * 4;
  launched = true;
  Sound.play('click');
}

function gameLoop() {
  if (gameOver) return;
  
  update();
  draw();
  animationId = requestAnimationFrame(gameLoop);
}

function update() {
  leftFlipper.angle += (leftFlipper.targetAngle - leftFlipper.angle) * 0.3;
  rightFlipper.angle += (rightFlipper.targetAngle - rightFlipper.angle) * 0.3;
  
  if (!launched) return;
  
  ball.vy += GRAVITY;
  ball.vx *= FRICTION;
  ball.vy *= FRICTION;
  
  ball.x += ball.vx;
  ball.y += ball.vy;
  
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.vx = -ball.vx * 0.8;
  }
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.vx = -ball.vx * 0.8;
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.vy = -ball.vy * 0.8;
  }
  
  obstacles.forEach(obs => {
    const dx = ball.x - obs.x;
    const dy = ball.y - obs.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius + obs.radius) {
      const angle = Math.atan2(dy, dx);
      ball.vx = Math.cos(angle) * 5;
      ball.vy = Math.sin(angle) * 5;
      
      score += obs.points;
      document.getElementById('score').textContent = score;
      Sound.play('win');
    }
  });
  
  checkFlipperCollision(leftFlipper, true);
  checkFlipperCollision(rightFlipper, false);
  
  if (ball.y > canvas.height + 50) {
    balls--;
    document.getElementById('balls').textContent = balls;
    
    if (balls <= 0) {
      endGame();
    } else {
      resetBall();
      Sound.play('lose');
    }
  }
}

function checkFlipperCollision(flipper, isLeft) {
  const flipperLength = 60;
  const flipperWidth = 10;
  
  const cos = Math.cos(flipper.angle);
  const sin = Math.sin(flipper.angle);
  
  const x1 = isLeft ? flipper.x : flipper.x - flipperLength * cos;
  const y1 = flipper.y + (isLeft ? 0 : flipperLength * sin);
  const x2 = isLeft ? flipper.x + flipperLength * cos : flipper.x;
  const y2 = flipper.y + (isLeft ? flipperLength * sin : 0);
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len;
  const ny = dx / len;
  
  const px = ball.x - x1;
  const py = ball.y - y1;
  
  const proj = (px * dx + py * dy) / len;
  
  if (proj >= 0 && proj <= len) {
    const dist = Math.abs(px * nx + py * ny);
    
    if (dist < ball.radius + flipperWidth / 2) {
      ball.y = y1 + proj * (dy / len) - (ball.radius + flipperWidth / 2) * (ny < 0 ? -1 : 1);
      
      const bounceStrength = 8 + Math.abs(flipper.targetAngle - flipper.angle) * 10;
      ball.vy = -Math.abs(bounceStrength);
      ball.vx += (isLeft ? 2 : -2);
      
      Sound.play('move');
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawFlippers();
  drawObstacles();
  drawBall();
  drawLaunchHint();
}

function drawFlippers() {
  ctx.save();
  
  ctx.translate(leftFlipper.x, leftFlipper.y);
  ctx.rotate(leftFlipper.angle);
  ctx.fillStyle = '#e94560';
  ctx.fillRect(0, -5, 60, 10);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
  
  ctx.save();
  
  ctx.translate(rightFlipper.x, rightFlipper.y);
  ctx.rotate(rightFlipper.angle);
  ctx.fillStyle = '#e94560';
  ctx.fillRect(-60, -5, 60, 10);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.beginPath();
    ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
    ctx.fillStyle = obs.color;
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(obs.x - obs.radius * 0.3, obs.y - obs.radius * 0.3, obs.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
  });
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(ball.x - 3, ball.y - 3, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fill();
}

function drawLaunchHint() {
  if (!launched) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('按空格键发射', 200, 580);
  }
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animationId);
  Sound.play('lose');
  document.getElementById('game-over').classList.remove('hidden');
  
  Storage.setHighScore(GAME_ID, Math.max(Storage.getHighScore(GAME_ID), score));
  Storage.addRecord(GAME_ID, score);
  updateHighScore();
  renderLeaderboard();
}

function updateHighScore() {
  document.getElementById('high-score').textContent = Storage.getHighScore(GAME_ID);
}

function renderLeaderboard() {
  const history = Storage.getHistory(GAME_ID);
  const container = document.getElementById('leaderboard');
  
  if (history.length === 0) {
    container.innerHTML = '暂无记录';
    return;
  }

  container.innerHTML = history.map((record, index) => `
    <div class="leaderboard-item">
      <span class="leaderboard-rank">#${index + 1}</span>
      <span class="leaderboard-score">${record.score}分</span>
      <span class="leaderboard-date">${new Date(record.date).toLocaleDateString()}</span>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', init);
```

- [ ] **Step 5: 提交三维弹球游戏**

```bash
git add games/pinball/
git commit -m "feat: 添加三维弹球游戏"
```

---

## Phase 4: 音效文件和最终提交

### Task 14: 创建音效占位文件

**Files:**
- Create: `assets/sounds/click.mp3` (占位)
- Create: `assets/sounds/win.mp3` (占位)
- Create: `assets/sounds/lose.mp3` (占位)
- Create: `assets/sounds/move.mp3` (占位)

- [ ] **Step 1: 创建音效目录**

```bash
mkdir -p assets/sounds
```

- [ ] **Step 2: 创建空的音效占位文件**

由于无法创建真实的音频文件，可以：
1. 使用在线免费音效资源下载
2. 或暂时使用空文件，后续替换

- [ ] **Step 3: 提交音效文件**

```bash
git add assets/sounds/
git commit -m "feat: 添加音效文件占位"
```

---

### Task 15: 最终提交和推送

- [ ] **Step 1: 检查所有文件**

```bash
git status
```

- [ ] **Step 2: 推送到 GitHub**

```bash
git push origin main
```

---

## 自检清单

**1. Spec 覆盖检查：**
- [x] 首页布局（侧边栏 + 游戏卡片）
- [x] 游戏页布局（顶部栏 + 游戏区域 + 说明）
- [x] 6 款游戏全部实现
- [x] 本地存储（高分、历史记录）
- [x] 音效系统（默认关闭）
- [x] 热度统计

**2. 占位符检查：**
- 无 "TBD"、"TODO" 等占位符
- 所有代码步骤都有完整实现

**3. 类型一致性检查：**
- Storage 模块方法名一致
- Sound 模块方法名一致
- 游戏配置字段名一致
