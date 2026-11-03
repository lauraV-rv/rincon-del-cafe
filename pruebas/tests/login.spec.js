import { test, expect } from '../fixtures/login.js';
import { PaginaLogin } from '../pages/PaginaLogin.js';

// Verificación básica (smoke): la app arranca y deja iniciar sesión.
// El login no es parte de la HU-05, por eso no lleva @acceptanceTest.
test('el usuario logueado ve el menú de la tienda @smoketest', async ({ paginaLogueada: page }) => {
  const login = new PaginaLogin(page);
  await expect(login.botonPagoYEnvio).toBeVisible();
});
