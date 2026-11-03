import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Todas las pruebas usan el mismo usuario y el carrito vive en el servidor:
  // se ejecutan una por una para que no se pisen entre ellas.
  fullyParallel: false,
  workers: 1,

  // En GitHub Actions (CI=true) falla si alguien dejó un test.only olvidado.
  forbidOnly: !!process.env.CI,

  // list: muestra el avance en consola. html: reporte que se sube como artifact.
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:3000',
    // Guarda el trace solo de las pruebas que fallan.
    trace: 'retain-on-failure',
  },

  // Requisito 3 · webServer
  // Antes de las pruebas, Playwright revisa si http://localhost:3000 responde.
  // - Si ya responde (el pipeline levantó la app, o tú la tienes encendida),
  //   la reutiliza gracias a reuseExistingServer: true.
  // - Si no responde, la enciende con "npm start" dentro de ../app y la apaga al final.
  webServer: {
    command: 'npm start',
    cwd: '../app',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
