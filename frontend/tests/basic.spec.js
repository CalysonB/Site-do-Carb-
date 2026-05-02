import { test, expect } from '@playwright/test';

test('deve carregar a página inicial', async ({ page }) => {
  await page.goto('/');
  // Verifica se o layout do Twitter está presente (baseado no App.jsx)
  const layout = page.locator('.twitter-layout');
  await expect(layout).toBeVisible();
});
