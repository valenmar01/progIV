import { pool } from '../db.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';
import { estudianteOutputDTO, estudianteInputDTO } from '../models/estudiante.js';

export const getAllEstudiantes = async (req, res) => {
    const { pagina, limite, offset } = getPaginacion(req.query);

    try {
        const { rows } = await pool.query(
            'SELECT *, COUNT(*) OVER() AS total FROM estudiantes LIMIT $1 OFFSET $2',
            [limite, offset]
        );

        const { totalPaginas, datos } = parsearPaginado(rows, limite, estudianteOutputDTO);

        res.status(200).json({ totalPaginas, estudiantes: datos, pagina });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los estudiantes" });
    }
}

export const getEstudianteByID = async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM estudiantes WHERE id_estudiante = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        res.status(200).json(estudianteOutputDTO(rows[0]));
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el estudiante" });
    }
}

export const createEstudiante = async (req, res) => {
    console.log("BODY RECIBIDO:", req.body);
    const nuevoEstudiante = estudianteInputDTO(req.body);

    try {
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
            ) VALUES ($1, $2, $3, $4, $5, 1, 2, NOW()) RETURNING *`,
            [
                nuevoEstudiante.documento,
                nuevoEstudiante.apellido,
                nuevoEstudiante.nombres,
                nuevoEstudiante.email,
                nuevoEstudiante.fecha_nacimiento
            ]
            
        );
        console.log("INSERT EXITOSO, FILA CREADA:", rows[0]); // 2. Confirmar escritura 

        res.status(201).json({
            message: "Estudiante creado correctamente",
            estudiante: estudianteOutputDTO(rows[0])
        });
    } catch (error) {
        console.error("ERROR CRÍTICO EN SQL:", error); // 3. Ver qué rompe la DB
        res.status(500).json({ message: "Error al crear el estudiante" });
    }
}

export const activarDesactivarEstudianteByID = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body;
    let message = "Estudiante activado correctamente"
    if (activo != 1) {
        message = "Estudiante desactivado correctamente"
    }

    try {
        const { rowCount, rows } = await pool.query(
            'UPDATE estudiantes SET activo = $1 WHERE id_estudiante = $2 RETURNING *',
            [activo, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }
        const estudianteDesactivado = estudianteOutputDTO(rows[0]);

        res.status(200).json({
            message,
            estudiante: estudianteDesactivado
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado del estudiante" });
    }
}

export const updateEstudianteByID = async (req, res) => {
    const { id } = req.params;

    const datosActualizados = estudianteInputDTO(req.body);

    try {
        const { rowCount, rows } = await pool.query(
            `UPDATE estudiantes
             SET apellido = COALESCE($1, apellido),
                 nombres = COALESCE($2, nombres),
                 email = COALESCE($3, email),
                 fecha_nacimiento = COALESCE($4, fecha_nacimiento),
                 id_usuario_modificacion = 1,
                 fecha_hora_modificacion = NOW()
             WHERE id_estudiante = $5
             RETURNING *`,
            [datosActualizados.apellido,
             datosActualizados.nombres,
             datosActualizados.email,
             datosActualizados.fecha_nacimiento,
             id
            ]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        res.status(200).json({
            message: "Estudiante actualizado correctamente",
            estudiante: estudianteOutputDTO(rows[0])
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estudiante" });
    }
}