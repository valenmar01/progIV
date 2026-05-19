import { Router } from 'express';
import { getAllEstudiantes, getEstudianteByID, createEstudiante, activarDesactivarEstudianteByID, updateEstudianteByID } from '../controllers/estudiantes.controller.js';
const router = Router();


router.get('/estudiantes', getAllEstudiantes);
router.get('/estudiantes/:id', getEstudianteByID);
router.post('/estudiantes', createEstudiante);
router.put('/estudiantes/:id', updateEstudianteByID);
router.delete('/estudiantes/:id', activarDesactivarEstudianteByID);
export default router;