const { Router } = require('express');
const { getAllEstudiantes } = require('../controllers/estudiantes.controller');
const router = Router();

//obtener todas las categorias
router.get('/estudiantes', getAllEstudiantes);

module.exports = router;