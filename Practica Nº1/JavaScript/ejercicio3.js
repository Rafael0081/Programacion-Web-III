function miFuncion(arr) {
    let resultado = {
        pares: [],
        impares: []
    };

    for (let num of arr) {
        if (num % 2 === 0) {
            resultado.pares.push(num);
        } else {
            resultado.impares.push(num);
        }
    }

    return resultado;
}
console.log(miFuncion([1,2,3,4,5]));