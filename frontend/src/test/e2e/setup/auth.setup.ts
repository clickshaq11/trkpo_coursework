import { test as setup } from '@playwright/test';
import sql from './db.ts';

const firstFilePath = 'playwright/.auth/first.json';

const FIRST_LOGIN = 'login123';
const FIRST_PASSWORD = 'password';

const secondFilePath = 'playwright/.auth/second.json';

const SECOND_LOGIN = 'login2222';
const SECOND_PASSWORD = 'password';

setup('authenticate as first user', async ({ page }) => {
  await setUpUsers();
  await page.goto('login');
  await page.getByLabel(/Логин/).fill(FIRST_LOGIN);
  await page.getByLabel(/Пароль/).fill(FIRST_PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();
  await new Promise((res) => setTimeout(res, 5000));

  await page.waitForURL('**/');
  await page.context().storageState({ path: firstFilePath });
});



setup('authenticate as user', async ({ page }) => {
  await setUpUsers();
  await page.goto('login');
  await page.getByLabel(/Логин/).fill(SECOND_LOGIN);
  await page.getByLabel(/Пароль/).fill(SECOND_PASSWORD);
  await page.getByRole('button', { name: 'Войти' }).click();
  await new Promise((res) => setTimeout(res, 5000));

  await page.waitForURL('**/');

  await page.context().storageState({ path: secondFilePath });
});

async function resetDb() {
  await sql`DELETE FROM subscription;`
  await sql`DELETE FROM notification;`
  await sql`DELETE FROM like_entity;`
  await sql`DELETE FROM comment;`
  await sql`DELETE FROM post;`
  await sql`DELETE FROM user_entity;`

  await sql`ALTER SEQUENCE subscription_id_seq RESTART WITH 1;`
  await sql`ALTER SEQUENCE notification_id_seq RESTART WITH 1;`
  await sql`ALTER SEQUENCE like_entity_id_seq RESTART WITH 1;`
  await sql`ALTER SEQUENCE comment_id_seq RESTART WITH 1;`
  await sql`ALTER SEQUENCE post_id_seq RESTART WITH 1;`
  await sql`ALTER SEQUENCE user_entity_id_seq RESTART WITH 1;`

}

async function setUpUsers() {
  await resetDb()
  await sql`
  INSERT INTO user_entity(hashed_password, login, short_info) VALUES
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login123', 'shortInfo'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'login2222', 'info'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'logout111', 'logoutInfo'),
  ('$2a$10$2mHLKjAiCjX8NeQ0CWA9XOE54UWqquQccHsrWSJAeSNcRHaG1msvK', 'anotherUser', 'info');
  `
}

async function setUpPost(body: string, id: number = 1) {
  await sql`
  INSERT INTO post("author_id", "title", "body", "created_at")
  VALUES (${ id }, 'My title', ${ body }, 1699646474000);
  `
}

async function setUpLike() {
  await sql`
  INSERT INTO like_entity("user_id", "post_id") VALUES (1, 1);
  `
}

async function setUpSubscription() {
  await sql`
  INSERT INTO subscription("creator_id", "subscriber_id") VALUES (2, 1);
  `
}


export {
  FIRST_LOGIN, SECOND_LOGIN, firstFilePath, secondFilePath,
  resetDb, setUpUsers, setUpPost, setUpLike, setUpSubscription
}
