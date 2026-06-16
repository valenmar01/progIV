import { pool } from '../db.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';
import { inscripcionOutputDTO } from '../models/inscripcion.js';

// Controladores para inscripciones
export const getAllInscripciones = async (req, res) => {
    const { pagina, limite, offset } = getPaginacion(req.query);

    try {
        const { rows } = await pool.query(
            'SELECT i.id_inscripcion, i.id_estudiante, i.id_curso, i.fecha_hora_inscripcion as fecha_inscripcion, i.id_inscripcion_estado as activo, e.nombres, e.apellido, c.nombre as curso_nombre, COUNT(*) OVER() AS total FROM inscripciones i JOIN estudiantes e ON i.id_estudiante = e.id_estudiante JOIN cursos c ON i.id_curso = c.id_curso LIMIT $1 OFFSET $2',
            [limite, offset]
        );

        const {totalPaginas, datos} = parsearPaginado(rows, limite, inscripcionOutputDTO);
        res.status(200).json({ totalPaginas, inscripciones: datos, pagina });
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        res.status(500).json({message:"Error al obtener las inscripciones" });
    }
}

// Controlador para crear una nueva inscripción
export const createInscripcion = async (req, res) => {
    const { id_estudiante, id_curso } = req.body;

    try {
        const cursoRes = await pool.query('SELECT inscriptos_max FROM cursos WHERE id_curso = $1 AND id_curso_estado = 2', [id_curso]); 
        
        if (cursoRes.rowCount === 0) {
            return res.status(404).json({ message: "El curso seleccionado no existe o no tiene inscripciones abiertas"});
        }

        const cupoMaximo = cursoRes.rows[0].inscriptos_max;

        const conteoRes = await pool.query('SELECT COUNT(*) FROM inscripciones WHERE id_curso = $1 AND id_inscripcion_estado = 1', [id_curso]);
        const inscritosActuales = parseInt(conteoRes.rows[0].count);

        if (inscritosActuales >= cupoMaximo) {
            return res.status(400).json({ message: "No se puede inscribir, el curso ya alcanzó su cupo máximo" });
        }

        const {rows} = await pool.query(
            'INSERT INTO inscripciones (id_estudiante, id_curso, fecha_hora_inscripcion, id_inscripcion_estado, id_usuario_modificacion, fecha_hora_modificacion) VALUES ($1, $2, NOW(), 1, 1, NOW()) RETURNING *',
            [id_estudiante, id_curso]
        );

        res.status(201).json({ message: "Inscripción creada exitosamente", inscripcion: rows[0]});
    } catch (error) {
        console.error("Error al inscribir:", error);
        res.status(500).json({ message: "Error al intentar inscribir al estudiante" });
    }
};

// Controlador para activar/desactivar una inscripción por ID
export const activarDesactivarInscripcionByID = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body; // Viene 1 (Confirmar) o 0 (Cancelar, que en BD es 2)

    const idEstadoDB = activo == 1 ? 1 : 2; // Si del front mandan 0, en la BD guardamos 2 (Cancelada)

    try {
        const { rowCount } = await pool.query(
            // Corregido: Se usa id_inscripcion_estado
            'UPDATE inscripciones SET id_inscripcion_estado = $1, id_usuario_modificacion = 1, fecha_hora_modificacion = NOW() WHERE id_inscripcion = $2',
            [idEstadoDB, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" });
        }

        const mensaje = idEstadoDB == 1 ? "Inscripción confirmada con éxito" : "Inscripción cancelada con éxito";
        res.status(200).json({ message: mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estado de la inscripción" });
    }
};