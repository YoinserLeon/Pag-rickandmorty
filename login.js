document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginAlert = document.getElementById('loginAlert');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Obtener la lista de usuarios registrados
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      // Buscar el usuario que coincida
      const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

      if (usuarioEncontrado) {
        // Guardar la sesión activa con la clave exacta que exige el index.html
        localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

        if (loginAlert) {
          loginAlert.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
          loginAlert.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-green-100 text-green-700 border border-green-200';
          loginAlert.classList.remove('hidden');
        }

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      } else {
        if (loginAlert) {
          loginAlert.textContent = 'Correo o contraseña incorrectos.';
          loginAlert.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-red-100 text-red-700 border border-red-200';
          loginAlert.classList.remove('hidden');
        }
      }
    });
  }
});