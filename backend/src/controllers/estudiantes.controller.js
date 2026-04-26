import { pool } from '../db.js';

export const getAllEstudiantes = async (req, res) => {
    const { rows, rowCount } = await pool.query('SELECT * FROM estudiantes');
    res.status(200).json({
        total: rowCount,
        estudiantes: rows
    });
}

export const getEstudianteByID = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM estudiantes WHERE documento = $1', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json(rows[0]);
}

export const createEstudiante = async (req, res) => {
    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
    } = req.body;

    const { rows } = await pool.query(
        `INSERT INTO estudiantes (
            documento,
            apellido,
            nombres,
            email,
            fecha_nacimiento,
            activo,
            id_usuario_modificacion,
            fecha_hora_modificacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
        [documento, apellido, nombres, email, fecha_nacimiento, activo, 1]
    );

    res.status(201).json({
        message: "Estudiante creado correctamente",
        estudiante: rows[0]
    });
}

export const activarDesactivarEstudianteByID = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    let message = "Estudiante activado correctamente"
    if (activo != 1) {
        message = "Estudiante desactivado correctamente"
    }
    console.log("ID recibido:", id);
    console.log("Activo recibido:", activo);
    const { rowCount, rows } = await pool.query(
        'UPDATE estudiantes SET activo = $1 WHERE documento = $2 RETURNING *',
        [activo, id],
    );

    if (rowCount === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json({
        message,
        estudiante: rows[0]
    });
}

export const updateEstudianteByID = async (req, res) => {
    const { id } = req.params;
    const {
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
    } = req.body;

    const { rowCount, rows } = await pool.query(
        `UPDATE estudiantes
         SET apellido = $1,
             nombres = $2,
             email = $3,
             fecha_nacimiento = $4,
             activo = $5,
             id_usuario_modificacion = $6,
             fecha_hora_modificacion = NOW()
         WHERE documento = $7
         RETURNING *`,
        [apellido, nombres, email, fecha_nacimiento, activo, 1, id]
    );

    if (rowCount === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    res.status(200).json({
        message: "Estudiante actualizado correctamente",
        estudiante: rows[0]
    });
}