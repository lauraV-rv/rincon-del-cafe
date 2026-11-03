import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('about:blank');
  await page.locator('body').click();
  await page.locator('body').click();
  await page.goto('http://localhost:3000/');
  await page.getByText('Inicia sesión Correo Contrase').click();
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('textbox', { name: 'Correo' }).fill('estudiante1@cafe.test');
  await page.getByRole('textbox', { name: 'Correo' }).press('Tab');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Cafe2026');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter');
  await page.getByRole('textbox', { name: 'Texto' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).fill('Latte');
  await page.getByLabel('Categoría Todas bebidas').selectOption('postres');
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByLabel('Categoría Todas bebidas').selectOption('bebidas');
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).fill('Chocolate');
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).fill('6000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).click();
  await page.getByRole('textbox', { name: 'Texto' }).fill('Latte');
  await page.getByRole('textbox', { name: 'Texto' }).press('Enter');
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).fill('8000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByRole('button', { name: 'Buscar' }).click({
    clickCount: 3
  });
  await page.getByRole('button', { name: 'Buscar' }).click({
    clickCount: 3
  });
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).fill('');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await page.getByLabel('Categoría Todas bebidas').selectOption('');
  await page.getByRole('button', { name: 'Buscar' }).click({
    clickCount: 5
  });
  await page.getByText('Latte (bebidas): $').click();
  await page.getByText('Latte (bebidas): $').dblclick();
  await page.getByRole('button', { name: 'Catálogo' }).click();
  await page.getByRole('button', { name: 'Carrito' }).click();
  await page.getByRole('button', { name: 'Cupones' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
});