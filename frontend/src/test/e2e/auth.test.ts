import { test, expect, BrowserContext } from '@playwright/test';
import { resetDb, setUpUsers } from '@/test/e2e/setup/auth.setup';
const hasToken = (storage: Awaited<ReturnType<BrowserContext['storageState']>> ,
                  baseUrl: string | undefined): boolean => {
  return storage.origins
    .find(origin => origin.origin === baseUrl)
    ?.localStorage.find(pair => pair.name === 'token') !== undefined
}

const LOGIN_URL = 'login';
const REGISTER_URL = 'register';

// TODO get all these from env ?

const CORRECT_LOGIN = 'login123';
const CORRECT_PASSWORD = 'password';
const INCORRECT_PASSWORD = 'incorrect123';

const CORRECT_SHORT_INFO = '123';

const TAKEN_LOGIN = 'login123';
const NON_EXISTENT_LOGIN = 'user123123';

// TODO get this from env ?
const NON_EXISTENT_LOGIN_MESSAGE = /User with that login does not exist/;
const INVALID_PASSWORD_MESSAGE = /Passwords don't match/;

// TODO get this from env ?
const LOGIN_TAKEN_MESSAGE = /Login is already taken/;

test.describe('Auth', () => {
  test.describe('Login', () => {
    test('should display message when login is not registered', async ({ page, context, baseURL }) => {
      await page.goto('/', { waitUntil: "networkidle"});

      expect(page.url()).toContain(LOGIN_URL);

      await page.getByLabel(/Логин/).fill(NON_EXISTENT_LOGIN);
      await page.getByLabel(/Пароль/).fill(CORRECT_PASSWORD);
      await page.getByRole('button', { name: /Войти/ }).click();
      await new Promise((res) => setTimeout(res, 5000));

      await expect(page.getByText(NON_EXISTENT_LOGIN_MESSAGE)).toBeVisible();
      expect(page.url()).toContain(LOGIN_URL);

      const storage = await context.storageState();
      expect(hasToken(storage, baseURL)).toBe(false)
    });

    test('should display message when password is incorrect', async ({ page, context, baseURL }) => {
      await setUpUsers()
      await page.goto('/', { waitUntil: "networkidle"});

      expect(page.url()).toContain(LOGIN_URL);

      await page.getByLabel(/Логин/).fill(CORRECT_LOGIN);
      await page.getByLabel(/Пароль/).fill(INCORRECT_PASSWORD);
      await page.getByRole('button', { name: /Войти/ }).click();
      await new Promise((res) => setTimeout(res, 5000));

      await expect(page.getByText(INVALID_PASSWORD_MESSAGE)).toBeVisible();
      expect(page.url()).toContain(LOGIN_URL);

      const storage = await context.storageState();
      expect(hasToken(storage, baseURL)).toBe(false)
    });

    test('should correctly login and redirect to news page', async ({ page, context, baseURL }) => {
      await setUpUsers()
      await page.goto('/', { waitUntil: "networkidle"});

      expect(page.url()).toContain(LOGIN_URL);

      await page.getByLabel(/Логин/).fill(CORRECT_LOGIN);
      await page.getByLabel(/Пароль/).fill(CORRECT_PASSWORD);
      await page.getByRole('button', { name: /Войти/ }).click();
      await new Promise((res) => setTimeout(res, 5000));

      expect(page.url()).toContain('/');

      const storage = await context.storageState();
      expect(hasToken(storage, baseURL)).toBe(true)
    });
  });

  test.describe('Register', () => {
    test('should display message when login is taken', async ({page, context, baseURL}) => {
      await setUpUsers()
      await page.goto('/', { waitUntil: "networkidle"});

      await page.getByText(/Страница регистрации/).click();

      expect(page.url()).toContain(REGISTER_URL);

      await page.getByLabel(/Логин/).fill(TAKEN_LOGIN);
      await page.getByLabel(/Пароль/).fill(CORRECT_PASSWORD);
      await page.getByLabel(/Повторите пароль/).fill(CORRECT_PASSWORD);
      await page.getByLabel(/Краткая информация/).fill(CORRECT_SHORT_INFO);
      await page.getByRole('button', { name: /Войти/ }).click();
      await new Promise((res) => setTimeout(res, 5000));

      await expect(page.getByText(LOGIN_TAKEN_MESSAGE)).toBeVisible();

      expect(page.url()).toContain(REGISTER_URL);

      const storage = await context.storageState();
      expect(hasToken(storage, baseURL)).toBe(false)
    });

    test('should correctly register', async ({page, context, baseURL}) => {
      await resetDb()
      await page.goto('/', { waitUntil: "networkidle"});

      await page.getByText(/Страница регистрации/).click();

      expect(page.url()).toContain(REGISTER_URL);

      await page.getByLabel(/Логин/).fill(NON_EXISTENT_LOGIN);
      await page.getByLabel(/Пароль/).fill(CORRECT_PASSWORD);
      await page.getByLabel(/Повторите пароль/).fill(CORRECT_PASSWORD);
      await page.getByLabel(/Краткая информация/).fill(CORRECT_SHORT_INFO);
      await page.getByRole('button', { name: /Войти/ }).click();
      await new Promise((res) => setTimeout(res, 5000));

      expect(page.url()).toContain('/');

      const storage = await context.storageState();
      expect(hasToken(storage, baseURL)).toBe(true)
    });
  });
});