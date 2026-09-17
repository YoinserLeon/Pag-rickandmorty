// Controlador para el Formulario de Inicio de Sesión
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const correoInput = document.getElementById('correo') || document.getElementById('email');
  const passwordInput = document.getElementById('contrasena') || document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const togglePasswordBtn = document.getElementById('togglePassword');

  // Alternar visibilidad de la contraseña
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const tipoActual = passwordInput.getAttribute('type');
      const icono = togglePasswordBtn.querySelector('i');

      if (tipoActual === 'password') {
        passwordInput.setAttribute('type', 'text');
        if (icono) {
          icono.classList.remove('fa-eye');
          icono.classList.add('fa-eye-slash');
        }
      } else {
        passwordInput.setAttribute('type', 'password');
        if (icono) {
          icono.classList.remove('fa-eye-slash');
          icono.classList.add('fa-eye');
        }
      }
    });
  }

  // Procesar autenticación del usuario
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const correo = correoInput ? correoInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!correo || !password) {
      mostrarError('Por favor, completa todos los campos.');
      return;
    }

    // Buscar coincidencia en usuarios registrados en localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(u => 
      (u.correo === correo || u.email === correo) && u.contrasena === password
    );

    if (!usuarioEncontrado) {
      mostrarError('Correo o contraseña incorrectos.');
      return;
    }

    if (errorMessage) errorMessage.classList.add('hidden');

    // Guardar usuario autenticado y redirigir al catálogo principal
    localStorage.setItem('usuarioLogueado', JSON.stringify(usuarioEncontrado));

    if (successMessage) {
      successMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
      successMessage.classList.remove('hidden');
    }

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  });

  function mostrarError(mensaje) {
    if (errorMessage) {
      errorMessage.textContent = mensaje;
      errorMessage.classList.remove('hidden');
    } else {
      alert(mensaje);
    }
  }
});