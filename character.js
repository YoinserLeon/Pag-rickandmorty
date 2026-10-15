// Controlador de la vista de Detalle de un Personaje
import { verificarAutenticacion, cerrarSesion } from './auth.js';
import { esFavorito, toggleFavorito } from './favorites.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Validar estado de sesión
  const usuario = verificarAutenticacion();
  if (!usuario) return;

  // 2. Configurar cierre de sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarSesion();
    });
  }

  // 3. Extraer el parámetro ID desde la URL (?id=X)
  const urlParams = new URLSearchParams(window.location.search);
  const characterId = urlParams.get('id');

  const contenedor = document.getElementById('characterDetailContainer');
  if (!characterId) {
    contenedor.innerHTML = '<p class="p-8 text-center text-red-500 font-bold">No se ha especificado un personaje.</p>';
    return;
  }

  try {
    // 4. Consumir el endpoint individual del personaje
    const respuesta = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
    if (!respuesta.ok) throw new Error('No se pudo obtener la información del personaje.');
    
    const personaje = await respuesta.json();

    let colorEstado = 'bg-gray-500';
    if (personaje.status === 'Alive') colorEstado = 'bg-green-500';
    else if (personaje.status === 'Dead') colorEstado = 'bg-red-500';

    const favoritoActual = esFavorito(personaje.id);
    const claseCorazon = favoritoActual ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart text-gray-700';

    // 5. Generar estructura detallada del personaje
    contenedor.innerHTML = `
      <div class="md:w-1/2 relative">
        <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-full object-cover">
        <button id="btnFavDetalle" class="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition transform hover:scale-110 cursor-pointer">
          <i class="fa-solid fa-heart text-2xl ${claseCorazon}"></i>
        </button>
      </div>
      <div class="md:w-1/2 p-8 flex flex-col justify-between">
        <div>
          <h2 class="text-3xl font-black text-gray-800 mb-2">${personaje.name}</h2>
          
          <div class="flex items-center gap-2 mb-6">
            <span class="w-3.5 h-3.5 rounded-full ${colorEstado}"></span>
            <span class="text-base font-semibold text-gray-700">${personaje.status} - ${personaje.species}</span>
          </div>

          <div class="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Género</span>
              <span class="text-gray-800 font-medium">${personaje.gender}</span>
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Origen</span>
              <span class="text-gray-800 font-medium">${personaje.origin.name}</span>
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Última ubicación conocida</span>
              <span class="text-gray-800 font-medium">${personaje.location.name}</span>
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-gray-400">Episodios en los que aparece</span>
              <span class="text-gray-800 font-medium">${personaje.episode.length} episodios</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-gray-200">
          <a href="index.html" class="inline-block bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-md">
            <i class="fa-solid fa-arrow-left mr-2"></i> Volver al catálogo
          </a>
        </div>
      </div>
    `;

    // 6. Activar la acción de favoritos dentro de la vista detallada
    const btnFavDetalle = document.getElementById('btnFavDetalle');
    const iconoFavDetalle = btnFavDetalle.querySelector('i');

    btnFavDetalle.addEventListener('click', () => {
      const esAhoraFavorito = toggleFavorito(personaje);
      iconoFavDetalle.className = esAhoraFavorito ? 'fa-solid fa-heart text-2xl text-red-500' : 'fa-regular fa-heart text-2xl text-gray-700';
    });

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p class="p-8 text-center text-red-500 font-bold">Ocurrió un error al cargar los datos del personaje.</p>';
  }
});