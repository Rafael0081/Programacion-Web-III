const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// Ejercicio 1: POST /categorias
router.post('/', categoriaController.crearCategoria);

// Ejercicio 2: GET /categorias
router.get('/', categoriaController.obtenerCategorias);

// Ejercicio 3: GET /categorias/:id
router.get('/:id', categoriaController.obtenerCategoriaConProductos);

// Ejercicio 4: PATCH /categorias/:id
router.patch('/:id', categoriaController.actualizarCategoria);

// Ejercicio 5: DELETE /categorias/:id
router.delete('/:id', categoriaController.eliminarCategoria);

module.exports = router;