// src/controllers/cursos.controller.js
import { cursoService } from '../services/curso.service.js';

export const getAllCursos = async (req, res) => {
    try {
        const resultado = await cursoService.getAll(req.query);
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        res.status(500).json({ message: "Error al obtener los cursos" });
    }
};

export const getCursoByID = async (req, res) => {
    try {
        const curso = await cursoService.getById(req.params.id);
        if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json(curso);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el curso" });
    }
};

export const createCurso = async (req, res) => {
    try {
        const curso = await cursoService.create(req.body);
        res.status(201).json({ message: "Curso creado correctamente", curso });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el curso" });
    }
};

export const activarDesactivarCursoByID = async (req, res) => {
    try {
        const { activo } = req.body; // 1 o 0 recibido desde el frontend
        const curso = await cursoService.activarDesactivar(req.params.id, activo);
        if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
        
        const message = activo == 1 ? "Curso activado correctamente" : "Curso desactivado correctamente";
        res.status(200).json({ message, curso });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado del curso" });
    }
};

export const updateCursoByID = async (req, res) => {
    try {
        const curso = await cursoService.update(req.params.id, req.body);
        if (!curso) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(200).json({ message: "Curso actualizado correctamente", curso });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el curso" });
    }
};