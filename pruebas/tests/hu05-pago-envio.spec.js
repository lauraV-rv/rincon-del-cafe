import { test, expect } from '../fixtures/pago.js';
import {
  productos,
  datosEnvio,
  datosEnvioSinPropina,
  datosEnvioVacios,
  casosCamposObligatorios,
  costoEnvio,
  resumenEsperado,
  totalesEsperados,
  mensajes,
  estadosPedido,
} from '../data/datosPedido.js';

// HU-05 · Pago y envío
// Como cliente, quiero ver el total con impuesto y envío antes de confirmar
// para saber cuánto pagaré.
//
// Etiquetas:
//   @acceptanceTest → criterios que hoy se cumplen. Bloquean el pipeline.
//   @bug            → detectan el bug inyectado. Fallan a propósito y NO van en el pipeline.

test.describe('HU-05 · Pago y envío', () => {
  // ---------- Ver el total antes de confirmar ----------

  test('CP01 muestra el total en estado borrador antes de confirmar @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();

    await expect(paginaPago.mensaje).toHaveText(mensajes.totalCalculado);
    await expect(paginaPago.estado).toHaveText(estadosPedido.borrador);
    await expect(paginaPago.total).toBeVisible();
  });

  test('CP02 el resumen muestra el subtotal del carrito @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();

    await expect(paginaPago.subtotal).toHaveText(`Subtotal: ${productos.latte.subtotal}`);
  });

  // ---------- Criterio 1: el envío cuesta $5.000 ----------

  test('CP03 el envío cuesta $5.000 @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();

    await expect(paginaPago.envio).toHaveText(resumenEsperado.envio);
  });

  // ---------- Criterio 3: total = subtotal + envío + impuesto + propina ----------

  test('CP04 la propina ingresada aparece en el resumen @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();

    await expect(paginaPago.propinaResumen).toHaveText(resumenEsperado.propina);
  });

  test('CP05 el total es la suma de subtotal, envío, impuesto y propina @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();
    await expect(paginaPago.total).toBeVisible();

    const resumen = await paginaPago.leerResumen();
    expect(resumen.total).toBe(resumen.subtotal + resumen.envio + resumen.impuesto + resumen.propina);
  });

  test('CP06 sin propina el total es subtotal + envío + impuesto @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvioSinPropina);
    await paginaPago.calcularTotal();
    await expect(paginaPago.propinaResumen).toHaveText(resumenEsperado.propinaCero);

    const resumen = await paginaPago.leerResumen();
    expect(resumen.envio).toBe(costoEnvio);
    expect(resumen.total).toBe(resumen.subtotal + resumen.envio + resumen.impuesto);
  });

  // ---------- Criterio 4: dirección, ciudad y método de pago son obligatorios ----------
  // CP07 dirección · CP08 ciudad · CP09 método de pago

  casosCamposObligatorios.forEach(({ campo, datos }, indice) => {
    const id = `CP0${7 + indice}`;

    test(`${id} no calcula el total si falta ${campo} @acceptanceTest`, async ({ paginaPago }) => {
      await paginaPago.completarDatos(datos);
      await paginaPago.calcularTotal();

      await expect(paginaPago.mensaje).toHaveText(mensajes.camposObligatorios);
      await expect(paginaPago.total).toHaveCount(0);
    });
  });

  test('CP10 no confirma el pedido si faltan los datos obligatorios @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvioVacios);
    await paginaPago.confirmarPedido();

    await expect(paginaPago.mensaje).toHaveText(mensajes.camposObligatorios);
    await expect(paginaPago.estado).toHaveCount(0);
  });

  // ---------- Confirmación del pedido ----------

  test('CP11 confirma el pedido cuando los datos están completos @acceptanceTest', async ({ paginaPago }) => {
    await paginaPago.completarDatos(datosEnvio);
    await paginaPago.calcularTotal();
    await expect(paginaPago.estado).toHaveText(estadosPedido.borrador);

    await paginaPago.confirmarPedido();

    await expect(paginaPago.mensaje).toHaveText(mensajes.pedidoEnviado);
    await expect(paginaPago.estado).toHaveText(estadosPedido.enviado);
  });

  // ---------- Caso borde (no está en los criterios; se corre a mano) ----------

  test.describe('con el carrito vacío', () => {
    test.use({ productoDelPedido: null });

    test('CP12 no calcula el total si el carrito está vacío', async ({ paginaPago }) => {
      await paginaPago.completarDatos(datosEnvio);
      await paginaPago.calcularTotal();

      await expect(paginaPago.mensaje).toHaveText(mensajes.carritoVacio);
      await expect(paginaPago.total).toHaveCount(0);
    });
  });

  // ---------- Criterio 2: impuesto = 19% de (subtotal + envío) → BUG ----------
  // La app calcula el impuesto solo sobre el subtotal. Estos casos fallan
  // hasta que se corrija el bug. Se prueba con dos productos para mostrar
  // que no es una coincidencia de un solo valor.

  totalesEsperados.forEach(({ producto, impuesto, total }, indice) => {
    test.describe(`con 1 ${producto.nombre} en el carrito`, () => {
      test.use({ productoDelPedido: producto });

      test(`BUG0${indice + 1} el impuesto es el 19% del subtotal más el envío (${producto.nombre}) @bug`, async ({ paginaPago }) => {
        await paginaPago.completarDatos(datosEnvio);
        await paginaPago.calcularTotal();

        // expect.soft: reporta las dos diferencias (impuesto y total) en la misma ejecución.
        await expect.soft(paginaPago.impuesto).toHaveText(impuesto);
        await expect.soft(paginaPago.total).toHaveText(total);
      });
    });
  });
});
