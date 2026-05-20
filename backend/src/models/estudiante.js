export const estudianteOutputDTO = (row) => ({
    id: row.id_estudiante,
    documento: row.documento,
    apellido: row.apellido,
    nombres: row.nombres,
    email: row.email,
    fechaNacimiento: row.fecha_nacimiento,
    activo: row.activo
});
