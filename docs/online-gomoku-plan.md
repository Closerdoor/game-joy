# 五子棋联机对战功能实现计划

> 创建时间：2026-04-25
> 目标：实现局域网联机五子棋对战，支持房间系统

## 一、技术选型

| 组件 | 技术 | 说明 |
|------|------|------|
| 后端框架 | Fastify | 高性能 Node.js 框架，内置 JSON 序列化优化 |
| 实时通信 | @fastify/websocket | WebSocket 支持，双向实时通信 |
| 静态服务 | @fastify/static | 托管游戏静态文件 |
| 房间存储 | 内存 Map | 简单高效，重启清空 |
| 端口检测 | 自动检测 | 支持自定义端口，避免冲突 |

## 二、系统架构

```
┌─────────────────┐                      ┌─────────────────────────────┐
│  玩家A (浏览器)  │◄──── WebSocket ────►│                             │
│  黑棋           │                      │     Fastify Server          │
└─────────────────┘                      │     (本机运行)              │
                                         │                             │
┌─────────────────┐                      │  ┌─────────────────────┐    │
│  玩家B (浏览器)  │◄──── WebSocket ────►│  │   RoomManager       │    │
│  白棋           │                      │  │   - 房间创建/加入    │    │
└─────────────────┘                      │  │   - 玩家管理        │    │
                                         │  │   - 游戏状态        │    │
┌─────────────────┐                      │  └─────────────────────┘    │
│  其他用户        │◄──── HTTP ─────────►│                             │
│  (浏览网站)      │                      │  ┌─────────────────────┐    │
└─────────────────┘                      │  │   Static Files      │    │
                                         │  │   (游戏网站)        │    │
                                         │  └─────────────────────┘    │
                                         └─────────────────────────────┘
```

## 三、文件结构

```
Game-joy/
├── server/                       # 新增：后端服务
│   ├── index.js                 # Fastify 入口，静态文件服务，WebSocket
│   ├── websocket.js             # WebSocket 连接处理
│   ├── roomManager.js           # 房间管理器
│   ├── package.json             # 依赖声明
│   └── README.md                # 服务启动说明
├── games/
│   └── gomoku/                  # 修改：五子棋游戏
│       ├── index.html           # 添加联机模式入口
│       ├── game.js              # 核心逻辑（保持不变）
│       ├── ui.js                # UI 逻辑（添加联机判断）
│       ├── online.js            # 新增：联机模块
│       └── style.css            # 添加联机相关样式
├── docs/
│   └── online-gomoku-plan.md    # 本文档
└── ...其他文件
```

## 四、数据结构设计

### 4.1 房间结构

```javascript
const room = {
  id: 'ABC123',              // 6位房间ID（大写字母+数字）
  host: {
    id: 'ws-player-001',     // WebSocket 连接ID
    name: '玩家1',           // 显示名称
    ws: WebSocket,           // 连接实例（不序列化）
    ready: true              // 准备状态
  },
  guest: {
    id: 'ws-player-002',
    name: '玩家2',
    ws: WebSocket,
    ready: true
  } | null,                  // 未加入时为 null
  board: [...],              // 15x15 棋盘状态
  currentTurn: 1,            // 当前回合（1=黑/房主，2=白/加入者）
  status: 'waiting',         // waiting | playing | finished
  winner: null,              // 胜者（1 或 2），未结束为 null
  createdAt: Date.now()      // 创建时间
};
```

### 4.2 WebSocket 消息协议

**客户端 → 服务端**

```javascript
// 创建房间
{ type: 'CREATE_ROOM', payload: { playerName: '玩家1' } }

// 加入房间
{ type: 'JOIN_ROOM', payload: { roomId: 'ABC123', playerName: '玩家2' } }

// 落子
{ type: 'PLACE_STONE', payload: { roomId: 'ABC123', row: 7, col: 7 } }

// 离开房间
{ type: 'LEAVE_ROOM', payload: { roomId: 'ABC123' } }

// 获取房间列表
{ type: 'GET_ROOMS' }

// 心跳
{ type: 'PING' }
```

**服务端 → 客户端**

