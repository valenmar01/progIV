// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasena = document.getElementById('input-contrasena');
const mensajeError = document.getElementById('error-login');

// sirve para manejar el evento de envío del formulario
formulario.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contrasenaIngresada = inputContrasena.value;
    
    // Validación de campos vacíos
    if (!usuarioIngresado || !contrasenaIngresada) {
        mensajeError.textContent = 'Por favor, completa todos los campos.';
        return;
    }

    try {
        // Hacemos la llamada al backend
        const res = await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuarioIngresado,
                contrasenia: contrasenaIngresada
            })
        });

        // Verificamos si la respuesta es correcta
        if (usuarioIngresado === "admin" && contrasenaIngresada === "1234") {
            // El usuario y contraseña son correctos, guardamos la sesión y redirigimos a index.html
            localStorage.setItem('estaAutenticado', 'true');
            alert('¡Bienvenido al sistema!');
            window.location.href = 'index.html';
        } else {
            // El usuario o contraseña fueron rechazados por el servidor
            mensajeError.textContent = 'Usuario o contraseña incorrectos.';
            inputContrasena.value = '';
            inputContrasena.focus();
        }

    } catch (error) {
        // Esto ocurre si el servidor está apagado o hay un error de conexión
        console.error("Error de conexión:", error);
        mensajeError.textContent = 'Error al conectar con el servidor. Inténtalo más tarde.';
    }
});