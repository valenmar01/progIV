import { cursoRepository } from '../repositories/curso.repository.js';
import { cursoOutputDTO, cursoInputDTO } from '../models/curso.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';

export const cursoService = {

    async getAll(query) {
        if (!query.pagina) {
            const rows = await cursoRepository.findAll();
            const datos = rows.map(cursoOutputDTO);
            return { totalPaginas: 1, total: rows.length, cursos: datos, pagina: 1 };
        }

        const { pagina, limite, offset } = getPaginacion(query);
        const rows = await cursoRepository.findAll(limite, offset);
        const { totalPaginas, total, datos } = parsearPaginado(rows, limite, cursoOutputDTO);
        return { totalPaginas, total, cursos: datos, pagina };
    },

    async getById(id) {
        const row = await cursoRepository.findById(id);
        if (!row) return null;
        return cursoOutputDTO(row);
    },

    async create(body) {
        const datos = cursoInputDTO(body);
        const row = await cursoRepository.create(datos);
        return cursoOutputDTO(row);
    },

    async update(id, body) {
        const datos = cursoInputDTO(body);
        const row = await cursoRepository.update(id, datos);
        if (!row) return null;
        return cursoOutputDTO(row);
    },

    async cambiarEstado(id, id_curso_estado) {
        const row = await cursoRepository.cambiarEstado(id, id_curso_estado);
        if (!row) return null;
        return cursoOutputDTO(row);
    }
};