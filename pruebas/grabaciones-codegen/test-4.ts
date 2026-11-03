import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('textbox', { name: 'Correo' }).fill('estudiante1@cafe.test');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Cafe2026');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).fill('calle 45 34-12');
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await page.getByRole('textbox', { name: 'Ciudad' }).fill('Cali');
  await page.getByLabel('Método de pago Selecciona').selectOption('efectivo');
  await page.getByRole('spinbutton', { name: 'Propina' }).click();
  await page.getByRole('spinbutton', { name: 'Propina' }).click();
  await page.getByRole('spinbutton', { name: 'Propina' }).fill('0');
  await page.getByRole('button', { name: 'Calcular total' }).click();
  await page.getByText('Impuesto (19%): $').click();
  await expect(page.locator('#calcular')).toMatchAriaSnapshot(`- button "Calcular total"`);
  await expect(page.locator('#resumen-pago')).toMatchAriaSnapshot(`
    - paragraph:
      - text: /Impuesto \\(\\d+%\\):/
      - strong: /\\$\\d+/
    `);
  await page.getByText('Total: $43080').click();
});