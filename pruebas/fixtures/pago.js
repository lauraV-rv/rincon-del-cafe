import { test as testConLogin, expect } from './login.js';
import { PaginaCarrito } from '../pages/PaginaCarrito.js';
import { PaginaPago } from '../pages/PaginaPago.js';
import { productos } from '../data/datosPedido.js';

export const test = testConLogin.extend({
  // Producto que se pone en el carrito antes de pagar.
  // Una prueba lo cambia con test.use({ productoDelPedido: ... }).
  // Con null, el carrito queda vacío.
  productoDelPedido: [productos.latte, { option: true }],

  // Deja abierta la pantalla "Pago y envío" con un carrito conocido.
  // Vaciar primero hace que cada prueba sea independiente de las anteriores.
  paginaPago: async ({ paginaLogueada: page, productoDelPedido }, use) => {
    const carrito = new PaginaCarrito(page);
    await carrito.ir();
    await carrito.vaciar();
    await expect(carrito.mensaje).toHaveText('Carrito vacío');

    if (productoDelPedido) {
      await carrito.agregarProducto(productoDelPedido.nombre, productoDelPedido.cantidad);
      await expect(carrito.mensaje).toHaveText('Producto agregado');
      await carrito.confirmar();
      await expect(carrito.mensaje).toHaveText('Carrito confirmado');
    }

    const pago = new PaginaPago(page);
    await pago.ir();
    await expect(pago.encabezado).toBeVisible();

    await use(pago);
  },
});

export { expect };
