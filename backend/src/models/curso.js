export const cursoDTO = (row) => ({
    id: row.id_curso,
    nombre: row.nombre,
    descripcion: row.descripcion,
    fecha_inicio : row.fecha_inicio,
    cantidad_horas : row.cantidad_horas,
    inscriptos_max : row.inscriptos_max
});