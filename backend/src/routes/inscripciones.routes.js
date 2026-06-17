import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { getAllInscripciones, createInscripcion, activarDesactivarInscripcionByID, getDiplomaInscripcion } from '../controllers/inscripciones.controller.js';
import passport from 'passport';

const router = Router();

//cualquier petición necesita un Token válido en el header
router.use(passport.authenticate('jwt', { session: false }));

router.get('/inscripciones', getAllInscripciones);
router.post('/inscripciones', [
    check('id_estudiante', 'Debe seleccionar un estudiante valido').not().isEmpty(),
    check('id_curso', 'Debe seleccionar un curso valido').not().isEmpty(),
    validarCampos
], createInscripcion);
router.delete('/inscripciones/:id', activarDesactivarInscripcionByID);
router.get('/inscripciones/:id/diploma', getDiplomaInscripcion);

export default router;