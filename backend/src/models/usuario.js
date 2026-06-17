export const usuarioOutputDTO = (row) => ({
    id: row.id_usuario,
    apellido: row.apellido,
    nombre: row.nombre,
    nombreUsuario: row.nombre_usuario,
    activo: row.activo
});

export const usuarioInputDTO = (body) => ({
    usuario: body.usuario?.trim(),
    contrasenia: body.contrasenia
});