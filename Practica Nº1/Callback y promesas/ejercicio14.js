// Función moderna que devuelve una Promesa
function obtenerDatosPromesa() {
    return Promise.resolve({ id: 1, mensaje: "Datos listos" });
}

// Envoltura para adaptarla a un Callback
function obtenerDatosCallback(callback) {
    obtenerDatosPromesa()
        .then(datos => callback(null, datos)) 
        .catch(error => callback(error, null)); 
}

// Uso:
obtenerDatosCallback((err, datos) => {
    if (err) {
        return console.error("Falló:", err);
    }
    console.log("Éxito:", datos);
});