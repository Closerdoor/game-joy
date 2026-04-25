# Game-Joy 游戏网站实现计划 (TDD)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个纯前端静态游戏网站，包含 6 款 H5 小游戏，部署到 GitHub Pages。使用 TDD 保证代码质量。

**Architecture:** 采用独立游戏目录结构，每个游戏自包含 HTML/CSS/JS。首页通过 games.json 配置动态渲染游戏卡片，使用 localStorage 存储高分和设置。

**Tech Stack:** 原生 HTML5 + CSS3 + JavaScript (ES6+) + Canvas 2D + Jest (测试框架)

---

## 测试策略

| 模块 | 测试方式 | 原因 |
|------|----------|------|
| Storage 模块 | Jest 单元测试 | 纯逻辑，易测试 |
| Sound 模块 | Jest + Mock | 涉及 Audio API |
| 游戏核心逻辑 | Jest 单元测试 | 算法可单独测试 |
| DOM 渲染 | 手动验证 | 浏览器环境 |
| Canvas 渲染 | 手动验证 | 视觉输出 |

---

## 文件结构

```
Game-joy/
├── index.html                    # 首页
├── css/
│   ├── common.css                # 公共样式
│   └── home.css                  # 首页样式
├── js/
│   ├── common.js                 # 公共模块（Storage、Sound）
│   └── home.js                   # 首页逻辑
├── tests/
│   ├── storage.test.js           # Storage 模块测试
│   ├── sound.test.js             # Sound 模块测试
│   └── games/                    # 游戏逻辑测试
│       ├── minesweeper.test.js
│       ├── t2048.test.js
│       ├── dino.test.js
│       ├── gomoku.test.js
│       ├── tetris.test.js
│       └── pinball.test.js
├── assets/
│   └── sounds/                   # 公共音效
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

## Phase 1: 测试环境搭建

### Task 1: 初始化测试环境

**Files:**
- Create: `package.json`
- Create: `jest.config.js`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "game-joy",
  "version": "1.0.0",
  "description": "免费在线小游戏网站",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

- [ ] **Step 2: 创建 Jest 配置**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['js/**/*.js', 'games/**/*.js'],
  moduleDirectories: ['node_modules', '.'],
};
```

- [ ] **Step 3: 安装依赖**

```bash
npm install
```

- [ ] **Step 4: 验证测试环境**

```bash
npm test
```

预期输出：`No tests found`（正常，尚未创建测试）

- [ ] **Step 5: 提交**

```bash
git add package.json jest.config.js package-lock.json
git commit -m "chore: 初始化 Jest 测试环境"
```

---

## Phase 2: 公共模块 (TDD)

### Task 2: Storage 模块 - TDD

**Files:**
- Create: `tests/storage.test.js`
- Create: `js/common.js`

- [ ] **Step 1: RED - 写失败测试 - getHighScore**

```javascript
// tests/storage.test.js

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getHighScore', () => {
    test('returns 0 when no high score exists', () => {
      expect(Storage.getHighScore('test-game')).toBe(0);
    });

    test('returns stored high score', () => {
      localStorage.setItem('gamejoy_highscore_test-game', '100');
      expect(Storage.getHighScore('test-game')).toBe(100);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

预期：`ReferenceError: Storage is not defined`

- [ ] **Step 3: GREEN - 写最小实现**

```javascript
// js/common.js

