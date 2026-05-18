import { pool } from '../db.js';

export const login = async (req, res) => {
  
  const {usuario, contrasenia} = req.body;
  
  try{

    const {rows} = await pool.query('SELECT * FROM usuarios WHERE nombre_usuario = $1 AND contrasenia = $2  AND activo = 1', [usuario, contrasenia]);
  
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  
    const user=rows[0];
    res.status(200).json(user);

  } catch (error) {
  
    console.error("Error en la base de datos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  
  }
  
}
