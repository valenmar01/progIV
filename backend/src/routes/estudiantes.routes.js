import { Router } from 'express';
import { getAllEstudiantes, getEstudianteByID, createEstudiante, activarDesactivarEstudianteByID, updateEstudianteByID } from '../controllers/estudiantes.controller.js';
const router = Router();


router.get('/estudiantes', getAllEstudiantes);
router.get('/estudiantes/:id', getEstudianteByID);
router.post('/estudiantes', createEstudiante);
router.patch('/estudiantes/:id', updateEstudianteByID);
router.post('/estudiantes/:id', activarDesactivarEstudianteByID);
export default router;