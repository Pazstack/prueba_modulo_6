document.addEventListener("DOMContentLoaded", () => {
    const animeListDiv = document.getElementById('anime-list');
    const form = document.getElementById('anime-form');

    // Función para obtener la lista de animes
    const fetchAnimes = async () => {
        const response = await fetch('/animes');
        const animes = await response.json();
        displayAnimes(animes);
    };

    // Función para mostrar los animes en la interfaz
    const displayAnimes = (animes) => {
        animeListDiv.innerHTML = '';
        for (const key in animes) {
            const anime = animes[key];
            const animeItem = document.createElement('div');
            animeItem.classList.add('anime-item');
            animeItem.innerHTML = `<strong>${anime.nombre}</strong> - ${anime.genero} (${anime.año}) - ${anime.autor}`;
            animeListDiv.appendChild(animeItem);
        }
    };

    // Enviar el formulario para agregar un nuevo anime
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newAnime = {
            nombre: document.getElementById('nombre').value,
            genero: document.getElementById('genero').value,
            año: document.getElementById('año').value,
            autor: document.getElementById('autor').value
        };
        await fetch('/animes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAnime)
        });
        form.reset(); // Limpiar el formulario
        fetchAnimes(); // Actualizar la lista
    });

    fetchAnimes(); // Cargar los animes al iniciar
});
