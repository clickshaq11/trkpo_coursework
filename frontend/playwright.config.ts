import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.GITHUB_ACTIONS,
  retries: 0,
  workers: process.env.GITHUB_ACTIONS ? 1 : undefined,
  reporter: [[process.env.GITHUB_ACTIONS ? 'github' : 'list'],
    ['html', { outputDir: "playwright-report" }]],
  use: {
    baseURL: 'http://localhost:12345',
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
