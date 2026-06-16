import { pool } from '../db.js';

export const cursoRepository = {

    async findAll(limite, offset) {
        let query = `
            SELECT c.*, 
                   COALESCE(i.total_inscriptos, 0) AS inscriptos_actuales,
                   CASE WHEN c.id_curso_estado = 1 THEN 'abierta' ELSE 'cerrada' END AS estado_texto,
                   COUNT(*) OVER() AS total 
            FROM cursos c
            LEFT JOIN (
                SELECT id_curso, COUNT(*) AS total_inscriptos 
                FROM inscripciones 
                GROUP BY id_curso
            ) i ON c.id_curso = i.id_curso
            ORDER BY c.id_curso DESC
        `;
        
        const params = [];
        if (limite !== undefined && offset !== undefined) {
            query += ' LIMIT $1 OFFSET $2';
            params.push(limite, offset);
        }

        const { rows } = await pool.query(query, params);
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(
            `SELECT c.*, 
                    COALESCE(i.total_inscriptos, 0) AS inscriptos_actuales,
                    CASE WHEN c.id_curso_estado = 1 THEN 'abierta' ELSE 'cerrada' END AS estado_texto
             FROM cursos c
             LEFT JOIN (
                 SELECT id_curso, COUNT(*) AS total_inscriptos 
                 FROM inscripciones 
                 GROUP BY id_curso
             ) i ON c.id_curso = i.id_curso
             WHERE c.id_curso = $1`,
            [id]
        );
        return rows[0] ?? null;
    },

    async create(datos) {
        const { rows } = await pool.query(
            `INSERT INTO cursos (nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_usuario_modificacion, fecha_hora_modificacion)
             VALUES ($1, $2, $3, $4, $5, 1, 1, NOW()) RETURNING *`,
            [datos.nombre, datos.descripcion, datos.fecha_inicio, datos.cantidad_horas, datos.inscriptos_max]
        );
        return rows[0];
    },

    async update(id, datos) {
        const { rowCount, rows } = await pool.query(
            `UPDATE cursos
             SET nombre = COALESCE($1, nombre),
                 descripcion = COALESCE($2, descripcion),
                 fecha_inicio = COALESCE($3, fecha_inicio),
                 cantidad_horas = COALESCE($4, cantidad_horas),
                 inscriptos_max = COALESCE($5, inscriptos_max),
                 id_curso_estado = COALESCE($6, id_curso_estado),
                 id_usuario_modificacion = 1,
                 fecha_hora_modificacion = NOW()
             WHERE id_curso = $7
             RETURNING *`,
            [datos.nombre, datos.descripcion, datos.fecha_inicio, datos.cantidad_horas, datos.inscriptos_max, datos.id_curso_estado, id]
        );
        return rowCount > 0 ? rows[0] : null;
    },

    async activarDesactivar(id, activo) {
        const { rowCount, rows } = await pool.query(
            'UPDATE cursos SET id_curso_estado = $1 WHERE id_curso = $2 RETURNING *',
            [activo, id]
        );
        return rowCount > 0 ? rows[0] : null;
    }
};