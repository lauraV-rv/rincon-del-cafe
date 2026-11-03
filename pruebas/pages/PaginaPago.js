// Pantalla "Pago y envío" (HU-05).
export class PaginaPago {
  constructor(page) {
    this.botonMenu = page.getByRole('button', { name: 'Pago y envío' });
    this.encabezado = page.getByRole('heading', { name: 'Pago y envío' });

    // Formulario
    this.direccion = page.getByLabel('Dirección');
    this.ciudad = page.getByLabel('Ciudad');
    this.metodoPago = page.getByLabel('Método de pago');
    this.propina = page.getByLabel('Propina');
    this.botonCalcularTotal = page.getByRole('button', { name: 'Calcular total' });
    this.botonConfirmarPedido = page.getByRole('button', { name: 'Confirmar pedido' });

    // Resumen que aparece después de calcular o confirmar.
    // Estado, impuesto y total tienen data-testid; el resto se ubica por su texto visible.
    this.estado = page.getByTestId('estado-pago');
    this.subtotal = page.getByText(/^Subtotal: \$/);
    this.envio = page.getByText(/^Envío: \$/);
    this.impuesto = page.getByTestId('impuesto');
    this.propinaResumen = page.getByText(/^Propina: \$/);
    this.total = page.getByTestId('total-pago');

    // Mensaje de la app (éxito o error).
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.botonMenu.click();
  }

  async completarDatos(datos) {
    await this.direccion.fill(datos.direccion);
    await this.ciudad.fill(datos.ciudad);
    await this.metodoPago.selectOption(datos.metodoPago);
    await this.propina.fill(datos.propina);
  }

  async calcularTotal() {
    await this.botonCalcularTotal.click();
  }

  async confirmarPedido() {
    await this.botonConfirmarPedido.click();
  }

  // Lee los importes del resumen como números, por ejemplo "Envío: $5000" → 5000.
  async leerResumen() {
    const aNumero = async (localizador) => Number((await localizador.innerText()).replace(/\D/g, ''));
    return {
      subtotal: await aNumero(this.subtotal),
      envio: await aNumero(this.envio),
      impuesto: await aNumero(this.impuesto),
      propina: await aNumero(this.propinaResumen),
      total: await aNumero(this.total),
    };
  }
}
