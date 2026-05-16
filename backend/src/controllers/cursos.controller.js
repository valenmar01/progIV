export const getAllCursos = async (req, res) => {
   // const { rows, rowCount } = await pool.query('SELECT * FROM estudiantes');
   const listaEjemplo = ["a","b","c"]
    res.status(200).json({
        listaEjemplo
    });
}

export const getCursoByID = async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM cursos WHERE id_curso = $1', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json(rows[0]);
}

/*export const createEstudiante = async (req, res) => {
    const {
        documento,
        apellido,
        nombres,
        email,
        fecha_nacimiento,
        activo
  
  
        } = req.body;

        */