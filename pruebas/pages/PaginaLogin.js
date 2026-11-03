// Pantalla de inicio de sesión.
export class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.correo = page.getByLabel('Correo');
    this.clave = page.getByLabel('Contraseña');
    this.botonIngresar = page.getByRole('button', { name: 'Iniciar sesión' });
    // Botones del menú que aparecen solo después de iniciar sesión.
    this.botonCarrito = page.getByRole('button', { name: 'Carrito', exact: true });
    this.botonPagoYEnvio = page.getByRole('button', { name: 'Pago y envío' });
  }

  async ir() {
    await this.page.goto('/');
  }

  async iniciarSesion(correo, clave) {
    await this.correo.fill(correo);
    await this.clave.fill(clave);
    await this.botonIngresar.click();
  }
}
