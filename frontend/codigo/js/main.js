/*código hecho con IA para manejar la sesión y navegación */
/*document.addEventListener('DOMContentLoaded', () => {
      const sesionActiva = localStorage.getItem('sesion_activa');
      if (sesionActiva !== 'true') {
        window.location.href = 'login.html';
      } else {
        document.getElementById('pantalla-app').style.display = 'block';
        document.getElementById('nombre-usuario').textContent = localStorage.getItem('usuario_actual') || 'Usuario';
      }
    });
*/
document.querySelectorAll('.btn-pestana').forEach(enlace => {
  enlace.addEventListener('click', function () {
    document.querySelectorAll('.btn-pestana').forEach(el => el.classList.remove('activo'));
    this.classList.add('activo');
  });
});