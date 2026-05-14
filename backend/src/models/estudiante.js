export const estudianteDTO = (row) => ({
    id: row.id_estudiante,
    documento: row.documento,
    apellido: row.apellido,
    nombres: row.nombres,
    email: row.email,
    telefono: row.telefono,
    fecha_nacimiento: row.fecha_nacimiento,
    activo: row.activo
});
