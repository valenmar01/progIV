
import { pool } from '../db.js';

export const usuarioRepository = {

    //busca ususario y verifica la contraseña usando SHA-256
    async findByCredentials(nombreUsuario, contraseniaPlana) {
        const { rows } = await pool.query(
            `SELECT 
                id_usuario, 
                apellido, 
                nombre, 
                nombre_usuario, 
                activo 
            FROM 
                usuarios 
            WHERE 
                nombre_usuario = $1 
            AND 
                contrasenia = encode(digest($2, 'sha256'), 'hex')`,
            [nombreUsuario, contraseniaPlana]
        );

        // Si encuentra coincidencia, devuelve el usuario
        // Si no encuentra nada, devuelve null
        return rows[0] ?? null;
},

    async findById(id) {
        const { rows } = await pool.query(
            `SELECT 
                id_usuario, 
                apellido, 
                nombre, 
                nombre_usuario, 
                activo 
            FROM 
                usuarios 
            WHERE 
                id_usuario = $1`,
            [id]
        );
        return rows[0] ?? null;
    }
};