```javascript
// 房间创建成功
{ type: 'ROOM_CREATED', payload: { roomId: 'ABC123', role: 'host' } }

// 玩家加入
{ type: 'PLAYER_JOINED', payload: { playerName: '玩家2' } }

// 游戏开始
{ type: 'GAME_START', payload: { board: [...], yourTurn: true } }

// 对手落子
{ type: 'OPPONENT_MOVE', payload: { row: 7, col: 7, board: [...] } }

// 游戏结束
{ type: 'GAME_OVER', payload: { winner: 1, isWin: false } }

// 玩家离开
{ type: 'PLAYER_LEFT', payload: { reason: 'disconnect' } }

// 错误
{ type: 'ERROR', payload: { code: 'ROOM_NOT_FOUND', message: '房间不存在' } }

// 房间列表
{ type: 'ROOMS_LIST', payload: { rooms: [...] } }

// 心跳响应
{ type: 'PONG' }
```

## 五、核心逻辑

### 5.1 房间管理器 (roomManager.js)

```javascript
class RoomManager {
  constructor() {
    this.rooms = new Map();      // roomId -> Room
    this.players = new Map();    // playerId -> roomId
  }

  // 生成6位房间ID
  generateRoomId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id;
    do {
      id = Array.from({ length: 6 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    } while (this.rooms.has(id));
    return id;
  }

  // 创建房间
  createRoom(hostWs, playerName) {
    const roomId = this.generateRoomId();
    const room = {
      id: roomId,
      host: { id: this.generatePlayerId(), name: playerName, ws: hostWs, ready: true },
      guest: null,
      board: this.initBoard(),
      currentTurn: 1,
      status: 'waiting',
      winner: null,
      createdAt: Date.now()
    };
    this.rooms.set(roomId, room);
    this.players.set(room.host.id, roomId);
    return { roomId, playerId: room.host.id };
  }

  // 加入房间
  joinRoom(roomId, guestWs, playerName) {
    const room = this.rooms.get(roomId);
    if (!room) return { error: 'ROOM_NOT_FOUND' };
    if (room.guest) return { error: 'ROOM_FULL' };
    
    const playerId = this.generatePlayerId();
    room.guest = { id: playerId, name: playerName, ws: guestWs, ready: true };
    this.players.set(playerId, roomId);
    
    return { playerId, room };
  }

  // 落子
  placeStone(roomId, playerId, row, col) {
    const room = this.rooms.get(roomId);
    // 验证：房间存在、游戏进行中、轮到该玩家、位置为空
    // 更新棋盘、检查胜负、切换回合
    // 返回更新后的状态
  }

  // 玩家断开连接
  disconnect(playerId) {
    const roomId = this.players.get(playerId);
    // 通知对手、清理房间
  }

  // 获取房间列表（用于大厅显示）
  getRoomList() {
    return Array.from(this.rooms.values())
      .filter(r => r.status === 'waiting')
      .map(r => ({ id: r.id, hostName: r.host.name, createdAt: r.createdAt }));
  }
}
```

### 5.2 WebSocket 处理 (websocket.js)

```javascript
async function handleConnection(ws, req, roomManager) {
  const playerId = generatePlayerId();
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    
    switch (msg.type) {
      case 'CREATE_ROOM':
        const { roomId } = roomManager.createRoom(ws, msg.payload.playerName);
        ws.send(JSON.stringify({ type: 'ROOM_CREATED', payload: { roomId, role: 'host' } }));
        break;
        
      case 'JOIN_ROOM':
        const result = roomManager.joinRoom(msg.payload.roomId, ws, msg.payload.playerName);
        if (result.error) {
          ws.send(JSON.stringify({ type: 'ERROR', payload: { code: result.error } }));
        } else {
          // 通知双方游戏开始
          notifyGameStart(result.room);
        }
        break;
        
      case 'PLACE_STONE':
        const state = roomManager.placeStone(
          msg.payload.roomId, 
          playerId, 
          msg.payload.row, 
          msg.payload.col
        );
        broadcastMove(state);
        break;
        
      // ... 其他消息类型
    }
  });
  
  ws.on('close', () => {
    roomManager.disconnect(playerId);
  });
}
```

### 5.3 前端联机模块 (online.js)

```javascript
class OnlineGomoku {
  constructor(serverUrl) {
    this.ws = null;
    this.roomId = null;
    this.role = null;  // 'host' | 'guest'
    this.onMessage = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.serverUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (e) => this.handleMessage(JSON.parse(e.data));
    });
  }

  createRoom(playerName) {
    this.send({ type: 'CREATE_ROOM', payload: { playerName } });
  }

  joinRoom(roomId, playerName) {
    this.send({ type: 'JOIN_ROOM', payload: { roomId, playerName } });
  }

  placeStone(row, col) {
    this.send({ type: 'PLACE_STONE', payload: { roomId: this.roomId, row, col } });
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'ROOM_CREATED':
        this.roomId = msg.payload.roomId;
        this.role = msg.payload.role;
        break;
      case 'OPPONENT_MOVE':
        // 更新棋盘显示
        break;
      case 'GAME_OVER':
        // 显示结果
        break;
      // ...
    }
    if (this.onMessage) this.onMessage(msg);
  }

  send(msg) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }
}
```

