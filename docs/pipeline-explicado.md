# Pipeline explicado · `.github/workflows/pipeline.yml`

## Qué hace, en orden

Un solo job, `pruebas-aceptacion`, en una máquina Linux nueva:

1. Descarga el código del commit (`actions/checkout`).
2. Instala Node.js 22 con caché de npm (`actions/setup-node`).
3. `npm ci` en `app/` y en `pruebas/`.
4. Instala Chromium y sus dependencias del sistema.
5. Levanta la app en el puerto 3000, en segundo plano.
6. Espera a que `http://localhost:3000` responda.
7. Ejecuta solo los casos `@acceptanceTest`.
8. Sube el reporte de Playwright como artifact, aunque las pruebas fallen.

Si un caso `@acceptanceTest` falla, el paso 7 termina con `exit code 1`, el job queda en **rojo** y en un escenario real no se desplegaría. Si todos pasan, queda en **verde**.

---

## Tarea de la diapositiva 23: ¿qué reutilizo del ci.yml?

| Parte del ci.yml | ¿Reutilizable? | ¿Qué le falta o qué cambia? |
|---|---|---|
| `on:` (disparadores) | **Sí** | Se dejan `push` y `pull_request` a `main` y `develop`, y `workflow_dispatch`. Se quita el input `testTag`: el tag siempre es `@acceptanceTest`. |
| `permissions` | **Parcial** | Basta `contents: read`. Se quita `issues: write` porque no se actualizan Issues (mínimo privilegio). |
| Preparar entorno (checkout y setup) | **Parcial** | `actions/checkout` se mantiene (sube a `@v5`, ver *Versiones de las acciones*). `setup-java` (JDK 21) se cambia por `actions/setup-node@v5` con Node 22. Faltan los pasos propios de Node: `npm ci` en `app/` y en `pruebas/`, y `npx playwright install --with-deps chromium`. |
| Caché de dependencias | **Parcial** | Ya no se cachea Gradle. Se usa `cache: 'npm'` de `setup-node`, con `cache-dependency-path` apuntando a los dos `package-lock.json`. |
| Ejecutar pruebas (paso 8) | **Parcial** | Cambia `./gradlew test -Dkarate.options="--tags $tag"` por `npx playwright test --grep @acceptanceTest`. **Se quita `continue-on-error: true`** para que el paso falle cuando falla una prueba. Antes hay que **levantar la app** en el puerto 3000 y **esperar** a que responda: en Karate no hacía falta. |
| Reportes (`upload-artifact`) | **Sí** | Se mantiene `if: always()`. Cambia la ruta: `pruebas/playwright-report/` en vez de `target/karate-reports`, y la versión sube a `@v6`. |
| Actualizar Issue (`curl`) | **No** | No se usa matriz de casos en Issues en este taller. Se elimina junto con "Determine test status" y "Extract issue number". |
| Paso final (`exit 1`) | **No** | Ya no hace falta. En el ci.yml existía porque `continue-on-error` ocultaba el fallo. Sin `continue-on-error`, el propio paso de pruebas deja el job en rojo. |

**Respuesta a la pista (diapositivas 13 y 14):** en el ci.yml el color final lo decidía el paso 12 leyendo `TEST_RESULT`. En este pipeline lo decide directamente el paso de pruebas: como no tiene `continue-on-error`, un solo caso fallido detiene el job, y en un pipeline con despliegue el job `desplegar-produccion` (con `needs: pruebas-aceptacion`) quedaría omitido.

---

## Explicación paso a paso

```yaml
on:
  push:
    branches: [ 'main', 'develop' ]
  pull_request:
    branches: [ 'main', 'develop' ]
  workflow_dispatch:
```
Se ejecuta con cada push o pull request a `main` o `develop`, y a mano desde el botón **Run workflow** en Actions.

```yaml
permissions:
  contents: read
```
El token del pipeline solo puede leer el código. Es el principio de mínimo privilegio.

