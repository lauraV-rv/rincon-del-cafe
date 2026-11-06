# Casos de prueba · HU-05 Pago y envío

**Como** cliente, **quiero** ver el total con impuesto y envío antes de confirmar **para** saber cuánto pagaré.

**Criterios de aceptación**

| # | Criterio |
|---|---|
| C1 | El envío cuesta $5.000. |
| C2 | El impuesto es el 19% de la suma del subtotal más el envío. |
| C3 | El total es subtotal + envío + impuesto + propina. |
| C4 | Dirección, ciudad y método de pago son obligatorios. |

**Precondición de todos los casos** (fixture `paginaPago`): sesión iniciada con la cuenta de práctica, carrito vaciado, 1 Latte ($12.000) agregado y carrito confirmado, pantalla *Pago y envío* abierta.

**Datos base** (`data/datosPedido.js`): dirección `Calle 45 #12-56`, ciudad `Cali`, método `efectivo`, propina `500`.

---

## Matriz de casos

| ID | Criterio | Caso | Datos | Resultado esperado | Etiqueta | Resultado con la app actual |
|---|---|---|---|---|---|---|
| CP01 | Historia | Muestra el total en estado borrador antes de confirmar | Datos base | Mensaje "Total calculado", estado `borrador`, total visible | `@acceptanceTest` |  Pasa |
| CP02 | C3 | El resumen muestra el subtotal del carrito | Datos base | `Subtotal: $12000` | `@acceptanceTest` |  Pasa |
| CP03 | C1 | El envío cuesta $5.000 | Datos base | `Envío: $5000` | `@acceptanceTest` |  Pasa |
| CP04 | C3 | La propina ingresada aparece en el resumen | Propina 500 | `Propina: $500` | `@acceptanceTest` |  Pasa |
| CP05 | C3 | El total es la suma de subtotal, envío, impuesto y propina | Datos base | total = subtotal + envío + impuesto + propina (con los valores que muestra la app) | `@acceptanceTest` |  Pasa |
| CP06 | C1, C3 | Sin propina el total es subtotal + envío + impuesto | Propina 0 | `Propina: $0`, envío 5000, total = subtotal + envío + impuesto | `@acceptanceTest` |  Pasa |
| CP07 | C4 | No calcula el total si falta la dirección | Dirección vacía | Mensaje "Dirección, ciudad y método de pago son obligatorios"; no aparece el total | `@acceptanceTest` |  Pasa |
| CP08 | C4 | No calcula el total si falta la ciudad | Ciudad vacía | Mismo mensaje; no aparece el total | `@acceptanceTest` |  Pasa |
| CP09 | C4 | No calcula el total si falta el método de pago | Método "Selecciona" | Mismo mensaje; no aparece el total | `@acceptanceTest` |  Pasa |
| CP10 | C4 | No confirma el pedido si faltan los datos obligatorios | Todo vacío, clic en *Confirmar pedido* | Mismo mensaje; no se crea el pedido | `@acceptanceTest` |  Pasa |
| CP11 | Historia | Confirma el pedido cuando los datos están completos | Datos base, calcular y confirmar | Mensaje "Pedido #N enviado", estado `enviado` | `@acceptanceTest` |  Pasa |
| CP12 | Borde | No calcula el total si el carrito está vacío | Carrito vacío | Mensaje "El carrito está vacío"; no aparece el total | *(sin etiqueta, se corre a mano)* |  Pasa |
| BUG01 | **C2** | El impuesto es el 19% del subtotal más el envío (Latte) | 1 Latte $12.000, propina 500 | Impuesto `$3230`, total `$20730` | `@bug` |  **Falla**: muestra `$2280` y `$19780` |
| BUG02 | **C2** | El impuesto es el 19% del subtotal más el envío (Espresso) | 1 Espresso $8.000, propina 500 | Impuesto `$2470`, total `$15970` | `@bug` |  **Falla**: muestra `$1520` y `$15020` |

Además existe un caso de verificación básica fuera de la HU: `el usuario logueado ve el menú de la tienda @smoketest` (tests/login.spec.js).