## 六、UI 改造

### 6.1 五子棋首页 (index.html)

```html
<!-- 添加模式选择 -->
<div class="mode-selector">
  <button class="btn" onclick="startLocal()">本地对战</button>
  <button class="btn" onclick="startOnline()">联机对战</button>
</div>

<!-- 联机面板 -->
<div class="online-panel" id="online-panel" style="display: none;">
  <div class="online-option">
    <h3>创建房间</h3>
    <input type="text" id="host-name" placeholder="你的昵称">
    <button class="btn" onclick="createRoom()">创建</button>
  </div>
  
  <div class="online-option">
    <h3>加入房间</h3>
    <input type="text" id="room-id" placeholder="房间ID">
    <input type="text" id="guest-name" placeholder="你的昵称">
    <button class="btn" onclick="joinRoom()">加入</button>
  </div>
</div>

<!-- 房间信息显示 -->
<div class="room-info" id="room-info" style="display: none;">
  <div>房间ID: <span id="display-room-id"></span></div>
  <div>对手: <span id="opponent-name">等待中...</span></div>
  <button class="btn" onclick="copyRoomId()">复制房间ID</button>
</div>
```

### 6.2 样式补充 (style.css)

```css
.mode-selector {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}

.online-panel {
  background: var(--card-bg);
  padding: 24px;
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.online-option {
  margin-bottom: 20px;
}

.online-option h3 {
  margin-bottom: 12px;
}

.online-option input {
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
}

.room-info {
  background: var(--primary-color);
  color: white;
  padding: 16px;
  border-radius: var(--radius);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.connected { background: var(--success-color); }
.status-indicator.disconnected { background: var(--error-color); }
```

## 七、启动流程

### 7.1 服务端启动 (server/index.js)

```javascript
const fastify = require('fastify')({ logger: true });
const path = require('path');
const port = process.env.PORT || 3000;

// 注册插件
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '..'),
  prefix: '/'
});

fastify.register(require('@fastify/websocket'));

// WebSocket 路由
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    handleWebSocket(connection.socket, req);
  });
});

// 启动服务
const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    
    // 显示访问地址
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }
    
    console.log('\n🎮 Game-Joy 服务器已启动!\n');
    console.log('本地访问:');
    console.log(`  http://localhost:${port}\n`);
    console.log('局域网访问:');
    addresses.forEach(addr => {
      console.log(`  http://${addr}:${port}`);
    });
    console.log('\n按 Ctrl+C 停止服务\n');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

### 7.2 启动命令

```bash
# 进入服务目录
cd server

# 安装依赖
npm install

# 启动（默认端口 3000）
node index.js

# 或指定端口
PORT=8080 node index.js

# 输出示例
# 🎮 Game-Joy 服务器已启动!
#
# 本地访问:
#   http://localhost:3000
#
# 局域网访问:
#   http://192.168.1.100:3000
#   http://192.168.56.1:3000
```

## 八、游戏流程

### 8.1 创建房间流程

```
玩家A                          服务器                          玩家B
  │                              │                              │
  ├─ 点击"创建房间"─────────────►│                              │
  │                              ├─ 生成房间ID: ABC123          │
  │                              ├─ 创建房间对象                 │
  │◄─ 返回房间ID + 房主角色──────┤                              │
  │                              │                              │
  ├─ 显示房间ID: ABC123          │                              │
  ├─ 等待对手加入...             │                              │
  │                              │                              │
  │                              │◄─ 输入房间ID，点击加入───────┤
  │                              ├─ 验证房间存在                 │
  │                              ├─ 设置为 guest                 │
  │◄─ 广播: 玩家B加入────────────┼─────────────────────────────►│
  │                              │                              │
  ├─ 显示对手: 玩家B             │                              │
  │                              ├─ 初始化棋盘                   │
  │◄─ 广播: 游戏开始─────────────┼─────────────────────────────►│
  │                              │                              │
  ├─ 黑棋先行，轮到你            │                              ├─ 等待对手落子
```

