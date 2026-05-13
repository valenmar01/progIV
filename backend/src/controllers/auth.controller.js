import { pool } from '../db.js';

export const login = async (req, res) => {
  const {usuario,constrasenia} = req.body;
    //const { rows } = await pool.query('SELECT * FROM estudiantes WHERE documento = $1', [id]);
//    if (rows.length === 0) {
//        return res.status(404).json({ message: " " });
//   }
    const {rows} = await pool.query(`SELECT * FROM usuarios WHERE nombre_usuario = '${usuario}'`);
    const user=rows[0];
    res.status(200).json(user);

}

