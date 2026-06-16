import { Router } from 'express';
import { getAllCursos, getCursoByID, createCurso, cambiarEstadoCursoByID, updateCursoByID } from '../controllers/cursos.controller.js';
import passport from 'passport';
const router = Router();

//cualquier petición necesita un Token válido en el header
router.use(passport.authenticate('jwt', { session: false }));

router.get('/cursos', getAllCursos);
router.get('/cursos/:id', getCursoByID);
router.post('/cursos', createCurso);
router.put('/cursos/:id', updateCursoByID);
router.delete('/cursos/:id', cambiarEstadoCursoByID); 
export default router;                                                                                   

