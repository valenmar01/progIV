// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasenia = document.getElementById('input-contrasenia');
const mensajeError = document.getElementById('error-login');

const mostrarError = (msg) => {
  mensajeError.textContent = msg;
  mensajeError.style.display = "block";
};

const ocultarError = () => {
  mensajeError.textContent = "";
  mensajeError.style.display = "none";
};

formulario.addEventListener('submit', async (e) => {
    // Evita que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contraseniaIngresada = inputContrasenia.value;
    
    try {
        const res = await fetch("http://localhost:3000/api/v1/auth/login", {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                usuario: usuarioIngresado,
                contrasenia: contraseniaIngresada
            })
        });

        const data = await res.json();
        console.log(res);
        console.log(usuarioIngresado);
        console.log(contraseniaIngresada);

    // Limpia mensajes previos
        ocultarError();

        // validación con el Token
        if (res.ok) { 
            // Guarda el Token
            sessionStorage.setItem('token', data.token);
            //guarda los datos del usuario por si necesitas usar su nombre
            sessionStorage.setItem('usuarioLogueado', JSON.stringify(data.usuario));
            
            alert('¡Bienvenido al sistema!');
            window.location.href = 'index.html';
        
        } else if (res.status === 401 || res.status === 404) {
            // Error de autenticación devuelto por Passport o el Controlador
            mostrarError(data.message || 'Usuario o contraseña incorrectos.');
            inputContrasenia.value = '';
            inputContrasenia.focus();
        } else {
            mostrarError('Ocurrió un error inesperado.');    
        }
    } catch (error) {
        mostrarError('No se pudo conectar con el servidor.');
        console.error(error);
    }
});