### 8.2 对战流程

```
玩家A (黑棋)                    服务器                          玩家B (白棋)
  │                              │                              │
  ├─ 落子 (7,7)─────────────────►│                              │
  │                              ├─ 验证合法                     │
  │                              ├─ 更新棋盘                     │
  │                              ├─ 检查胜负（未结束）           │
  │◄─ 返回: 落子成功─────────────┼─────────────────────────────►│
  │                              │                              ├─ 显示对手落子
  │                              │                              ├─ 轮到你
  │                              │                              │
  │                              │◄─ 落子 (7,8)─────────────────┤
  │◄─ 广播: 对手落子─────────────┼──────────────────────────────┤
  ├─ 显示对手落子                │                              │
  ├─ 轮到你                      │                              │
  │                              │                              │
  ...                            ...                            ...
  │                              │                              │
  ├─ 落子获胜───────────────────►│                              │
  │                              ├─ 检测五连                     │
  │◄─ 广播: 游戏结束，你赢───────┼─────────────────────────────►│
  │                              │                              ├─ 显示: 你输了
```

## 九、错误处理

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| ROOM_NOT_FOUND | 房间不存在 | 提示用户检查房间ID |
| ROOM_FULL | 房间已满 | 提示用户选择其他房间 |
| NOT_YOUR_TURN | 不是你的回合 | 忽略操作 |
| INVALID_MOVE | 无效落子 | 提示位置已被占用 |
| PLAYER_DISCONNECT | 对手断开连接 | 提示对手已离开，可等待重连 |

## 十、安全考虑

1. **输入验证**
   - 房间ID 格式验证（6位字母数字）
   - 玩家名称长度限制（1-20字符）
   - 落子坐标范围检查（0-14）

2. **连接管理**
   - 心跳检测（30秒间隔）
   - 断线清理（60秒无响应断开）
   - 重复连接处理（踢掉旧连接）

3. **房间管理**
   - 房间过期（创建后1小时无人加入自动清理）
   - 最大房间数限制（100个）

## 十一、后续扩展

### 可能的增强功能

1. **观战功能**
   - 允许第三方加入房间观战
   - 实时同步棋盘状态

2. **聊天功能**
   - 玩家间实时聊天
   - 预设快捷消息

3. **战绩系统**
   - 记录胜负场次
   - 显示历史对局

4. **AI 托管**
   - 玩家断线时 AI 代打
   - 可选择 AI 难度

5. **匹配系统**
   - 快速匹配随机对手
   - 按段位匹配

## 十二、测试计划

### 单元测试

- [ ] RoomManager.createRoom() - 房间创建
- [ ] RoomManager.joinRoom() - 房间加入
- [ ] RoomManager.placeStone() - 落子逻辑
- [ ] RoomManager.checkWin() - 胜负判断
- [ ] RoomManager.disconnect() - 断线处理

### 集成测试

- [ ] WebSocket 连接建立
- [ ] 完整游戏流程（创建→加入→对战→结束）
- [ ] 异常处理（房间不存在、房间已满等）

### 手动测试

- [ ] 同机双浏览器测试
- [ ] 局域网双机测试
- [ ] 断线重连测试
- [ ] 并发多房间测试

## 十三、实现顺序

1. **Phase 1: 后端基础** (预计 2 小时)
   - [ ] 创建 server/ 目录结构
   - [ ] 实现 Fastify 服务器
   - [ ] 实现静态文件服务
   - [ ] 实现端口自动检测

2. **Phase 2: 房间管理** (预计 2 小时)
   - [ ] 实现 RoomManager 类
   - [ ] 实现房间创建/加入
   - [ ] 实现落子验证
   - [ ] 实现胜负判断

3. **Phase 3: WebSocket 通信** (预计 2 小时)
   - [ ] 实现 WebSocket 连接处理
   - [ ] 实现消息路由
   - [ ] 实现广播机制
   - [ ] 实现心跳检测

4. **Phase 4: 前端改造** (预计 2 小时)
   - [ ] 创建 online.js 模块
   - [ ] 修改 index.html 添加联机入口
   - [ ] 修改 ui.js 集成联机逻辑
   - [ ] 添加联机相关样式

5. **Phase 5: 测试验证** (预计 1 小时)
   - [ ] 本地单机测试
   - [ ] 局域网双机测试
   - [ ] 边界情况测试

---

**预计总工时：9 小时**
