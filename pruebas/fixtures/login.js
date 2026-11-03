import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { usuarioDePrueba } from '../data/usuarios.js';

// Entrega una página con la sesión ya iniciada.
export const test = base.extend({
  paginaLogueada: async ({ page }, use) => {
    const login = new PaginaLogin(page);
    await login.ir();
    await login.iniciarSesion(usuarioDePrueba.correo, usuarioDePrueba.clave);
    await expect(login.botonCarrito).toBeVisible();

    await use(page);
  },
});

export { expect };
