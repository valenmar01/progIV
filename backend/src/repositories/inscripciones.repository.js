import { pool } from '../db.js';

export const getInscripcionesQuery = async (limite, offset) => {
    return await pool.query(
        'SELECT i.id_inscripcion, i.id_estudiante, i.id_curso, i.fecha_hora_inscripcion, i.id_inscripcion_estado as activo, e.nombres, e.apellido, c.nombre as curso_nombre, COUNT(*) OVER() AS total FROM inscripciones i JOIN estudiantes e ON i.id_estudiante = e.id_estudiante JOIN cursos c ON i.id_curso = c.id_curso LIMIT $1 OFFSET $2',
        [limite, offset]
    );
};

export const getCursoMaximoQuery = async (id_curso) => {
    return await pool.query('SELECT inscriptos_max FROM cursos WHERE id_curso = $1 AND id_curso_estado = 2', [id_curso]);
};

export const countInscriptosActivosQuery = async (id_curso) => {
    return await pool.query('SELECT COUNT(*) FROM inscripciones WHERE id_curso = $1 AND id_inscripcion_estado = 1', [id_curso]);
};

export const insertInscripcionQuery = async (id_estudiante, id_curso) => {
    return await pool.query(
        'INSERT INTO inscripciones (id_estudiante, id_curso, fecha_hora_inscripcion, id_inscripcion_estado, id_usuario_modificacion, fecha_hora_modificacion) VALUES ($1, $2, NOW(), 1, 1, NOW()) RETURNING *',
        [id_estudiante, id_curso]
    );
};

export const updateEstadoInscripcionQuery = async (idEstadoDB, id) => {
    return await pool.query(
        'UPDATE inscripciones SET id_inscripcion_estado = $1, id_usuario_modificacion = 1, fecha_hora_modificacion = NOW() WHERE id_inscripcion = $2',
        [idEstadoDB, id]
    );
};