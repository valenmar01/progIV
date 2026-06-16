import { estudianteRepository } from '../repositories/estudiante.repository.js';
import { estudianteOutputDTO, estudianteInputDTO } from '../models/estudiante.js';
import { getPaginacion, parsearPaginado } from '../helpers/paginar.js';

export const estudianteService = {

    async getAll(query) {
        const { pagina, limite, offset } = getPaginacion(query);
        const rows = await estudianteRepository.findAll(limite, offset);
        const { totalPaginas, total, datos } = parsearPaginado(rows, limite, estudianteOutputDTO);
        return { totalPaginas, total, estudiantes: datos, pagina };
    },

    async getById(id) {
        const row = await estudianteRepository.findById(id);
        if (!row) return null;
        return estudianteOutputDTO(row);
    },

    async create(body, userId) {
        const datos = estudianteInputDTO(body);
        const row = await estudianteRepository.create(datos, userId);
        return estudianteOutputDTO(row);
    },

    async update(id, body, userId) {
        const datos = estudianteInputDTO(body);
        const row = await estudianteRepository.update(id, datos, userId);
        if (!row) return null;
        return estudianteOutputDTO(row);
    },

    async activarDesactivar(id, activo) {
        const row = await estudianteRepository.activarDesactivar(id, activo);
        if (!row) return null;
        return estudianteOutputDTO(row);
    }
};
