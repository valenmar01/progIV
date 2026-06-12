export const inscripcionOutputDTO = (row) => ({
  id: row.id_inscripcion,
  id_estudiante: row.id_estudiante,
  estudiante: '${row.apellido} ${row.nombre}',
  id_curso: row.id_curso,
  curso: row.curso_nombre,
  fecha_inscripcion: row.fecha_inscripcion,
  activo: row.activo,
});