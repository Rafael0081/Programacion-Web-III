// Función antigua basada en Callback
function operacionAntigua(parametro, callback) {
    setTimeout(() => {
        if (parametro === 'ok') {
            callback(null, "Operación exitosa");
        } else {
            callback(new Error("Parámetro inválido"));
        }
    }, 1000);
}

// Envoltura para convertirla en Promesa
function operacionPromisificada(parametro) {
    return new Promise((resolve, reject) => {
        operacionAntigua(parametro, (error, resultado) => {
            if (error) {
                reject(error); 
            } else {
                resolve(resultado); 
            }
        });
    });
}

// Uso moderno:
operacionPromisificada('ok')
    .then(res => console.log(res))
    .catch(err => console.error(err));