const Storage = {
  getHighScore(gameId) {
    const score = localStorage.getItem(`gamejoy_highscore_${gameId}`);
    return score ? parseInt(score, 10) : 0;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Storage };
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

预期：`PASS`

- [ ] **Step 5: RED - 写失败测试 - setHighScore**

```javascript
// 添加到 tests/storage.test.js

describe('setHighScore', () => {
  test('stores high score in localStorage', () => {
    Storage.setHighScore('test-game', 200);
    expect(localStorage.getItem('gamejoy_highscore_test-game')).toBe('200');
  });
});
```

- [ ] **Step 6: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

预期：`TypeError: Storage.setHighScore is not a function`

- [ ] **Step 7: GREEN - 实现setHighScore**

```javascript
// 添加到 js/common.js Storage 对象

setHighScore(gameId, score) {
  localStorage.setItem(`gamejoy_highscore_${gameId}`, score.toString());
},
```

- [ ] **Step 8: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 9: RED - 写失败测试 - getHistory**

```javascript
// 添加到 tests/storage.test.js

describe('getHistory', () => {
  test('returns empty array when no history exists', () => {
    expect(Storage.getHistory('test-game')).toEqual([]);
  });

  test('returns stored history', () => {
    const history = [{ score: 100, date: '2024-01-01' }];
    localStorage.setItem('gamejoy_history_test-game', JSON.stringify(history));
    expect(Storage.getHistory('test-game')).toEqual(history);
  });
});
```

- [ ] **Step 10: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 11: GREEN - 实现getHistory**

```javascript
// 添加到 js/common.js Storage 对象

getHistory(gameId) {
  const history = localStorage.getItem(`gamejoy_history_${gameId}`);
  return history ? JSON.parse(history) : [];
},
```

- [ ] **Step 12: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 13: RED - 写失败测试 - addRecord**

```javascript
// 添加到 tests/storage.test.js

describe('addRecord', () => {
  test('adds record and returns top 5 sorted by score', () => {
    Storage.addRecord('test-game', 100);
    Storage.addRecord('test-game', 300);
    Storage.addRecord('test-game', 200);
    
    const history = Storage.getHistory('test-game');
    expect(history).toHaveLength(3);
    expect(history[0].score).toBe(300);
    expect(history[1].score).toBe(200);
    expect(history[2].score).toBe(100);
  });

  test('keeps only top 5 records', () => {
    for (let i = 1; i <= 7; i++) {
      Storage.addRecord('test-game', i * 10);
    }
    
    const history = Storage.getHistory('test-game');
    expect(history).toHaveLength(5);
    expect(history[0].score).toBe(70);
  });
});
```

- [ ] **Step 14: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 15: GREEN - 实现addRecord**

```javascript
// 添加到 js/common.js Storage 对象

addRecord(gameId, score) {
  const history = this.getHistory(gameId);
  history.push({ score, date: new Date().toISOString() });
  history.sort((a, b) => b.score - a.score);
  const top5 = history.slice(0, 5);
  localStorage.setItem(`gamejoy_history_${gameId}`, JSON.stringify(top5));
  return top5;
},
```

- [ ] **Step 16: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 17: RED - 写失败测试 - getSettings**

```javascript
// 添加到 tests/storage.test.js

describe('getSettings', () => {
  test('returns default settings when none exist', () => {
    expect(Storage.getSettings()).toEqual({ soundEnabled: false });
  });

  test('returns stored settings', () => {
    localStorage.setItem('gamejoy_settings', JSON.stringify({ soundEnabled: true }));
    expect(Storage.getSettings()).toEqual({ soundEnabled: true });
  });
});
```

- [ ] **Step 18: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 19: GREEN - 实现getSettings和setSettings**

```javascript
// 添加到 js/common.js Storage 对象

getSettings() {
  const settings = localStorage.getItem('gamejoy_settings');
  return settings ? JSON.parse(settings) : { soundEnabled: false };
},

setSettings(settings) {
  localStorage.setItem('gamejoy_settings', JSON.stringify(settings));
},
```

- [ ] **Step 20: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 21: RED - 写失败测试 - playCount**

```javascript
// 添加到 tests/storage.test.js

describe('playCount', () => {
  test('getPlayCount returns 0 when no count exists', () => {
    expect(Storage.getPlayCount('test-game')).toBe(0);
  });

  test('incrementPlayCount increments and returns count', () => {
    expect(Storage.incrementPlayCount('test-game')).toBe(1);
    expect(Storage.incrementPlayCount('test-game')).toBe(2);
    expect(Storage.getPlayCount('test-game')).toBe(2);
  });
});
```

- [ ] **Step 22: 运行测试确认失败**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 23: GREEN - 实现playCount方法**

```javascript
// 添加到 js/common.js Storage 对象

getPlayCount(gameId) {
  const count = localStorage.getItem(`gamejoy_playcount_${gameId}`);
  return count ? parseInt(count, 10) : 0;
},

incrementPlayCount(gameId) {
  const count = this.getPlayCount(gameId) + 1;
  localStorage.setItem(`gamejoy_playcount_${gameId}`, count.toString());
  return count;
}
```

- [ ] **Step 24: 运行测试确认通过**

```bash
npm test tests/storage.test.js
```

- [ ] **Step 25: 提交**

```bash
git add js/common.js tests/storage.test.js
git commit -m "feat: 实现 Storage 模块 (TDD)"
```

---

### Task 3: Sound 模块 - TDD

**Files:**
- Create: `tests/sound.test.js`
- Modify: `js/common.js`

- [ ] **Step 1: RED - 写失败测试 - init和isEnabled**

```javascript
// tests/sound.test.js

describe('Sound', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('init', () => {
    test('initializes with sound disabled by default', () => {
      Sound.init();
      expect(Sound.isEnabled()).toBe(false);
    });

    test('initializes with sound enabled if stored', () => {
      localStorage.setItem('gamejoy_settings', JSON.stringify({ soundEnabled: true }));
      Sound.init();
      expect(Sound.isEnabled()).toBe(true);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 3: GREEN - 实现Sound模块**

```javascript
// 添加到 js/common.js

const Sound = {
  sounds: {},
  enabled: false,

  init() {
    this.enabled = Storage.getSettings().soundEnabled;
    if (typeof Audio !== 'undefined') {
      this.sounds = {
        click: new Audio('assets/sounds/click.mp3'),
        win: new Audio('assets/sounds/win.mp3'),
        lose: new Audio('assets/sounds/lose.mp3'),
        move: new Audio('assets/sounds/move.mp3')
      };
      Object.values(this.sounds).forEach(audio => {
        audio.volume = 0.3;
      });
    }
  },

  isEnabled() {
    return this.enabled;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Storage, Sound };
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 5: RED - 写失败测试 - toggle**

```javascript
// 添加到 tests/sound.test.js

describe('toggle', () => {
  test('toggles sound on and off', () => {
    Sound.init();
    expect(Sound.isEnabled()).toBe(false);
    
    const result1 = Sound.toggle();
    expect(result1).toBe(true);
    expect(Sound.isEnabled()).toBe(true);
    
    const result2 = Sound.toggle();
    expect(result2).toBe(false);
    expect(Sound.isEnabled()).toBe(false);
  });

  test('persists sound setting', () => {
    Sound.init();
    Sound.toggle();
    
    const settings = JSON.parse(localStorage.getItem('gamejoy_settings'));
    expect(settings.soundEnabled).toBe(true);
  });
});
```

- [ ] **Step 6: 运行测试确认失败**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 7: GREEN - 实现toggle**

```javascript
// 添加到 js/common.js Sound 对象

toggle() {
  this.enabled = !this.enabled;
  Storage.setSettings({ soundEnabled: this.enabled });
  return this.enabled;
},
```

- [ ] **Step 8: 运行测试确认通过**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 9: RED - 写失败测试 - play**

```javascript
// 添加到 tests/sound.test.js

describe('play', () => {
  test('does nothing when sound is disabled', () => {
    Sound.init();
    Sound.play('click');
    // 无错误即通过
  });

  test('plays sound when enabled', () => {
    Sound.init();
    Sound.toggle();
    Sound.play('click');
    // 无错误即通过
  });
});
```

- [ ] **Step 10: 运行测试确认失败**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 11: GREEN - 实现play**

```javascript
// 添加到 js/common.js Sound 对象

play(name) {
  if (!this.enabled || !this.sounds[name]) return;
  this.sounds[name].currentTime = 0;
  this.sounds[name].play().catch(() => {});
}
```

- [ ] **Step 12: 运行测试确认通过**

```bash
npm test tests/sound.test.js
```

- [ ] **Step 13: 提交**

```bash
git add js/common.js tests/sound.test.js
git commit -m "feat: 实现 Sound 模块 (TDD)"
```

---

## Phase 3: 样式和首页

### Task 4: 创建公共样式文件

**Files:**
- Create: `css/common.css`

- [ ] **Step 1: 创建 CSS 变量和重置样式**

```css
/* css/common.css */

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

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

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

.tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--bg-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

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

- [ ] **Step 2: 提交**

```bash
git add css/common.css
git commit -m "feat: 添加公共样式文件"
```

---

### Task 5: 创建首页样式文件

**Files:**
- Create: `css/home.css`

- [ ] **Step 1: 创建首页布局和组件样式**

```css
/* css/home.css */

.layout {
  display: flex;
  min-height: 100vh;
}

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

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 20px;
}

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

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

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

- [ ] **Step 2: 提交**

```bash
git add css/home.css
git commit -m "feat: 添加首页样式文件"
```

---

### Task 6: 创建游戏配置文件

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

- [ ] **Step 2: 提交**

```bash
git add data/games.json
git commit -m "feat: 添加游戏配置文件"
```

---

### Task 7: 创建首页 JavaScript

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

- [ ] **Step 2: 提交**

```bash
git add js/home.js
git commit -m "feat: 添加首页 JavaScript 逻辑"
```

---

### Task 8: 创建首页 HTML

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
    <aside class="sidebar">
      <div class="sidebar-logo">🎮 Game-Joy</div>
      <nav class="sidebar-nav" id="sidebar-nav"></nav>
      <div class="sidebar-divider"></div>
      <div class="sidebar-footer">
        <a class="sidebar-footer-item" id="sound-toggle">🔇 音效</a>
        <a class="sidebar-footer-item" href="https://github.com/Closerdoor/game-joy" target="_blank">关于</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="header">
        <h1 class="header-title">欢迎来到 Game-Joy</h1>
      </header>

      <section class="section">
        <h2 class="section-title">🔥 热门推荐</h2>
        <div class="games-grid" id="popular-games"></div>
      </section>

      <section class="section">
        <h2 class="section-title">🎮 全部游戏</h2>
        <div class="games-grid" id="all-games"></div>
      </section>
    </main>
  </div>

  <script src="js/common.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
```

- [ ] **Step 2: 手动验证首页**

在浏览器中打开 `index.html`，验证：
- 侧边栏显示正常
- 游戏卡片渲染正确
- 分类切换工作
- 音效开关工作

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: 添加首页 HTML"
```

---

## Phase 4: 游戏页模板

### Task 9: 创建游戏页公共样式

**Files:**
- Create: `css/game.css`

- [ ] **Step 1: 创建游戏页样式**

```css
/* css/game.css */

.game-layout {
  min-height: 100vh;
  background-color: var(--bg-color);
}

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
```

- [ ] **Step 2: 提交**

```bash
git add css/game.css
git commit -m "feat: 添加游戏页公共样式"
```

---

## Phase 5: 游戏实现 (TDD)

### Task 10: 扫雷游戏 - TDD

**Files:**
- Create: `tests/games/minesweeper.test.js`
- Create: `games/minesweeper/index.html`
- Create: `games/minesweeper/game.js`
- Create: `games/minesweeper/style.css`

- [ ] **Step 1: 创建游戏目录**

```bash
mkdir -p games/minesweeper tests/games
```

- [ ] **Step 2: RED - 写失败测试 - 初始化棋盘**

```javascript
// tests/games/minesweeper.test.js

describe('Minesweeper', () => {
  describe('initBoard', () => {
    test('creates board with correct dimensions', () => {
      const board = initBoard(9, 9);
      expect(board.length).toBe(9);
      expect(board[0].length).toBe(9);
    });

    test('each cell is initialized correctly', () => {
      const board = initBoard(9, 9);
      expect(board[0][0]).toEqual({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        count: 0
      });
    });
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 4: GREEN - 实现initBoard**

```javascript
// games/minesweeper/game.js (核心逻辑部分)

function initBoard(rows, cols) {
  const board = [];
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
  return board;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBoard };
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 6: RED - 写失败测试 - 放置地雷**

```javascript
// 添加到 tests/games/minesweeper.test.js

describe('placeMines', () => {
  test('places correct number of mines', () => {
    const board = initBoard(9, 9);
    placeMines(board, 10, 0, 0);
    
    let mineCount = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].isMine) mineCount++;
      }
    }
    expect(mineCount).toBe(10);
  });

  test('excludes specified cell from mines', () => {
    const board = initBoard(9, 9);
    placeMines(board, 10, 4, 4);
    expect(board[4][4].isMine).toBe(false);
  });
});
```

- [ ] **Step 7: 运行测试确认失败**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 8: GREEN - 实现placeMines**

```javascript
// 添加到 games/minesweeper/game.js

function placeMines(board, mines, excludeRow, excludeCol) {
  const rows = board.length;
  const cols = board[0].length;
  let placed = 0;
  
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    if (!board[r][c].isMine && !(r === excludeRow && c === excludeCol)) {
      board[r][c].isMine = true;
      placed++;
    }
  }
  
  // 计算每个格子周围的地雷数
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        board[r][c].count = countAdjacentMines(board, r, c);
      }
    }
  }
}

function countAdjacentMines(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
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

// 更新 module.exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBoard, placeMines, countAdjacentMines };
}
```

- [ ] **Step 9: 运行测试确认通过**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 10: RED - 写失败测试 - 揭开格子**

```javascript
// 添加到 tests/games/minesweeper.test.js

describe('reveal', () => {
  test('reveals cell', () => {
    const board = initBoard(3, 3);
    reveal(board, 1, 1);
    expect(board[1][1].isRevealed).toBe(true);
  });

  test('does not reveal flagged cell', () => {
    const board = initBoard(3, 3);
    board[1][1].isFlagged = true;
    reveal(board, 1, 1);
    expect(board[1][1].isRevealed).toBe(false);
  });

  test('reveals adjacent cells when count is 0', () => {
    const board = initBoard(3, 3);
    reveal(board, 1, 1);
    // 中心是空的，应该展开周围的格子
    expect(board[0][0].isRevealed).toBe(true);
    expect(board[2][2].isRevealed).toBe(true);
  });
});
```

- [ ] **Step 11: 运行测试确认失败**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 12: GREEN - 实现reveal**

```javascript
// 添加到 games/minesweeper/game.js

function reveal(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
  
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  
  const cell = board[row][col];
  if (cell.isRevealed || cell.isFlagged) return;
  
  cell.isRevealed = true;
  
  if (cell.count === 0 && !cell.isMine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        reveal(board, row + dr, col + dc);
      }
    }
  }
}

// 更新 module.exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBoard, placeMines, countAdjacentMines, reveal };
}
```

- [ ] **Step 13: 运行测试确认通过**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 14: RED - 写失败测试 - 胜利检测**

```javascript
// 添加到 tests/games/minesweeper.test.js

describe('checkWin', () => {
  test('returns true when all non-mine cells are revealed', () => {
    const board = initBoard(2, 2);
    board[0][0].isMine = true;
    board[0][1].isRevealed = true;
    board[1][0].isRevealed = true;
    board[1][1].isRevealed = true;
    
    expect(checkWin(board, 1)).toBe(true);
  });

  test('returns false when cells remain hidden', () => {
    const board = initBoard(2, 2);
    board[0][0].isMine = true;
    board[0][1].isRevealed = true;
    
    expect(checkWin(board, 1)).toBe(false);
  });
});
```

- [ ] **Step 15: 运行测试确认失败**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 16: GREEN - 实现checkWin**

```javascript
// 添加到 games/minesweeper/game.js

function checkWin(board, mines) {
  const rows = board.length;
  const cols = board[0].length;
  let revealedCount = 0;
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isRevealed && !board[r][c].isMine) {
        revealedCount++;
      }
    }
  }
  
  return revealedCount === rows * cols - mines;
}

// 更新 module.exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBoard, placeMines, countAdjacentMines, reveal, checkWin };
}
```

- [ ] **Step 17: 运行测试确认通过**

```bash
npm test tests/games/minesweeper.test.js
```

- [ ] **Step 18: 创建完整游戏文件**

创建 `games/minesweeper/index.html`、`games/minesweeper/style.css` 和完整的 `games/minesweeper/game.js`（包含 DOM 渲染逻辑）。

- [ ] **Step 19: 手动验证游戏**

在浏览器中打开游戏，验证：
- 棋盘正确渲染
- 点击揭开格子
- 右键标记地雷
- 胜利/失败检测

- [ ] **Step 20: 提交**

```bash
git add games/minesweeper/ tests/games/minesweeper.test.js
git commit -m "feat: 实现扫雷游戏 (TDD)"
```

---

### Task 11-15: 其他游戏 (TDD)

由于篇幅限制，以下游戏遵循相同的 TDD 流程：

**Task 11: 2048 游戏**
- 测试：初始化网格、滑动合并、生成新方块、游戏结束检测
- 实现：核心逻辑 + DOM 渲染

**Task 12: Google 小恐龙游戏**
- 测试：跳跃物理、障碍物生成、碰撞检测
- 实现：核心逻辑 + Canvas 渲染

**Task 13: 五子棋游戏（含 AI）**
- 测试：落子、胜负判断、AI 评分函数
- 实现：核心逻辑 + AI + Canvas 渲染

**Task 14: 俄罗斯方块游戏**
- 测试：方块生成、旋转、碰撞检测、消行
- 实现：核心逻辑 + Canvas 渲染

**Task 15: 三维弹球游戏**
- 测试：球物理、挡板碰撞、障碍物碰撞
- 实现：核心逻辑 + Canvas 渲染

每个游戏都遵循：
1. RED - 写失败测试
2. 运行测试确认失败
3. GREEN - 写最小实现
4. 运行测试确认通过
5. 重复直到核心逻辑完成
6. 创建完整游戏文件
7. 手动验证
8. 提交

---

## Phase 6: 最终提交

### Task 16: 运行所有测试

- [ ] **Step 1: 运行完整测试套件**

```bash
npm test
```

预期：所有测试通过

- [ ] **Step 2: 修复失败的测试（如有）**

- [ ] **Step 3: 推送到 GitHub**

```bash
git push origin main
```

---

## TDD 验证清单

在标记任务完成前，确认：

- [ ] 每个新函数/方法都有测试
- [ ] 每个测试都先失败过
- [ ] 每个测试失败原因是功能缺失（不是拼写错误）
- [ ] 写了最小代码使测试通过
- [ ] 所有测试通过
- [ ] 测试覆盖边界情况和错误情况
