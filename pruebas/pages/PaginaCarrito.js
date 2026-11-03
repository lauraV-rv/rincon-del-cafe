// Pantalla "Carrito". Se usa solo para preparar el pedido antes de pagar.
export class PaginaCarrito {
  constructor(page) {
    this.botonMenu = page.getByRole('button', { name: 'Carrito', exact: true });
    this.producto = page.getByLabel('Producto');
    this.cantidad = page.getByLabel('Cantidad');
    this.botonAgregar = page.getByRole('button', { name: 'Agregar al carrito' });
    this.botonConfirmar = page.getByRole('button', { name: 'Confirmar carrito' });
    this.botonVaciar = page.getByRole('button', { name: 'Vaciar carrito' });
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.botonMenu.click();
  }

  async vaciar() {
    await this.botonVaciar.click();
  }

  async agregarProducto(nombre, cantidad) {
    await this.producto.selectOption({ label: nombre });
    await this.cantidad.fill(cantidad);
    await this.botonAgregar.click();
  }

  async confirmar() {
    await this.botonConfirmar.click();
  }
}
