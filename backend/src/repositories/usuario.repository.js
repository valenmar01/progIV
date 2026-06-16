
import { pool } from '../db.js';

export const usuarioRepository = {

    //busca ususario y verifica la contraseña usando SHA-256
    async findByCredentials(nombreUsuario, contraseniaPlana) {
        console.log("1. Backend recibió:", nombreUsuario, contraseniaPlana); ///////////////////////////////////////////////
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

        console.log("2. Base de datos devolvió:", rows); /////////////////////////////////////////////////

        // Si encuentra coincidencia, devuelve el usuario (la contraseña no viaja al controlador)
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
