import { pool } from '../db.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';
import { inscripcionOutputDTO } from '../models/inscripcion.js';

// Controladores para inscripciones
export const getAllInscripciones = async (req, res) => {
    const { pagina, limite, offset } = getPaginacion(req.query);

    try {
        const { rows } = await pool.query(
            'SELECT i.*, e.nombres, e.apellido, c.nombre as curso_nombre, COUNT(*) OVER() AS total FROM inscripciones i JOIN estudiantes e ON i.id_estudiante = e.id_estudiante JOIN cursos c ON i.id_curso = c.id_curso LIMIT $1 OFFSET $2',
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
        const cursoRes = await pool.query('SELECT incriptos_max FROM cursos WHERE id_curso = $1 AND activo = 1', [id_curso]); 
        if (cursoRes.rowCount.length === 0) {
            return res.status(404).json({ message: "El curso seleccionado no existe"});
        }

        const cupoMaximo = cursoRes.rows[0].incriptos_max;

        const conteoRes = await pool.query('SELECT COUNT(*) FROM inscripciones WHERE id_curso = $1 AND activo = 1', [id_curso]);
        const inscritosActuales = parseInt(conteoRes.rows[0].count);

        if (inscritosActuales >= cupoMaximo) {
            return res.status(400).json({ message: "No se puede inscribir, el curso ya alcanzó su cupo máximo" });
        }

        const {rows} = await pool.query(
            'INSERT INTO inscripciones (id_estudiante, id_curso, fecha_inscripcion, activo, id_usuario_creacion, fecha_hora_creacion) VALUES ($1, $2, NOW(), 1, 1, NOW()) RETURNING *',
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
    const { activo } = req.body;

    try {
        const { rowCount } = await pool.query(
            'UPDATE inscripciones SET activo = $1, id_usuario_modificacion = 1, fecha_hora_modificacion = NOW() WHERE id_inscripcion = $2',
            [activo, id]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Inscripción no encontrada" });
    }

    const mensaje = activo==1 ? "Inscripción activada con éxito" : "Inscripción desactivada con éxito";
    res.status(200).json({ message: mensaje });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estado de la inscripción" });
    }
};