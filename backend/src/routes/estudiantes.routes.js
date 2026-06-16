import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { getAllEstudiantes, getEstudianteByID, createEstudiante, activarDesactivarEstudianteByID, updateEstudianteByID } from '../controllers/estudiantes.controller.js';
import passport from 'passport';
const router = Router();

//cualquier petición necesita un Token válido en el header
router.use(passport.authenticate('jwt', { session: false }));

router.get('/estudiantes', getAllEstudiantes);
router.get('/estudiantes/:id', getEstudianteByID);

router.post('/estudiantes', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'No es un correo valido').isEmail(),
    validarCampos
], createEstudiante);

router.put('/estudiantes/:id', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'No es un correo valido').isEmail(),
    validarCampos
], updateEstudianteByID);

router.delete('/estudiantes/:id', activarDesactivarEstudianteByID);
export default router;