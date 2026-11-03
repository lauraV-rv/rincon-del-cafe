# El Rincón del Café · Taller de Playwright · HU-05 Pago y envío

Mono repo con la aplicación, sus pruebas de aceptación con Playwright (JavaScript) y el pipeline de GitHub Actions.

```text
rincon-del-cafe/
├── app/                        
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── pruebas/                     Pruebas de aceptación (Playwright, ES modules)
│   ├── package.json             "type": "module", @playwright/test
│   ├── package-lock.json
│   ├── playwright.config.js     baseURL, webServer (reuseExistingServer: true), chromium
│   ├── data/                    usuarios.js, datosPedido.js  → datos y valores esperados
│   ├── pages/                   PaginaLogin, PaginaCarrito, PaginaPago → únicos archivos con localizadores
│   ├── fixtures/                login.js, pago.js → preparan la sesión y el carrito
│   ├── tests/                   hu05-pago-envio.spec.js, login.spec.js → qué se verifica
│   └── grabaciones-codegen/     grabaciones originales de codegen (no se ejecutan)
├── docs/
│   ├── casos-de-prueba-HU05.md  matriz de casos y reporte del bug
│   ├── pipeline-explicado.md    pipeline línea por línea, tarea del ci.yml y despliegue
│   ├── historias-de-usuario.md
│   └── evidencias/              capturas de Actions en verde y en rojo (las agregas tú)
└── .github/workflows/
    └── pipeline.yml             job pruebas-aceptacion
```

## Resumen

- **Bug encontrado (HU-05, criterio 2):** el impuesto se calcula sobre el subtotal **sin el envío**. Con 1 Latte ($12.000) la app muestra impuesto $2.280 en lugar de $3.230 (faltan $950 = 19% de $5.000).
- **Casos:** 15 en total. 11 `@acceptanceTest` (bloquean el pipeline), 2 `@bug` (detectan el bug y fallan a propósito), 1 caso borde y 1 `@smoketest`. Detalle en [docs/casos-de-prueba-HU05.md](docs/casos-de-prueba-HU05.md).
- **Pipeline:** levanta la app en el puerto 3000, espera a que responda, corre solo `@acceptanceTest` y sube el reporte. Detalle en [docs/pipeline-explicado.md](docs/pipeline-explicado.md).

## Correr en local

Requisitos: Node.js 22 o superior (`node -v`) y npm (`npm -v`).

```bash
# 1. La app
cd app
npm ci
npm start                     

# 2. Las pruebas (en otra terminal)
cd pruebas
npm ci
npx playwright install --with-deps chromium
npm test                      # todo menos @bug → 13 pasan (verificación de las diapositivas 18 y 19)
npm run test:aceptacion       # solo @acceptanceTest → 11 pasan (lo mismo que corre el pipeline)
npm run test:bug              # solo @bug → 2 FALLAN a propósito: así se evidencia el bug
npm run test:todo             # los 15 casos → 13 pasan, 2 fallan (los @bug)
npm run listar:aceptacion     # lista los casos que ejecuta el pipeline (diapositiva 20)
npm run reporte               # abre el reporte HTML con los traces
```

- Si la app está apagada, `npm test` también funciona: `webServer` la enciende y la apaga al terminar.
- `npm test` deja fuera solo los `@bug`. Los casos del bug **no se desactivan**: se corren con `npm run test:bug` y fallan mientras la app tenga el bug.


## Comprobar el pipeline

   ```
1. **Ver el pipeline:** pestaña **Actions** → *Pipeline pruebas de aceptación* → la ejecución del commit. Debe quedar en **verde** (11 casos pasan).
2. **Descargar el reporte:** dentro de la ejecución, sección **Artifacts** → `playwright-report`.
3. **Ejecución manual:** Actions → *Pipeline pruebas de aceptación* → **Run workflow**.
4. **Prueba del bloqueo** (rojo a propósito):
   ```bash
   git checkout -b develop
   # En pruebas/data/datosPedido.js cambia  envio: 'Envío: $5000'  por  envio: 'Envío: $6000'
   git commit -am "Prueba del bloqueo: fallo a propósito en CP03"
   git push -u origin develop
   ```
   En Actions la ejecución de `develop` queda en **rojo**: falla CP03 (`Expected "Envío: $6000"`, `Received "Envío: $5000"`). Toma captura.
   Luego deshaz el cambio y vuelve a subir:
   ```bash
   # Vuelve a dejar  envio: 'Envío: $5000'
   git commit -am "Corrige la prueba del bloqueo"
   git push
   ```
   La nueva ejecución queda en **verde**.



