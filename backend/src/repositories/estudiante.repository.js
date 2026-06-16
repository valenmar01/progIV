import { pool } from '../db.js';

export const estudianteRepository = {

    async findAll(limite, offset) {
        const { rows } = await pool.query(
            'SELECT *, COUNT(*) OVER() AS total FROM estudiantes LIMIT $1 OFFSET $2',
            [limite, offset]
        );
        return rows;
    },

    async findById(id) {
        const { rows } = await pool.query(
            'SELECT * FROM estudiantes WHERE id_estudiante = $1',
            [id]
        );
        return rows[0] ?? null;
    },

    async create(datos, userId) {
        const { rows } = await pool.query(
            `INSERT INTO estudiantes (documento, apellido, nombres, email, fecha_nacimiento, activo, id_usuario_modificacion, fecha_hora_modificacion)
             VALUES ($1, $2, $3, $4, $5, 1, $6, NOW()) RETURNING *`,
            [datos.documento, datos.apellido, datos.nombres, datos.email, datos.fecha_nacimiento, userId]
        );
        return rows[0];
    },

    async update(id, datos, userId) {
        const { rowCount, rows } = await pool.query(
            `UPDATE estudiantes
             SET apellido = COALESCE($1, apellido),
                 nombres = COALESCE($2, nombres),
                 email = COALESCE($3, email),
                 fecha_nacimiento = COALESCE($4, fecha_nacimiento),
                 id_usuario_modificacion = $5,
                 fecha_hora_modificacion = NOW()
             WHERE id_estudiante = $6
             RETURNING *`,
            [datos.apellido, datos.nombres, datos.email, datos.fecha_nacimiento, userId, id]
        );
        return rowCount > 0 ? rows[0] : null;
    },

    async activarDesactivar(id, activo) {
        const { rowCount, rows } = await pool.query(
            'UPDATE estudiantes SET activo = $1 WHERE id_estudiante = $2 RETURNING *',
            [activo, id]
        );
        return rowCount > 0 ? rows[0] : null;
    }
};
