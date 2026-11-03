# Evidencias del pipeline

Guarda aquí las capturas de la pestaña **Actions** de GitHub:

| Archivo sugerido | Qué debe mostrar |
|---|---|
| `01-pipeline-verde-main.png` | Ejecución de `main` en verde con el job `pruebas-aceptacion` |
| `02-pasos-del-job.png` | Los pasos del job abiertos (instalación, app levantada, 11 pruebas pasadas) |
| `03-artifact-reporte.png` | La sección **Artifacts** con `playwright-report` |
| `04-bloqueo-rojo-develop.png` | Ejecución de `develop` en rojo por el fallo a propósito en CP03 |
| `05-bloqueo-corregido-verde.png` | La ejecución siguiente de `develop` en verde |
| `06-bug-local.png` | Terminal con `npm run test:bug`: impuesto esperado `$3230`, recibido `$2280` |
