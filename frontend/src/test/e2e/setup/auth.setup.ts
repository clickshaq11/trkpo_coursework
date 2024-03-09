import { test as setup } from '@playwright/test';

const firstFilePath = 'playwright/.auth/first.json';

const FIRST_LOGIN = 'user1234';
const FIRST_PASSWORD = 'password1234';

const secondFilePath = 'playwright/.auth/second.json';

const SECOND_LOGIN = 'user1234';
const SECOND_PASSWORD = '123125421542';

setup('authenticate as first user', async ({ page }) => {
  await page.goto('login');
  await page.getByLabel(/Логин/).fill(FIRST_LOGIN);
  await page.getByLabel(/Пароль/).fill(FIRST_PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.waitForURL('/');

  await page.context().storageState({ path: firstFilePath });
});



setup('authenticate as user', async ({ page }) => {
  await page.goto('login');
  await page.getByLabel(/Логин/).fill(SECOND_LOGIN);
  await page.getByLabel(/Пароль/).fill(SECOND_PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.waitForURL('/');

  await page.context().storageState({ path: secondFilePath });
});

export { FIRST_LOGIN, SECOND_LOGIN, firstFilePath, secondFilePath }
