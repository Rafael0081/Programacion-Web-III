//antes de usar promesas, el código con callbacks se veia asi:
const fs = require('fs');
function procesarArchivoCallback() {
    fs.readFile('entrada.txt', 'utf8', (err, data) => {
        if (err) return console.error("Error al leer:", err);
        
        const procesado = data.toUpperCase();
        
        fs.writeFile('salida.txt', procesado, (err) => {
            if (err) return console.error("Error al escribir:", err);
            console.log('Archivo procesado y guardado con éxito.');
        });
    });
}
//con sync/await y promesas, el codigo se ve asi:

const fs = require('fs').promises;
async function procesarArchivoAsync() {
    try {
        const data = await fs.readFile('entrada.txt', 'utf8');
        const procesado = data.toUpperCase();
        await fs.writeFile('salida.txt', procesado);
        console.log('Archivo procesado y guardado con éxito.');
    } catch (err) {
        console.error("Ocurrió un error en el proceso:", err);
    }
}
