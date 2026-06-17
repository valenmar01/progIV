const redirigirAlLogin = () => {
    sessionStorage.clear();
    window.top.location.href = 'login.html';
};

export const fetchAuth = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (res.status === 401) {
        redirigirAlLogin();
        throw new Error('Sesión expirada');
    }
    return res;
};
