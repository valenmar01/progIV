const LIMITE = 5;

export const getPaginacion = (query) => {
    let pagina = parseInt(query.pagina) || 1;
    if (pagina < 1) {
        pagina = 1;
    }
    const offset = (pagina - 1) * LIMITE;

    return { pagina, limite: LIMITE, offset };
};

export const parsearPaginado = (rows, limite, dto) => {
    const total = rows.length ? parseInt(rows[0].total) : 0;
    const totalPaginas = Math.ceil(total / limite) || 1;
    const datos = rows.map(dto);

    return { totalPaginas, datos };
};
