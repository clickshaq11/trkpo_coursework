import { test, expect } from '@playwright/test';
import { firstFilePath, setUpUsers } from '@/test/e2e/setup/auth.setup';

test.describe('Other', () => {
  test.use({ storageState: firstFilePath });

  test.describe('Search', () => {
    test('should display correct search results', async ({ page }) => {
      await setUpUsers();
      const loginToSearch = 'log';

      await page.goto('/', { waitUntil: 'networkidle' });

      await page.locator('#search-by-login').fill(loginToSearch);

      await new Promise(res => setTimeout(res, 200));

      await page.locator('#search-button').click();

      const login1 = 'login2222';
      const shortInfo1 = 'info';

      const login2 = 'logout111';
      const shortInfo2 = 'logoutInfo';

      await expect(page.getByText(login1, {exact: true})).toBeVisible();
      await expect(page.getByText(shortInfo1, {exact: true})).toBeVisible();

      await expect(page.getByText(login2, {exact: true})).toBeVisible();
      await expect(page.getByText(shortInfo2, {exact: true})).toBeVisible();
    });
  });

  test('should correctly redirect to user profile with that login', async ({ page }) => {
    await setUpUsers();
    const loginToSearch = 'login';

    await page.goto('/', { waitUntil: 'networkidle' });

    await page.locator('#search-by-login').fill(loginToSearch);

    await new Promise(res => setTimeout(res, 200));

    await page.locator('#search-button').click();

    await page.getByText(/login2222/).click();
    expect(page.url()).toContain('/profiles/2');
  });
});

