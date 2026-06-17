import * as inscripcionService from '../services/inscripciones.service.js';
import { getPaginacion } from '../helpers/paginar.js';
import { generarDiplomaIndividual } from '../helpers/generarDiploma.js';

export const getDiplomaInscripcion = async (req, res) => {
    try {
        const datos = await inscripcionService.generarDiplomaService(req.params.id);
        generarDiplomaIndividual(res, datos);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Error al generar el diploma' });
    }
};

export const getAllInscripciones = async (req, res) => {
    try {
        const { pagina, limite, offset } = getPaginacion(req.query);
        const resultado = await inscripcionService.obtenerInscripcionesService(limite, offset);
        res.status(200).json({ ...resultado, pagina });
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        res.status(500).json({ message: "Error al obtener las inscripciones" });
    }
}

export const createInscripcion = async (req, res) => {
    try {
        const { id_estudiante, id_curso } = req.body;
        const nuevaInscripcion = await inscripcionService.crearInscripcionService(id_estudiante, id_curso, req.user.id);
        
        res.status(201).json({ message: "Inscripción creada exitosamente", inscripcion: nuevaInscripcion });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al intentar inscribir al estudiante" });
    }
};

export const activarDesactivarInscripcionByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        
        const mensaje = await inscripcionService.cambiarEstadoService(id, activo, req.user.id);
        res.status(200).json({ message: mensaje });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || "Error al actualizar el estado de la inscripción" });
    }
};