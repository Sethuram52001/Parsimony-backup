module.exports = {
  setupFilesAfterEnv: ['./tests/setup.js'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
};
