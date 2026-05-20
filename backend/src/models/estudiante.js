export const estudianteOutputDTO = (row) => ({
    id: row.id_estudiante,
    documento: row.documento,
    apellido: row.apellido,
    nombres: row.nombres,
    email: row.email,
    fechaNacimiento: row.fecha_nacimiento,
    activo: row.activo
});

export const estudianteInputDTO = (body) => ({
    documento: body.documento?.trim(),
    apellido: body.apellido?.trim().toUpperCase(), 
    nombres: body.nombres?.trim().toUpperCase(),
    email: body.email?.trim().toLowerCase(),      
    fecha_nacimiento: body.fecha_nacimiento,
    activo: parseInt(body.activo) ?? 1
});
