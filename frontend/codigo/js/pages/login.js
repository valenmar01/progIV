// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasena = document.getElementById('input-contrasena');
const mensajeError = document.getElementById('error-login');

// Credenciales de prueba (simuladas)
const CREDENCIALES_VALIDAS = {
    usuario: 'admin',
    contrasena: '1234'
};

// Escuchar el evento de envío
formulario.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contrasenaIngresada = inputContrasena.value;
    
    const res = await fetch("http://localhost:3000/login", {method: 'get',
        headers:
        {
            'Content-Type':'application/json'
        }
    },
    );

    const a = await res;


    console.log(usuarioIngresado);
    console.log(contrasenaIngresada);

    console.log(res);

    // Limpiar mensajes previos
    mensajeError.textContent = '';

    // Lógica de validación
    if (usuarioIngresado === CREDENCIALES_VALIDAS.usuario && 
        contrasenaIngresada === CREDENCIALES_VALIDAS.contrasena) {
        
        // Éxito: Guardamos una sesión simple (opcional) y redirigimos
        localStorage.setItem('estaAutenticado', 'true');
        alert('¡Bienvenido al sistema!');
        
        // Cambia 'dashboard.html' por tu página de destino
        window.location.href = 'index.html';
        
    } else {
        // Error: Mostramos feedback al usuario
        mensajeError.textContent = 'Usuario o contraseña incorrectos.';
        inputContrasena.value = ''; // Limpiamos la clave por seguridad
        inputContrasena.focus();
    }
});