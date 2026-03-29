// Ejercicio 16: Consulta de clima con promesas
function consultarClima(ciudad) {
    return fetch(`https://api.clima.com/v1/${ciudad}`)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Ciudad no encontrada");
            return respuesta.json();
        })
        .then(datos => {
            console.log(`El clima en ${ciudad} es de ${datos.temperatura}°C`);
            return datos.temperatura;
        })
        .catch(error => {
            console.error("Error al consultar el clima:", error.message);
        });
}
//con sync/await, el código se ve así:
async function consultarClimaAsync(ciudad) {
    try {
        const respuesta = await fetch(`https://api.clima.com/v1/${ciudad}`);
        
        if (!respuesta.ok) {
            throw new Error("Ciudad no encontrada");
        }
        
        const datos = await respuesta.json();
        console.log(`El clima en ${ciudad} es de ${datos.temperatura}°C`);
        return datos.temperatura;
        
    } catch (error) {
        // El bloque catch captura tanto errores de red como los lanzados por "throw"
        console.error("Error al consultar el clima:", error.message);
    }
}