const { defineConfig, devices } = require('@playwright/test');

const PORT = Number(process.env.PORT) || 4173;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'tests/__report' }],
  ],
  outputDir: 'tests/__results',
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices['Desktop Chrome'],
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'node tools/static-server.js',
    url: `http://localhost:${PORT}/linen-works/index.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 20_000,
  },
});
