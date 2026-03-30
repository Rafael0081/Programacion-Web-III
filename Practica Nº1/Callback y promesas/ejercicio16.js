// Ejemplo de uso de promesas para procesar un pago
function procesarPago() {
  return verificarSaldo()
    .then(saldo => {
      console.log("Saldo verificado:", saldo);
      return descontarFondos();
    })
    .then(recibo => {
      console.log("Pago exitoso:", recibo);
      return recibo;
    })
    .catch(error => {
      console.error("Fallo en la transacción:", error);
    });
}
//con sync/await, el código se ve así:
async function procesarPago() {
  try {
    const saldo = await verificarSaldo();
    console.log("Saldo verificado:", saldo);
    
    const recibo = await descontarFondos();
    console.log("Pago exitoso:", recibo);
    
    return recibo;
  } catch (error) {
    console.error("Fallo en la transacción:", error);
  }
}
