// Datos de prueba de la HU-05 · Pago y envío.
// Los precios salen de app/data/seed.json. Se usa cantidad 1 en todos los casos.

// ---------- Productos que se agregan al carrito ----------
export const productos = {
  latte: { nombre: 'Latte', cantidad: '1', subtotal: '$12000' },
  espresso: { nombre: 'Espresso', cantidad: '1', subtotal: '$8000' },
};

// ---------- Datos del formulario de pago ----------
export const datosEnvio = {
  direccion: 'Calle 45 #12-56',
  ciudad: 'Cali',
  metodoPago: 'efectivo',
  propina: '500',
};

export const datosEnvioSinPropina = { ...datosEnvio, propina: '0' };

// Un caso por cada campo obligatorio (criterio 4).
export const casosCamposObligatorios = [
  { campo: 'la dirección', datos: { ...datosEnvio, direccion: '' } },
  { campo: 'la ciudad', datos: { ...datosEnvio, ciudad: '' } },
  { campo: 'el método de pago', datos: { ...datosEnvio, metodoPago: '' } },
];

export const datosEnvioVacios = { direccion: '', ciudad: '', metodoPago: '', propina: '0' };

// ---------- Valores esperados según los criterios de aceptación ----------
export const costoEnvio = 5000;

export const resumenEsperado = {
  envio: 'Envío: $5000',
  propina: 'Propina: $500',
  propinaCero: 'Propina: $0',
};

// impuesto = 19% × (subtotal + envío)
// total    = subtotal + envío + impuesto + propina (propina = $500)
export const totalesEsperados = [
  {
    producto: productos.latte,
    impuesto: '$3230', // 0,19 × (12.000 + 5.000) = 3.230
    total: '$20730', // 12.000 + 5.000 + 3.230 + 500
  },
  {
    producto: productos.espresso,
    impuesto: '$2470', // 0,19 × (8.000 + 5.000) = 2.470
    total: '$15970', // 8.000 + 5.000 + 2.470 + 500
  },
];

// ---------- Mensajes y estados que muestra la app ----------
export const mensajes = {
  totalCalculado: 'Total calculado',
  camposObligatorios: 'Dirección, ciudad y método de pago son obligatorios',
  carritoVacio: 'El carrito está vacío',
  pedidoEnviado: /^Pedido #\d+ enviado$/,
};

export const estadosPedido = {
  borrador: 'borrador',
  enviado: 'enviado',
};
