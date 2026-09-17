// Controlador de la vista principal (Catálogo de Personajes)
import { obtenerPersonajes } from './api.js';
import { verificarAutenticacion, cerrarSesion } from './auth.js';
import { esFavorito, toggleFavorito } from './favorites.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Proteger ruta mediante verificación de sesión
  const usuario = verificarAutenticacion();
  if (!usuario) return;

  // 2. Mostrar saludo personalizado
  const userGreeting = document.getElementById('userGreeting');
  if (userGreeting) {
    userGreeting.textContent = `Hola, ${usuario.nombre || 'Usuario'}!`;
  }

  // 3. Vincular evento de cierre de sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  const contenedor = document.getElementById('characterContainer');
  if (!contenedor) return;

  // Renderizar estado de carga
  contenedor.innerHTML = '<div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10 font-bold"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Cargando 20 personajes...</div>';

  // 4. Obtener personajes y construir las tarjetas UI
  const personajes = await obtenerPersonajes();
  contenedor.innerHTML = '';

  if (personajes && personajes.length > 0) {
    personajes.slice(0, 20).forEach(personaje => {
      // Determinar color de estado (Vivo/Muerto/Desconocido)
      let colorEstado = 'bg-gray-500';
      if (personaje.status === 'Alive') colorEstado = 'bg-green-500';
      else if (personaje.status === 'Dead') colorEstado = 'bg-red-500';

      const favoritoActual = esFavorito(personaje.id);
      const claseCorazon = favoritoActual ? 'fa-solid text-red-500' : 'fa-regular fa-heart text-gray-700';

      const card = document.createElement('div');
      card.className = 'bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative';
      
      card.innerHTML = `
        <div class="relative">
          <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-56 object-cover">
          <button class="btn-favorito absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 p-2.5 rounded-full shadow-md transition transform hover:scale-110 flex items-center justify-center cursor-pointer" title="Marcar como favorito">
            <i class="fa-heart text-xl ${claseCorazon}"></i>
          </button>
        </div>
        <div class="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h3 class="font-black text-lg text-gray-800 dark:text-white truncate mb-1">${personaje.name}</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="w-3 h-3 rounded-full ${colorEstado}"></span>
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-300">${personaje.status} - ${personaje.species}</span>
            </div>
          </div>
        </div>
      `;

      // Evento: Agregar o remover de Favoritos
      const btnFav = card.querySelector('.btn-favorito');
      const iconoFav = btnFav.querySelector('i');

      btnFav.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita redirigir al detalle al hacer clic en el botón
        const esAhoraFavorito = toggleFavorito(personaje);
        iconoFav.className = esAhoraFavorito ? 'fa-solid fa-heart text-xl text-red-500' : 'fa-regular fa-heart text-gray-700';
      });

      // Evento: Redirigir al detalle del personaje
      card.addEventListener('click', () => {
        window.location.href = `character.html?id=${personaje.id}`;
      });

      contenedor.appendChild(card);
    });
  } else {
    contenedor.innerHTML = '<p class="col-span-full text-center text-red-500 font-bold">No se pudieron cargar los personajes.</p>';
  }
});