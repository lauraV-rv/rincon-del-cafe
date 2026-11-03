# Historias de usuario: El Rincón del Café

Para todas las historias, primero inicia sesión con tu cuenta de práctica:
`estudiante1@cafe.test` (hasta `estudiante16@cafe.test`), contraseña `Cafe2026`.
El inicio de sesión no forma parte de las historias.

---

## HU-01 · Registro

**Como** visitante, **quiero** registrarme con mi correo **para** crear una cuenta.

**Criterios de aceptación:**
- Si el correo no tiene "@", la app muestra "El correo no es válido" y no crea la cuenta.
- Si las contraseñas no coinciden, la app muestra "Las contraseñas no coinciden".
- Al escribir la contraseña se muestra su nivel de fortaleza: 1 punto por cada requisito cumplido (8 o más caracteres, una mayúscula, un número y un símbolo).

---

## HU-02 · Catálogo

**Como** cliente, **quiero** filtrar productos por precio máximo **para** ver solo lo que puedo pagar.

**Criterios de aceptación:**
- Solo aparecen productos con precio menor o igual al precio máximo indicado.
- El número de resultados coincide con la cantidad de productos que se muestran.
- Un precio máximo de 0 o negativo muestra un error.

---

## HU-03 · Carrito

**Como** cliente, **quiero** agregar productos con su cantidad **para** ver cuánto suman.

**Criterios de aceptación:**
- El subtotal de cada producto es su precio multiplicado por la cantidad.
- El subtotal del carrito es la suma de los subtotales de sus productos.
- La cantidad solo acepta valores entre 1 y 10. Fuera de ese rango, la app muestra un error.
- El estado del carrito pasa de "vacío" a "con productos" al agregar algo.

---

## HU-04 · Cupones

**Como** cliente, **quiero** aplicar un cupón **para** ver el descuento.

**Criterios de aceptación:**
- El descuento es el subtotal multiplicado por el porcentaje del cupón.
- Un cupón vencido no se aplica y la app muestra "El cupón está vencido".
- Un cupón que el cliente ya usó muestra un error.

---

## HU-05 · Pago y envío

**Como** cliente, **quiero** ver el total con impuesto y envío antes de confirmar **para** saber cuánto pagaré.

**Criterios de aceptación:**
- El envío cuesta $5.000.
- El impuesto es el 19% de la suma del subtotal más el envío.
- El total es subtotal + envío + impuesto + propina.
- Dirección, ciudad y método de pago son obligatorios.

---

## HU-06 · Reserva de mesa

**Como** cliente, **quiero** reservar una mesa solo si hay lugares **para** no reservar de más.

**Criterios de aceptación:**
- Los lugares disponibles son 8 menos las personas ya reservadas en ese horario.
- Si las personas superan los lugares disponibles, la app muestra "Solo quedan X lugares" y no reserva.
- Al cancelar una reserva, sus lugares vuelven a estar disponibles.

---

## HU-07 · Reseñas

**Como** cliente, **quiero** ver el promedio de las reseñas **para** saber qué tan bien califican los clientes.

**Criterios de aceptación:**
- El promedio solo incluye reseñas publicadas.
- Ocultar una reseña la quita del promedio.
- La calificación es obligatoria y va de 1 a 5.

---

## HU-08 · Favoritos

**Como** cliente, **quiero** quitar un favorito específico **para** conservar los demás.

**Criterios de aceptación:**
- Al quitar un favorito, desaparece ese favorito y los demás se mantienen.
- Cada cliente puede tener máximo 20 favoritos. Al llegar a 20, la app muestra "Máximo 20 favoritos".
- La prioridad solo puede ser alta, media o baja.

---

## HU-09 · Programa de puntos

**Como** cliente, **quiero** acumular puntos por mis compras **para** canjearlos después.

**Criterios de aceptación:**
- Cada $1.000 de compra da 1 punto. Las fracciones no suman punto.
- Solo puedo canjear hasta mi saldo. Si pido más, la app muestra "No tienes suficientes puntos".
- Para practicar, usa los códigos de cliente `CLI001` o `CLI002`.

---

## HU-10 · Historial de pedidos

**Como** cliente, **quiero** consultar mis pedidos entre dos fechas **para** revisar mis compras.

**Criterios de aceptación:**
- Solo muestra pedidos cuya fecha está entre "desde" y "hasta", ambas incluidas.
- Si "desde" es posterior a "hasta", la app muestra un error y no muestra resultados.
- El total gastado no incluye los pedidos cancelados.
