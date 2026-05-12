import { Router } from 'express';
import { getAllEstudiantes, createEstudiante, activarDesactivarEstudianteByID, updateEstudianteByID } from '../controllers/estudiantes.controller.js';
const router = Router();

//obtener todas las categorias
router.get('/estudiantes', getAllEstudiantes);
router.post('/estudiantes', createEstudiante);
router.patch('/estudiantes/:id', updateEstudianteByID);
router.post('/estudiantes/:id', activarDesactivarEstudianteByID);
export default router;