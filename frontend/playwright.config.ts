import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.GITHUB_ACTIONS,
  retries: process.env.GITHUB_ACTIONS ? 2 : 0,
  workers: process.env.GITHUB_ACTIONS ? 1 : undefined,
  reporter: process.env.GITHUB_ACTIONS ? 'github' : 'list',
  use: {
    // TODO add port from .env
    baseURL: 'http://localhost:12345',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
