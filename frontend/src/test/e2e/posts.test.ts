import { test, expect } from '@playwright/test';
import { firstFilePath, secondFilePath, FIRST_LOGIN, SECOND_LOGIN } from '@/test/e2e/setup/auth.setup';


test.describe('Post', () => {
  test.use({ storageState: firstFilePath });

  test.describe('Likes', () => {
    test('should correctly like post with zero likes', async ({ page }) => {
      await page.goto('post/1');

      await page.getByTestId(/on-like/).click();

      expect(page.getByTestId(/likes/)).toBe('1');

      // TODO add check for like icon
    });

    test('should correctly remove like from liked post', async ({ page }) => {
      await page.goto('post/1');

      await page.getByTestId(/on-like/).click();

      expect(page.getByTestId(/likes/)).toBe('0');

      // TODO add check for like icon
    });
  });

  test.describe('Comments', () => {
    test('should correctly create comment and notification', async ({ page, browser }) => {
      const newCommentText = `Круто! @${SECOND_LOGIN}`;

      await page.goto('post/1');

      await page.getByPlaceholder(/Введите текст комментария/).fill(newCommentText);
      await page.getByRole('button', { name: /Прокомментировать/ }).click();

      await expect(page.getByText(`${FIRST_LOGIN} пишет: ${newCommentText}`)).toBeVisible();

      const newPageForSecondUser = await (await browser.newContext({ storageState: secondFilePath })).newPage();

      await newPageForSecondUser.goto('/');

      const notifications = await page.waitForSelector('[aria-label="Уведомления"]');
      await notifications.click();

      await expect(page.getByText(/Вас отметили. Перейти/)).toBeVisible();
    });
  });

  test.describe('Create', () => {
    test('should correctly create a post with tag', async ({ page, browser }) => {
      const body = 'body';
      const title = 'title';

      await page.goto('/');

      await page.getByRole('button', { name: /Опубликовать пост/ }).click();

      await page.getByPlaceholder(/Введите заголовок/).fill(body);
      await page.getByPlaceholder(/Введите тело поста/).fill(title);
      // no regex here to avoid matching invisible button
      await page.getByRole('button', { name: 'Опубликовать' }).click();
      await page.goto('me');
      await expect(page.getByTestId('post-title')).toBeVisible();

      const newPageForSecondUser = await (await browser.newContext({ storageState: secondFilePath })).newPage();

      await newPageForSecondUser.goto('/');

      const notifications = await page.waitForSelector('[aria-label="Уведомления"]');

      await notifications.click();

      await page.getByRole('link', { name: /Перейти/ }).click();

      // TODO check post id
      expect(page.url()).toBe('posts/1');
    });
  });

  test.describe('Edit', () => {
    test('should correctly update post', async ({ page }) => {
      const newTitle = 'newcooltitle123';
      const newBody = 'newcoolbody123';

      // TODO check post id
      await page.goto('post/1');

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
      await page.goto('post/1');

      await page.getByTestId('manage-post').click();
      await page.getByTestId('delete-post').click();

      await expect(page.url()).toBe('/');

      await page.goto('/me');

      await expect(page.getByTestId('no-posts')).toHaveText(/У вас нет постов/);
    });
  });

  test.describe('Subscriptions', () => {
    test('should correctly subscribe', async ({page}) => {
      // TODO profile id
      await page.goto('profiles/2')

      const subscribeButton = page.getByTestId('subscribe')

      await subscribeButton.click()

      await expect(subscribeButton).toHaveText('Вы подписаны')

      // TODO add check for posts in news feed
    })

    test('should correctly unsubscribe', async ({ page }) => {
      // TODO profile id
      await page.goto('profiles/2')

      const subscribeButton = page.getByTestId('subscribe')

      await subscribeButton.click()

      await expect(subscribeButton).toHaveText('Подписаться')

      // TODO add check for posts in news feed
    })
  })

});