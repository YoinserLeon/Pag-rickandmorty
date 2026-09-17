// Controlador para el Formulario de Registro de Usuario y Validaciones en Tiempo Real
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const correoInput = document.getElementById('correo') || document.getElementById('email');
  const passwordInput = document.getElementById('contrasena') || document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmarContrasena') || document.getElementById('confirmPassword');
  
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  const togglePasswordBtn = document.getElementById('togglePassword');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');

  // 1. Mostrar/Ocultar Contraseña
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

  // 2. Mostrar/Ocultar Confirmar Contraseña
  if (toggleConfirmPasswordBtn && confirmPasswordInput) {
    toggleConfirmPasswordBtn.addEventListener('click', () => {
      const tipoActual = confirmPasswordInput.getAttribute('type');
      const icono = toggleConfirmPasswordBtn.querySelector('i');

      if (tipoActual === 'password') {
        confirmPasswordInput.setAttribute('type', 'text');
        if (icono) {
          icono.classList.remove('fa-eye');
          icono.classList.add('fa-eye-slash');
        }
      } else {
        confirmPasswordInput.setAttribute('type', 'password');
        if (icono) {
          icono.classList.remove('fa-eye-slash');
          icono.classList.add('fa-eye');
        }
      }
    });
  }

  // Resaltar campos con bordes de color según validez (Verde / Rojo)
  function marcarCampo(input, esValido) {
    if (!input) return;
    input.classList.remove('border-gray-300', 'border-red-500', 'border-green-500', 'focus:ring-red-500', 'focus:ring-green-500');
    if (esValido) {
      input.classList.add('border-green-500', 'focus:ring-green-500');
    } else {
      input.classList.add('border-red-500', 'focus:ring-red-500');
    }
  }
  
  // Escuchadores de eventos de entrada para validación en tiempo real
  if (nombreInput) {
    nombreInput.addEventListener('input', () => {
      marcarCampo(nombreInput, nombreInput.value.trim().length > 0);
    });
  }

  if (apellidoInput) {
    apellidoInput.addEventListener('input', () => {
      marcarCampo(apellidoInput, apellidoInput.value.trim().length > 0);
    });
  }

  if (correoInput) {
    correoInput.addEventListener('input', () => {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      marcarCampo(correoInput, regexCorreo.test(correoInput.value.trim()));
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      marcarCampo(passwordInput, regexPassword.test(passwordInput.value.trim()));
      
      if (confirmPasswordInput && confirmPasswordInput.value.trim() !== '') {
        const coincide = confirmPasswordInput.value.trim() === passwordInput.value.trim();
        marcarCampo(confirmPasswordInput, coincide);
      }
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      const coincide = confirmPasswordInput.value.trim() === passwordInput.value.trim() && confirmPasswordInput.value.trim() !== '';
      marcarCampo(confirmPasswordInput, coincide);
    });
  }

  // Envío del formulario de registro
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = nombreInput ? nombreInput.value.trim() : '';
    const apellido = apellidoInput ? apellidoInput.value.trim() : '';
    const correo = correoInput ? correoInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const nombreValido = nombre.length > 0;
    const apellidoValido = apellido.length > 0;
    const correoValido = regexCorreo.test(correo);
    const passwordValido = regexPassword.test(password);
    const confirmValido = password !== '' && password === confirmPassword;

    marcarCampo(nombreInput, nombreValido);
    marcarCampo(apellidoInput, apellidoValido);
    marcarCampo(correoInput, correoValido);
    marcarCampo(passwordInput, passwordValido);
    marcarCampo(confirmPasswordInput, confirmValido);

    if (!nombreValido || !apellidoValido || !correoValido || !passwordValido || !confirmValido) {
      mostrarError('Por favor, completa correctamente todos los campos marcados en rojo.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Prevenir duplicidad de cuentas por correo
    const correoExistente = usuarios.some(u => (u.correo === correo || u.email === correo));
    if (correoExistente) {
      marcarCampo(correoInput, false);
      mostrarError('Este correo electrónico ya se encuentra registrado.');
      return;
    }

    // Registrar nuevo usuario en la lista
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre,
      apellido,
      correo,
      contrasena: password
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    if (errorMessage) errorMessage.classList.add('hidden');

    if (successMessage) {
      successMessage.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';
      successMessage.classList.remove('hidden');
    } else {
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    }

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
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