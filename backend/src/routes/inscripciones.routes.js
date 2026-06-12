import {Router} from 'express';
import {check} from 'express-validator';
import {validarCampos} from '../middlewares/validar-campos.js';
import { getAllInscripciones, createInscripcion, activarDesactivarInscripcionByID } from '../controllers/inscripciones.controller.js';

const router = Router();

router.get('/inscripciones', getAllInscripciones);
router.post('/inscripciones', [
    check('id_estudiante', 'Debe seleccionar un estudiante valido').not().isEmpty(),
    check('id_curso', 'Debe seleccionar un curso valido').not().isEmpty(),
    validarCampos
], createInscripcion);

router.delete('/inscripciones/:id', activarDesactivarInscripcionByID);

export default router;