const manejarSesionExpirada = () => {
    sessionStorage.clear();    
    alert("Tu sesión ha expirado. Debe loguearse nuevamente.");
    window.parent.location.href = 'login.html';
};

export const fetchAuth = async (url, options = {}) => {
    const res = await fetch(url, options);
    
    if (res.status === 401) {
        manejarSesionExpirada();
        return { 
            ok: false, 
            status: 401, 
            json: async () => ({}) 
        };
    }
    
    return res;
};
