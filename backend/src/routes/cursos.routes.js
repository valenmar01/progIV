import { Router } from 'express';
import { getAllCursos, getCursoByID, createCurso, activarDesactivarCursoByID, updateCursoByID } from '../controllers/cursos.controller.js';
const router = Router();


router.get('/cursos', getAllCursos);
router.get('/cursos/:id', getCursoByID);
router.post('/cursos', createCurso);
router.put('/cursos/:id', updateCursoByID);
router.delete('/cursos/:id', activarDesactivarCursoByID);
export default router;                                                                                   

