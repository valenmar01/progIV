export const cursoOutputDTO = (row) => ({
    id: row.id_curso,
    nombre: row.nombre,
    descripcion: row.descripcion,
    fecha_inicio: row.fecha_inicio,
    cantidad_horas: row.cantidad_horas,
    inscriptos_max: row.inscriptos_max,    
    id_curso_estado: row.id_curso_estado,
    inscriptos_actuales: parseInt(row.inscriptos_actuales) || 0,
    estado: row.estado_texto || (row.id_curso_estado == 1 ? 'abierta' : 'cerrada')
});

export const cursoInputDTO = (body) => ({
    nombre: body.nombre?.trim(),
    descripcion: body.descripcion?.trim(),
    fecha_inicio: body.fecha_inicio,
    cantidad_horas: body.cantidad_horas ? parseInt(body.cantidad_horas) : 0,
    inscriptos_max: body.inscriptos_max ? parseInt(body.inscriptos_max) : 0,
    id_curso_estado: body.id_curso_estado ? parseInt(body.id_curso_estado) : 1
});