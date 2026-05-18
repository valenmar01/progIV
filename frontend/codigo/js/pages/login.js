// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasenia = document.getElementById('input-contrasenia');
const mensajeError = document.getElementById('error-login');


formulario.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contraseniaIngresada = inputContrasenia.value.trim();
    
    const res = await fetch("http://localhost:3000/login", {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
            usuario: usuarioIngresado,
            contrasenia: contraseniaIngresada
        })
    });

    const data = await res.json();

    console.log(res);
    console.log(usuarioIngresado);
    console.log(contraseniaIngresada);

    // Limpiar mensajes previos
    mensajeError.textContent = '';

    // Lógica de validación
    if (res.status === 200) { 
                
        // Éxito: Guardamos una sesión simple (opcional) y redirigimos
        localStorage.setItem('estaAutenticado', 'true');
        alert('¡Bienvenido al sistema!');
        
        // Cambia 'dashboard.html' por tu página de destino
        window.location.href = 'index.html';
    
    } else if (res.status === 404) {
      // El backend nos avisó que no existe
      mensajeError.textContent = 'Usuario o contraseña incorrectos.';
      inputContrasenia.value = ''; // Limpiamos la clave por seguridad

      inputUsuario.focus();
      inputContrasenia.focus();

  } else {
      // Cualquier otro error
      mensajeError.textContent = 'Ocurrió un error en el servidor.';    

    } 
});