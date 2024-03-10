import { test, expect } from '@playwright/test';
import { firstFilePath, setUpUsers } from '@/test/e2e/setup/auth.setup';

test.describe('My profile', () => {
  test.use({storageState: firstFilePath})

  test('should correctly update my profile', async ({ page }) => {
    await setUpUsers()
    const newPassword = 'newcoolpassword123'
    const newShortInfo = 'newcoolshortinfo123'

    await page.goto('me', { waitUntil: "networkidle"});

    await page.getByText(/Редактировать/).click()

    await page.getByPlaceholder(/Введите краткую информацию/).fill(newShortInfo)
    await page.getByPlaceholder(/Введите пароль/).fill(newPassword)
    await page.getByPlaceholder(/Повторите пароль/).fill(newPassword)

    await page.getByText(/Сохранить/).click()

    await expect(page.getByTestId('profile-shortinfo')).toHaveText(newShortInfo)
  })
})