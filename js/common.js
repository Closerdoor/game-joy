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

export { Storage };