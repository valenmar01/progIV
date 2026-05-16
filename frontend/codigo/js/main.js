document.addEventListener('DOMContentLoaded', () => {
  const sesionActiva = localStorage.getItem('estaAutenticado');
  if (sesionActiva !== 'true') {
    window.location.href = 'login.html';
  } else {
    document.getElementById('pantalla-app').style.display = 'block';
  }
});

document.querySelectorAll('.btn-pestana').forEach(enlace => {
  enlace.addEventListener('click', function () {
    document.querySelectorAll('.btn-pestana').forEach(el => el.classList.remove('activo'));
    this.classList.add('activo');
  });
});