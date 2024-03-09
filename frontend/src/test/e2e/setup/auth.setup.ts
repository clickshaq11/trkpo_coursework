import { test as setup } from '@playwright/test';
import sql from './db.js';

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

async function resetDb() {
  await sql`
  DELETE FROM subscription;
  DELETE FROM notification;
  DELETE FROM like_entity;
  DELETE FROM comment;
  DELETE FROM post;
  DELETE FROM user_entity;

  ALTER SEQUENCE subscription_id_seq RESTART WITH 1;
  ALTER SEQUENCE notification_id_seq RESTART WITH 1;
  ALTER SEQUENCE like_entity_id_seq RESTART WITH 1;
  ALTER SEQUENCE comment_id_seq RESTART WITH 1;
  ALTER SEQUENCE post_id_seq RESTART WITH 1;
  ALTER SEQUENCE user_entity_id_seq RESTART WITH 1;
  `
}

async function setUpUsers() {
  const users = await sql`
  INSERT INTO user_entity(hashed_password, login, short_info) VALUES
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login123', 'shortInfo'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login2222', 'info'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'logout111', 'logoutInfo'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'anotherUser', 'info');
  `
  return users
}
