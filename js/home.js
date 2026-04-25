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
