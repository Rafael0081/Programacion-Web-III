const express = require('express');
const app = express();

app.use(express.json());

const categoriaRoutes = require('./routes/categorias');
app.use('/categorias', categoriaRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});