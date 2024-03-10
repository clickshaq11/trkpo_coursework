import { test, expect } from '@playwright/test';
import {
  firstFilePath, secondFilePath, FIRST_LOGIN, SECOND_LOGIN,
  setUpPost, setUpLike, setUpUsers, setUpSubscription
} from '@/test/e2e/setup/auth.setup';

test.describe('Post', () => {
  test.use({ storageState: firstFilePath });

  test.describe('Likes', () => {
    test('should correctly like post with zero likes', async ({ page }) => {
      await setUpUsers();
      await setUpPost('My post test body for e2e tests');
      await page.goto('posts/1', { waitUntil: 'networkidle' });

      const likeButton = await page.getByTestId(/on-like/)

      await likeButton.click();

      await expect(page.getByTestId(/like-counter/)).toHaveText('1');

      await expect(likeButton).toHaveCSS('color', 'red');
    });

    test('should correctly remove like from liked post', async ({ page }) => {
      await setUpUsers();
      await setUpPost('My post test body for e2e tests');
      await setUpLike();
      await page.goto('posts/1', { waitUntil: 'networkidle' });

      const likeButton = await page.getByTestId(/on-like/);

      await likeButton.click();

      await expect(page.getByTestId(/like-counter/)).toHaveText('0');

      await expect(likeButton).toHaveCSS('color', 'red');
    });
  });

  test.describe('Comments', () => {
    test('should correctly create comment and notification', async ({ page, browser }) => {
      await setUpUsers();
      await setUpPost('My post test body for e2e tests');
      const newCommentText = `Круто! @${SECOND_LOGIN}`;

      await page.goto('posts/1', { waitUntil: 'networkidle' });

      await page.getByPlaceholder(/Введите текст комментария/).fill(newCommentText);
      await page.getByText(/Прокомментировать/).click();

      await expect(page.getByText(`${FIRST_LOGIN} пишет:`)).toBeVisible();
      await expect(page.getByText(`${newCommentText}`)).toBeVisible();

      const newPageForSecondUser = await (await browser.newContext({ storageState: secondFilePath })).newPage();

      await newPageForSecondUser.goto('/', { waitUntil: 'networkidle' });

      const notifications = await newPageForSecondUser.waitForSelector('[aria-label="Уведомления"]');
      await notifications.click();

      await expect(newPageForSecondUser.getByText(/Перейти/)).toBeVisible();
    });
  });

  test.describe('Create', () => {
    test('should correctly create a post with tag', async ({ page, browser }) => {
      await setUpUsers();
      const body = 'My post test body for e2e tests @login2222 with tag';
      const title = 'title';

      await page.goto('/', { waitUntil: 'networkidle' });

      await page.getByText('Опубликовать пост', { exact: true }).click();

      await page.getByPlaceholder(/Введите заголовок/).fill(title);
      await page.getByPlaceholder(/Введите тело поста/).fill(body);
      await page.getByText('Опубликовать', { exact: true }).click();
      await page.goto('me', { waitUntil: 'networkidle' });
      await expect(page.getByTestId('post-title')).toBeVisible();

      const newPageForSecondUser = await (await browser.newContext({ storageState: secondFilePath })).newPage();

      await newPageForSecondUser.goto('/');

      const notifications = await newPageForSecondUser.waitForSelector('[aria-label="Уведомления"]');

      await notifications.click();

      await expect(page.getByText(/Вас отметили'/)).toBeVisible();
    });
  });

  test.describe('Edit', () => {
    test('should correctly update post', async ({ page }) => {
      await setUpUsers();
      await setUpPost('My old post');
      const newTitle = 'newcooltitle123';
      const newBody = 'newcoolbody123';

      await page.goto('posts/1', { waitUntil: 'networkidle' });

      await page.getByTestId('manage-post').click();
      await page.getByTestId('edit-post').click();

      await page.getByLabel(/Заголовок/).fill(newTitle);
      await page.getByLabel(/Тело/).fill(newBody);
      await page.getByRole('button', { name: /Сохранить/ }).click();

      await expect(page.getByTestId('title')).toHaveText(newTitle);
      await expect(page.getByTestId('body')).toHaveText(newBody);
    });
  });

  test.describe('Delete', () => {
    test('should correctly delete post', async ({ page }) => {
      await setUpUsers();
      await setUpPost('My old post');
      await page.goto('posts/1', { waitUntil: 'networkidle' });

      await page.getByTestId('manage-post').click();
      await page.getByTestId('delete-post').click();

      await expect(page.url()).toContain('/');

      await page.goto('/me', { waitUntil: 'networkidle' });

      await expect(page.getByTestId('no-posts')).toHaveText(/У вас нет постов/);
    });
  });

  test.describe('Notifications', () => {
    test('should correctly redirect on notification click', async ({ page, browser }) => {
      await setUpUsers();
      const body = 'My post test body for e2e tests @login2222 with tag';
      const title = 'title';

      await page.goto('/', { waitUntil: 'networkidle' });

      await page.getByText('Опубликовать пост', { exact: true }).click();

      await page.getByPlaceholder(/Введите заголовок/).fill(title);
      await page.getByPlaceholder(/Введите тело поста/).fill(body);
      await page.getByText('Опубликовать', { exact: true }).click();
      await page.goto('me', { waitUntil: 'networkidle' });
      await expect(page.getByTestId('post-title')).toBeVisible();

      const newPageForSecondUser = await (await browser.newContext({ storageState: secondFilePath })).newPage();

      await newPageForSecondUser.goto('/');

      const notifications = await newPageForSecondUser.waitForSelector('[aria-label="Уведомления"]');

      await notifications.click();

      await newPageForSecondUser.getByText(/Перейти/).click();

      expect(newPageForSecondUser.url()).toContain('posts/1');
    });
  });

  test.describe('Subscriptions', () => {
    test('should correctly subscribe', async ({ page }) => {
      await setUpUsers();
      const body = 'My old post'
      await setUpPost(body, 2);
      await page.goto('profiles/2', { waitUntil: 'networkidle' });

      const subscribeButton = page.getByTestId('subscribe');

      await subscribeButton.click();

      await expect(subscribeButton).toHaveText('Вы подписаны');

      await page.goto('/', { waitUntil: 'networkidle' });

      await expect(page.getByText(body)).toBeVisible();
    });

    test('should correctly unsubscribe', async ({ page }) => {
      await setUpUsers();
      await setUpPost('My old post', 2);
      await setUpSubscription();
      await page.goto('profiles/2', { waitUntil: 'networkidle' });

      const subscribeButton = page.getByTestId('subscribe');

      await subscribeButton.click();

      await expect(subscribeButton).toHaveText('Подписаться');

      await page.goto('/', { waitUntil: 'networkidle' });

      await expect(page.getByText(/Вы не подписаны ни на одного пользователя./))
        .toBeVisible();
    });
  });

});