**Total:** 15 casos → 11 `@acceptanceTest` (bloquean el pipeline), 2 `@bug`, 1 caso borde y 1 `@smoketest`.

### Por qué los casos del bug no llevan `@acceptanceTest`

Según el material de despliegue (diapositiva 16, requisito 4): *solo los casos con `@acceptanceTest` bloquean la salida a producción, porque los casos que tienen bug harían fallar la ejecución del pipeline.* Los casos `@bug` siguen existiendo y se corren a mano con `npm run test:bug`. Cuando el bug se corrija, se cambia `@bug` por `@acceptanceTest` y pasan a proteger el pipeline (prueba de confirmación y luego de regresión).

### Comprobación de que los casos están bien construidos

| Ejecución | Comando | Resultado |
|---|---|---|
| Todo menos `@bug` (app de la profesora) | `npm test` | 13 de 13 pasan |
| Solo `@acceptanceTest` (lo que corre el pipeline) | `npm run test:aceptacion` | 11 de 11 pasan |
| Solo `@bug` | `npm run test:bug` | **2 fallan**: el bug se detecta |
| Suite completa | `npm run test:todo` | 13 pasan, 2 fallan |
| Suite completa con la app sin bugs (`MODO_REFERENCIA=true npm start`) | `npm run test:todo` | 15 de 15 pasan |

La app de la profesora **no se modificó**: el bug sigue ahí y por eso los casos `@bug` fallan. La última fila solo sirve para comprobar que esos casos fallan **por el bug** y no por un error de la prueba: con la versión de referencia (sin bugs) pasan.

---

## Nivel y tipo de prueba (ISTQB CTFL v4.0)

| Concepto | En este taller |
|---|---|
| **Nivel** | Prueba de **aceptación**: verifica los criterios del negocio de la HU-05 y decide si la versión está lista. Se marca con `@acceptanceTest` y bloquea el pipeline. |
| **Herramienta / capa de la pirámide** | Interfaz (E2E) con Playwright: pocas pruebas, enfocadas en un flujo de dinero (pago), que es un flujo crítico. |
| **Tipo** | Funcional y de caja negra: se comprueba lo que dice la especificación sin mirar el código. |
| **Casos `@bug`** | Cuando se corrija el bug, se repiten como prueba de **confirmación** y luego quedan como **regresión** (se cambia `@bug` por `@acceptanceTest`). |
| **`@smoketest`** | Enfoque de verificación básica (no es nivel ni tipo): la app arranca y deja iniciar sesión. |
| **Shift left** | Los criterios de aceptación se convirtieron en casos antes de tocar el código, y el pipeline los ejecuta en cada push y pull request. |

---

## Reporte del bug

| Campo | Detalle |
|---|---|
| **Título** | El impuesto se calcula sobre el subtotal sin incluir el envío |
| **Historia** | HU-05 · Pago y envío, criterio C2 |
| **Severidad** | Alta: el cliente ve y paga un total menor al correcto (falta el 19% de $5.000 = $950 en cada pedido) |
| **Pasos para reproducir** | 1. Iniciar sesión con `estudiante1@cafe.test` / `Cafe2026`. 2. Carrito → vaciar, agregar 1 Latte, confirmar. 3. Pago y envío → dirección `Calle 45 #12-56`, ciudad `Cali`, método `efectivo`, propina `500`. 4. Clic en *Calcular total*. |
| **Resultado esperado** | Impuesto = 19% × (12.000 + 5.000) = **$3.230**. Total = 12.000 + 5.000 + 3.230 + 500 = **$20.730** |
| **Resultado obtenido** | Impuesto = **$2.280** (19% × 12.000). Total = **$19.780** |
| **Diferencia** | $950 = 19% × $5.000: el envío no entra en la base del impuesto |
| **Evidencia** | Casos BUG01 y BUG02 (`npm run test:bug`), trace en `test-results/` y reporte HTML (`npm run reporte`) |
| **Caso que lo detecta** | `BUG01 el impuesto es el 19% del subtotal más el envío (Latte) @bug` |
