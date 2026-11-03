import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('heading', { name: 'Inicia sesión' }).click();
  await page.getByRole('heading', { name: 'Inicia sesión' }).dblclick();
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('textbox', { name: 'Correo' }).fill('estudiante1@cafe.test');
  await page.getByRole('textbox', { name: 'Correo' }).press('Tab');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Cafe2026');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
  await page.getByRole('button', { name: 'Reserva de mesa' }).click();
  await page.getByRole('textbox', { name: 'Fecha' }).fill('2025-12-01');
  await page.getByLabel('Hora 18:00 19:00 20:').selectOption('19:00');
  await page.getByRole('spinbutton', { name: 'Personas' }).click();
  await page.getByRole('spinbutton', { name: 'Personas' }).fill('2');
  await page.getByRole('textbox', { name: 'Nombre' }).click();
  await page.getByText('☕ El Rincón del Café Cerrar sesión RegistroCatálogoCarritoCuponesPago y enví').click();
  await page.getByRole('textbox', { name: 'Nombre' }).click();
  await page.getByRole('textbox', { name: 'Nombre' }).fill('Latte');
  await page.getByRole('button', { name: 'Consultar disponibilidad' }).click();
  await page.getByRole('button', { name: 'Reservar' }).click();
  await page.getByText('Reserva creada').click();
  await page.getByRole('button', { name: 'Programa de puntos' }).click();
  await page.getByRole('button', { name: 'Historial de pedidos' }).click();
  await page.getByRole('button', { name: 'Catálogo' }).click();
  await page.getByRole('button', { name: 'Registro' }).click();
  await page.getByRole('button', { name: 'Cupones' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).fill('calle 45 #12-56');
  await page.getByText('Ciudad').click();
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await page.getByRole('textbox', { name: 'Ciudad' }).fill('Cali');
  await page.getByRole('textbox', { name: 'Ciudad' }).press('Enter');
  await page.getByLabel('Método de pago Selecciona').selectOption('efectivo');
  await page.getByRole('spinbutton', { name: 'Propina' }).click();
  await page.getByRole('spinbutton', { name: 'Propina' }).fill('500');
  await page.getByText('☕ El Rincón del Café Cerrar sesión RegistroCatálogoCarritoCuponesPago y enví').click();
  await page.getByRole('button', { name: 'Calcular total' }).click();
  await page.getByRole('button', { name: 'Historial de pedidos' }).click();
  await page.getByRole('button', { name: 'Programa de puntos' }).click();
  await page.getByRole('button', { name: 'Favoritos' }).click();
  await page.getByRole('button', { name: 'Reseñas' }).click();
  await page.getByRole('button', { name: 'Reserva de mesa' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
  await page.getByRole('button', { name: 'Carrito' }).click();
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
  await page.getByRole('button', { name: 'Confirmar carrito' }).click();
  await page.getByRole('button', { name: 'Vaciar carrito' }).click();
  await page.getByRole('button', { name: 'Agregar al carrito' }).click();
  await page.getByRole('button', { name: 'Confirmar carrito' }).click();
  await page.getByRole('button', { name: 'Pago y envío' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).click();
  await page.getByRole('textbox', { name: 'Dirección' }).fill('Calle 45 #12-56');
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await page.getByRole('textbox', { name: 'Ciudad' }).fill('Cali');
  await page.getByLabel('Método de pago Selecciona').selectOption('efectivo');
  await page.getByRole('spinbutton', { name: 'Propina' }).click();
  await page.getByRole('spinbutton', { name: 'Propina' }).fill('500');
  await page.getByRole('button', { name: 'Calcular total' }).click();
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();
  await page.getByText('☕ El Rincón del Café Cerrar sesión RegistroCatálogoCarritoCuponesPago y enví').click();
  await expect(page.getByRole('heading', { name: 'Pago y envío' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pago y envío' })).toBeVisible();
  await expect(page.getByText('☕ El Rincón del Café Cerrar sesión RegistroCatálogoCarritoCuponesPago y enví')).toBeVisible();
  await page.locator('#app').click();
  await page.getByText('☕ El Rincón del Café Cerrar sesión RegistroCatálogoCarritoCuponesPago y enví').click();
  await expect(page.locator('#f-pago')).toContainText('Ciuda');
  await page.getByText('Ciudad').click();
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await page.getByRole('textbox', { name: 'Ciudad' }).click();
  await expect(page.locator('#f-pago')).toContainText('Ciudad');
  await expect(page.locator('#f-pago')).toContainText('Direc');
  await expect(page.locator('#f-pago')).toContainText('Dirección');
  await expect(page.getByRole('textbox', { name: 'Ciudad' })).toHaveValue
  await expect(page.locator('#f-pago')).toContainText('Dirección');
  await expect(page.getByLabel('Método de pago Selecciona')).toHaveValue('efectivo');('Cali');
  await expect(page.getByRole('spinbutton', { name: 'Propina' })).toHaveValue('500');
  await page.getByText('Método de pago Selecciona').click();
  await expect(page.locator('section')).toMatchAriaSnapshot(`
    - heading "Pago y envío" [level=2]
    - text: Dirección
    - textbox "Dirección": "/Calle \\\\d+ #\\\\d+-\\\\d+/"
    - text: Ciudad
    - textbox "Ciudad": Cali
    - text: Método de pago
    - combobox "Método de pago":
      - option "Selecciona"
      - option "efectivo" [selected]
      - option "tarjeta"
      - option "nequi"
    - text: Propina
    - spinbutton "Propina": /\\d+/
    - button "Calcular total"
    - button "Confirmar pedido"
    - paragraph:
      - text: "Estado:"
      - strong: enviado
    - paragraph: "/Subtotal: \\\\$\\\\d+/"
    - paragraph: "/Envío: \\\\$\\\\d+/"
    - paragraph:
      - text: /Impuesto \\(\\d+%\\):/
      - strong: /\\$\\d+/
    - paragraph: "/Propina: \\\\$\\\\d+/"
    - paragraph:
      - text: "Total:"
      - strong: /\\$\\d+/
    - status: "Pedido #1 enviado"
    `);
  await expect(page.locator('#f-pago')).toMatchAriaSnapshot(`
    - text: Ciudad
    - textbox "Ciudad": Cali
    `);
  await expect(page.locator('#f-pago')).toMatchAriaSnapshot(`
    - text: Propina
    - spinbutton "Propina": /\\d+/
    `);

  await expect(page.getByRole('spinbutton', { name: 'Propina' })).toHaveValue('500');
});
