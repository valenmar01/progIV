import "dotenv/config";
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './config.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import cursosRoutes from './routes/cursos.routes.js';

import auth from "./routes/auth.routes.js";

//initializations
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middlewares
app.use(cors());
app.use(morgan('dev'));

//routes
app.use(estudiantesRoutes);
app.use(cursosRoutes);
app.use(auth)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});