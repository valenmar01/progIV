import { estudianteService } from '../services/estudiante.service.js';

export const getAllEstudiantes = async (req, res) => {
    try {
        const resultado = await estudianteService.getAll(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los estudiantes" });
    }
};

export const getEstudianteByID = async (req, res) => {
    try {
        const estudiante = await estudianteService.getById(req.params.id);
        if (!estudiante) return res.status(404).json({ message: "Estudiante no encontrado" });
        res.status(200).json(estudiante);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el estudiante" });
    }
};

export const createEstudiante = async (req, res) => {
    try {
        const estudiante = await estudianteService.create(req.body, req.user.id);
        res.status(201).json({ message: "Estudiante creado correctamente", estudiante });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el estudiante" });
    }
};

export const activarDesactivarEstudianteByID = async (req, res) => {
    try {
        const { activo } = req.body;
        const estudiante = await estudianteService.activarDesactivar(req.params.id, activo);
        if (!estudiante) return res.status(404).json({ message: "Estudiante no encontrado" });
        const message = activo == 1 ? "Estudiante activado correctamente" : "Estudiante desactivado correctamente";
        res.status(200).json({ message, estudiante });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado del estudiante" });
    }
};

export const updateEstudianteByID = async (req, res) => {
    try {
        const estudiante = await estudianteService.update(req.params.id, req.body, req.user.id);
        if (!estudiante) return res.status(404).json({ message: "Estudiante no encontrado" });
        res.status(200).json({ message: "Estudiante actualizado correctamente", estudiante });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estudiante" });
    }
};
