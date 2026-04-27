import { test, expect } from '@playwright/test';

test.describe('スモークテスト', () => {
  test('ページが正常に読み込まれる', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10_000 });
  });

  test('致命的な JavaScript エラーがない', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForTimeout(3_000);
    expect(errors).toHaveLength(0);
  });
});