```yaml
jobs:
  pruebas-aceptacion:
    runs-on: ubuntu-latest
    timeout-minutes: 20
```
Un único job. GitHub crea una máquina Linux vacía y la detiene si pasa de 20 minutos, para no quedar colgado.

```yaml
- uses: actions/checkout@v5
- uses: actions/setup-node@v5
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
    cache-dependency-path: |
      app/package-lock.json
      pruebas/package-lock.json
```
`uses:` reutiliza acciones publicadas por GitHub. `checkout` baja el commit; `setup-node` instala Node y guarda en caché lo que descarga npm. Como hay dos `package-lock.json` (mono repo), se indican los dos.

```yaml
- working-directory: app
  run: npm ci
- working-directory: pruebas
  run: npm ci
```
`npm ci` instala **exactamente** lo que dice cada `package-lock.json`. Por eso los dos lock van en el repositorio. `working-directory` indica en qué carpeta se ejecuta.

```yaml
- working-directory: pruebas
  run: npx playwright install --with-deps chromium
```
Descarga Chromium y las librerías de Linux que necesita. Sin este paso, Playwright no puede abrir el navegador.

```yaml
- working-directory: app
  env:
    PORT: 3000
  run: npm start > app.log 2>&1 &
```
Enciende la app. El `&` la deja corriendo en segundo plano para que el pipeline siga con el siguiente paso; la salida se guarda en `app.log`.

```yaml
- run: |
    for intento in $(seq 1 30); do
      if curl -fs http://localhost:3000 > /dev/null; then exit 0; fi
      sleep 2
    done
    cat app/app.log
    exit 1
```
Pregunta a la app hasta 30 veces, cada 2 segundos. Si responde, sigue. Si no, muestra el log y detiene el pipeline. Evita el error `ECONNREFUSED` por probar antes de que la app esté lista.

```yaml
- working-directory: pruebas
  run: npx playwright test --grep @acceptanceTest
```
Ejecuta solo los casos con `@acceptanceTest` **en el título**. No tiene `continue-on-error`: si un caso falla, el job falla.

```yaml
- if: always()
  uses: actions/upload-artifact@v6
  with:
    name: playwright-report
    path: pruebas/playwright-report/
    retention-days: 30
```
Sube el reporte HTML (con los traces de los casos que fallaron) aunque las pruebas fallen. Se descarga desde la sección **Artifacts** de la ejecución.

---

## Versiones de las acciones

