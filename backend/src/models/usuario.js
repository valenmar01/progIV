// Filtra y moldea lo que el backend le va a escupir al Frontend
export const usuarioOutputDTO = (row) => ({
    id: row.id_usuario,
    apellido: row.apellido,
    nombre: row.nombre,
    nombreUsuario: row.nombre_usuario,
    activo: row.activo
});

// Normaliza y limpia los datos que entran desde el formulario de Login
export const usuarioInputDTO = (body) => ({
    usuario: body.usuario?.trim(),
    contrasenia: body.contrasenia
});