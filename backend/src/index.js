import 'dotenv/config';
import express from 'express';
import './middlewares/passport.js';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './config.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import cursosRoutes from './routes/cursos.routes.js';
import inscripcionesRoutes from './routes/inscripciones.routes.js';
import authRoutes from "./routes/auth.routes.js";

//initializations
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', estudiantesRoutes);
app.use('/api/v1',cursosRoutes);
app.use('/api/v1', inscripcionesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});