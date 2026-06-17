import { usuarioRepository } from '../repositories/usuario.repository.js';
import { usuarioOutputDTO, usuarioInputDTO } from '../models/usuario.js';

export const authService = {

    //Valida las credenciales de login del usuario
    //Mapea la entrada con el InputDTO y la salida con el OutputDTO
    async login(body) {

        const { usuario, contrasenia } = usuarioInputDTO(body);
        const row = await usuarioRepository.findByCredentials(usuario, contrasenia);
        if (!row) return null;
        return usuarioOutputDTO(row);
    },

    
    //Busca un usuario por su ID
    //Para la verificación activa del token en el middleware de Passport
    async getById(id) {
        const row = await usuarioRepository.findById(id);
        if (!row) return null;
        return usuarioOutputDTO(row);
    }
};