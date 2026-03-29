function esperar(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function ejecutar() {
  await esperar(1000);
  console.log("Paso 1");

  await esperar(1000);
  console.log("Paso 2");

  await esperar(1000);
  console.log("Paso 3");
}

ejecutar();