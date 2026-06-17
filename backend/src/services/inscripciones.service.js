import * as inscripcionRepo from '../repositories/inscripciones.repository.js';
import { parsearPaginado } from '../helpers/paginar.js';
import { inscripcionOutputDTO } from '../models/inscripcion.js';

export const obtenerInscripcionesService = async (limite, offset) => {
    const { rows } = await inscripcionRepo.getInscripcionesQuery(limite, offset);
    const { totalPaginas, datos } = parsearPaginado(rows, limite, inscripcionOutputDTO);
    const totalInscriptos = rows.length > 0 ? rows[0].total : 0; 
    
    return { totalPaginas, inscripciones: datos, total: totalInscriptos };
};

export const crearInscripcionService = async (id_estudiante, id_curso) => {
    const cursoRes = await inscripcionRepo.getCursoMaximoQuery(id_curso);
    if (cursoRes.rowCount === 0) {
        throw { status: 404, message: "El curso seleccionado no existe o no tiene inscripciones abiertas" };
    }

    const cupoMaximo = cursoRes.rows[0].inscriptos_max;
    const conteoRes = await inscripcionRepo.countInscriptosActivosQuery(id_curso);
    const inscritosActuales = parseInt(conteoRes.rows[0].count);

    if (inscritosActuales >= cupoMaximo) {
        throw { status: 400, message: "No se puede inscribir, el curso ya alcanzó su cupo máximo" };
    }
    const { rows } = await inscripcionRepo.insertInscripcionQuery(id_estudiante, id_curso);
    return rows[0];
};

export const generarDiplomaService = async (idInscripcion) => {
    const { rows } = await inscripcionRepo.getDiplomaDataQuery(idInscripcion);
    if (!rows[0]) throw { status: 404, message: 'Inscripción no encontrada' };
    const r = rows[0];
    return {
        nombres: r.nombres,
        apellido: r.apellido,
        documento: r.documento,
        nombreCurso: r.curso_nombre,
        cantidadHoras: r.cantidad_horas,
    };
};

export const cambiarEstadoService = async (id, activo) => {
    const idEstadoDB = activo == 1 ? 1 : 2;
    const { rowCount } = await inscripcionRepo.updateEstadoInscripcionQuery(idEstadoDB, id);
    
    if (rowCount === 0) {
        throw { status: 404, message: "Inscripción no encontrada" };
    }

    return idEstadoDB == 1 ? "Inscripción confirmada con éxito" : "Inscripción cancelada con éxito";
};