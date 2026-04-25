module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['js/**/*.js', 'games/**/*.js'],
  moduleDirectories: ['node_modules', '.'],
};
