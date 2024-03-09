import { test, expect } from '@playwright/test';

// TODO this
test.describe('Other', () => {
  const CORRECT_LOGIN = 'user1234';
  const CORRECT_PASSWORD = 'password1234';

  test.beforeEach(async ({ page }) => {
    await page.goto('login');
    await page.getByLabel(/Логин/).fill(CORRECT_LOGIN);
    await page.getByLabel(/Пароль/).fill(CORRECT_PASSWORD);
    await page.getByRole('button', { name: 'Войти' }).click();
  });

  test.describe('Search', () => {
    test('should display correct search results', async ({page}) => {
      const loginToSearch = 'user1234'

      await page.goto('/')

      await page.locator('#search-by-login').fill(loginToSearch)
      await page.locator('#search-button').click()

      const login1 = 'user12345'
      const shortInfo1 = 'short'

      // TODO check for all search results
      await expect(page.getByText(login1)).toBeVisible()
      await expect(page.getByText(shortInfo1)).toBeVisible()
    })
  })

  test('should correctly redirect to user profile with that login', async ({page}) => {
    const loginToSearch = 'user1234'

    await page.goto('/')

    await page.locator('#search-by-login').fill(loginToSearch)
    await page.locator('#search-button').click()

    // TODO check for correct logins
    await page.getByText(/user12345/).click()

    // TODO check for profile id
    expect(page.url()).toBe('/profile/2')
  })
})


