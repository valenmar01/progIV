import { Router } from 'express';
import {login} from "../controllers/auth.controller.js" ;

const router = Router();

//obtener todas las categorias
router.get('/login', login);

export default router;