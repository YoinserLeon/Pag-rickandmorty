document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const registerAlert = document.getElementById('registerAlert');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

      // Verificar si el correo ya está registrado
      const existe = usuarios.some(u => u.email === email);
      if (existe) {
        if (registerAlert) {
          registerAlert.textContent = 'Este correo ya está registrado.';
          registerAlert.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-red-100 text-red-700 border border-red-200';
          registerAlert.classList.remove('hidden');
        }
        return;
      }

      // Guardar el nuevo usuario
      const nuevoUsuario = { nombre, email, password };
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      if (registerAlert) {
        registerAlert.textContent = '¡Registro exitoso! Redirigiendo al login...';
        registerAlert.className = 'mb-6 p-4 rounded-lg text-sm font-semibold text-center bg-green-100 text-green-700 border border-green-200';
        registerAlert.classList.remove('hidden');
      }

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  }
});