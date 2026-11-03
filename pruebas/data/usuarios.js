// Cuenta de práctica (estudiante1 … estudiante16, contraseña Cafe2026).
// Cambia el número por el que te asignaron o usa la variable de entorno CORREO_PRUEBA.
export const usuarioDePrueba = {
  correo: process.env.CORREO_PRUEBA || 'estudiante1@cafe.test',
  clave: process.env.CLAVE_PRUEBA || 'Cafe2026',
};
