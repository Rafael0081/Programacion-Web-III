function miFuncion(cadena) {
    let invertida = cadena.split("").reverse().join("");
    return cadena === invertida;
}
console.log(miFuncion("oruro")); 
console.log(miFuncion("hola"));  