import { pool } from '../db.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';
import { cursoDTO } from '../models/curso.js';

export const getAllCursos = async (req, res) => {
    const { pagina, limite, offset } = getPaginacion(req.query);

    try {
        const { rows } = await pool.query(
            'SELECT *, COUNT(*) OVER() AS total FROM cursos LIMIT $1 OFFSET $2',
            [limite, offset]
        );

        const { totalPaginas, datos } = parsearPaginado(rows, limite, cursoDTO);

        res.status(200).json({ totalPaginas, cursos: datos });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los cursos" });
    }
}

export const getCursoByID = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query(`SELECT * FROM cursos WHERE id_curso = $1`,[id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }
        res.status(200).json(cursoDTO(rows[0]));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el curso" });
    }
}

export const createCurso = async (req, res) => {
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, } = req.body;
    const id_curso_estado = 1;
    const values = [nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max,id_curso_estado];


    try {
        const { rows } = await pool.query(
            `INSERT INTO cursos (
                nombre,
                descripcion,
                fecha_inicio,
                cantidad_horas,
                inscriptos_max,
                id_curso_estado,
                id_usuario_modificacion,
                fecha_hora_modificacion
            ) VALUES ($1, $2, $3, $4, $5,$6,1, NOW()) RETURNING *`,
            values
        );

        res.status(201).json({
            message: "curso creado correctamente",
            curso: cursoDTO(rows[0])
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al crear el curso" });
    }
}

export const activarDesactivarCursoByID = async (req, res) => {
    const { id } = req.params;
    let { activo } = req.body;
    let message = "curso activado correctamente"
    if (activo != 1) {
        message = "curso desactivado correctamente"
    }

    try {
        const { rowCount, rows } = await pool.query(
            `UPDATE cursos SET id_curso_estado = $1 WHERE id_curso = $2 RETURNING *`,
            [activo,id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "curso no encontrado" });
        }
        const cursoDesactivado = cursoDTO(rows[0]);

        res.status(200).json({
            message,
            curso: cursoDesactivado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estado del curso" });
    }
}

export const updateCursoByID = async (req, res) => {
    console.log(req.params.id);
    console.log(req.body)
    const { id } = req.params;
    const { nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max, id_curso_estado, id_curso} = req.body;
    const values = [nombre ?? null, descripcion ?? null, fecha_inicio ?? null, cantidad_horas ?? null, inscriptos_max ?? null,id_curso_estado ?? null, id]

    try {
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
             values
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "curso no encontrado" });
        }

        res.status(200).json({
            message: "curso actualizado correctamente",
            curso: cursoDTO(rows[0])
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el curso" });
    }
}