El `ci.yml` de la profesora usa `@v4`. Esas versiones corren en Node 20, y GitHub retiró Node 20 de sus runners el 23 de septiembre de 2026 ([changelog de GitHub](https://github.blog/changelog/2026-09-23-deprecation-of-node-20-on-github-actions-runners/)). Por eso se usa la **primera versión de cada acción que corre en Node 24**:

| Acción | ci.yml | pipeline.yml | Cambia el uso |
|---|---|---|---|
| `actions/checkout` | `@v4` | `@v5` | No |
| `actions/setup-node` (en lugar de `setup-java`) | — | `@v5` | No |
| `actions/upload-artifact` | `@v4` | `@v6` | No: mismos `name`, `path`, `retention-days` |

---

## Despliegue: requisitos 5 y 6

El material marca seis requisitos (diapositiva 16). Los requisitos 1 a 4 están implementados. Los requisitos 5 y 6 **no van en el pipeline a propósito**:

> *"Recuerden que para este ejercicio no vamos a llegar hasta el despliegue en el webhosting (Render). Solo vamos a ejecutar la aplicación, luego las pruebas y si las pruebas pasan finaliza el pipeline exitoso."* (diapositivas *Ninguna versión llega a producción…* y *Requisito 6*)
>
> *"No se llega al despliegue en Render. Por eso no hay deploy hook, secretos de Render, `environment` de producción ni job de despliegue."* (instrucciones del taller, sección 2)

| Requisito | Estado | Dónde |
|---|---|---|
| 1 · Mono repo | ✅ | `app/`, `pruebas/` y `.github/workflows/` en la raíz |
| 2 · Playwright en JavaScript | ✅ | `pruebas/package.json` con `"type": "module"`, `package-lock.json`, Chromium en el pipeline |
| 3 · webServer | ✅ | `pruebas/playwright.config.js` |
| 4 · @acceptanceTest | ✅ | 11 casos con la etiqueta en el título; el pipeline usa `--grep @acceptanceTest` |
| 5 · needs e if | ➖ No aplica | No hay job de despliegue que dependa del de pruebas |
| 6 · Secreto y environment | ➖ No aplica | No hay deploy hook ni secretos de Render |

**Cómo se completaría si sí se pasara a producción** (solo para entender, no está en el archivo): se agregaría un segundo job `desplegar-produccion` con `needs: pruebas-aceptacion` y `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`, `environment: produccion`, y un paso `curl -fsS -X POST "$RENDER_DEPLOY_HOOK"` con la URL guardada en *Settings › Secrets and variables › Actions*. Con `needs`, si un `@acceptanceTest` falla, ese job aparece **omitido** y nada llega a producción.

---

## `webServer` en `pruebas/playwright.config.js`

```js
webServer: {
  command: 'npm start',
  cwd: '../app',
  url: 'http://localhost:3000',
  reuseExistingServer: true,
},
```

- `cwd: '../app'` se calcula desde la carpeta de `playwright.config.js` (`pruebas/`).
- **`reuseExistingServer: true`**: si la app ya responde en el puerto 3000 (porque el pipeline la levantó, o porque la tienes encendida), Playwright la reutiliza en vez de intentar iniciar otra en el mismo puerto.
- Si la app está apagada (por ejemplo en tu computador), Playwright la enciende con `npm start` y la apaga al terminar.

> **Diferencia con la diapositiva 19:** allí aparece `reuseExistingServer: !process.env.CI`, donde en GitHub es Playwright quien enciende la app. Las instrucciones del taller piden que **el pipeline** levante la app y espere el puerto, así que se usa `true`. Con `false` habría dos servidores intentando usar el puerto 3000 y el pipeline fallaría.

---

## Lista de verificación (instrucciones del taller, sección 6)

- [x] El workflow está en `.github/workflows/pipeline.yml`, en la raíz del repositorio.
- [x] Carpeta de pruebas: `pruebas/`.
- [x] `pruebas/package.json` tiene `"type": "module"`.
- [x] Hay `package-lock.json` en `app/` y en `pruebas/`, y el workflow usa `npm ci`.
- [x] El job levanta la app en el puerto 3000 y espera a que responda antes de las pruebas.
- [x] `playwright.config.js` tiene `webServer` con `reuseExistingServer: true`.
- [x] Los casos de aceptación llevan `@acceptanceTest` en el título.
- [x] El job ejecuta `npx playwright test --grep @acceptanceTest`.
- [x] El job **no** tiene `continue-on-error`.
- [x] El reporte se sube como artifact con `if: always()`.
- [x] `node_modules/` y los reportes están en `.gitignore`.
- [ ] Se probó un fallo a propósito en GitHub y el pipeline quedó en rojo. **(Lo haces tú: ver README, paso 6.)**

## Preguntas que puede hacer la profesora

1. **¿Qué pasa si falla un `@acceptanceTest`?** El paso de pruebas termina con código 1, el job queda en rojo y, en un escenario con despliegue, no llegaría a producción.
2. **¿Por qué el caso del bug no tiene `@acceptanceTest`?** Porque falla mientras el bug exista y bloquearía siempre el pipeline. Se etiqueta `@bug` y se corre a mano.
3. **¿Por qué `npm ci` y no `npm install`?** `npm ci` respeta el lock y no lo modifica: en GitHub se instala lo mismo que en tu computador.
4. **¿Por qué `if: always()` en el reporte?** Sin eso, el paso se omite cuando las pruebas fallan, justo cuando más se necesita el reporte.
5. **¿Por qué esperar el puerto?** Si las pruebas empiezan antes de que la app responda, fallan con `ECONNREFUSED` aunque la app esté bien.
