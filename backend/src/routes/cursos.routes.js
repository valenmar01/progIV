import { Router } from 'express';
import { getAllCursos } from '../controllers/cursos.controller.js';
const router = Router();

//obtener todas las categorias
router.get('/cursos', getAllCursos);
// router.post('/estudiantes', createEstudiante);
// router.patch('/estudiantes/:id', updateEstudianteByID);
// router.post('/estudiantes/:id', activarDesactivarEstudianteByID);
export default router;


