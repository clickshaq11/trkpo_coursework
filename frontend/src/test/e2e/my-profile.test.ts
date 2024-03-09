import { test, expect } from '@playwright/test';
import { firstFilePath } from '@/test/e2e/setup/auth.setup';

test.describe('My profile', () => {
  test.use({storageState: firstFilePath})

  test('should correctly update my profile', async ({ page }) => {
    const newPassword = 'newcoolpassword123'
    const newShortInfo = 'newcoolshortinfo123'

    await page.goto('me');

    await page.getByRole('button', { name: /Редактировать/ }).click()

    await page.getByLabel(/Краткая информация/).fill(newShortInfo)
    await page.getByLabel("Пароль").fill(newPassword)
    await page.getByLabel(/Повторите Пароль/).fill(newPassword)

    await page.getByText(/Сохранить/).click()

    await expect(page.getByTestId('profile-login')).toHaveText(newShortInfo)
  })
})