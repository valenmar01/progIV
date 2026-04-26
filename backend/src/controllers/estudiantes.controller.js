

getAllEstudiantes = async (req, res) => {
    console.log("Obteniendo estudiantes...");
    res.status(200).json({
        total: estudiantes.length,
        estudiantes
    });
}



const estudiantes = [
    {
        documento: "12345678",
        apellido: "Cejas",
        nombres: "Claudio Alejandro",
        email: "cejasclaudioalejandro@gmail.com"
    },
    {
        documento: "87654321",
        apellido: "Martinez",
        nombres: "Valentina",
        email: "valentina.martinez@correo.com",
    },
    {
        documento: "11223344",
        apellido: "Magali",
        nombres: "Castell",
        email: "castell.magali@correo.com",
    },
    {
        documento: "1122134",
        apellido: "Segovia",
        nombres: "Tomas",
        email: "tomas.segovia@correo.com",
    },
    {
        documento: "1128907544",
        apellido: "Ignacio",
        nombres: "Denis",
        email: "denis.ignacio@correo.com",
    },

];


module.exports = {
    getAllEstudiantes
}