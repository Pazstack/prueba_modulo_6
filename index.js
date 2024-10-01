const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Ruta para obtener todos los animes
app.get('/animes', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'anime.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        const animes = JSON.parse(data);
        res.json(animes);
    });
});

// Ruta para obtener un anime específico por ID
app.get('/animes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, 'data', 'anime.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        const animes = JSON.parse(data);
        const anime = animes[id];
        if (anime) {
            res.json(anime);
        } else {
            res.status(404).send('Anime no encontrado');
        }
    });
});

// Ruta para crear un nuevo anime
app.post('/animes', (req, res) => {
    const newAnime = req.body;
    fs.readFile(path.join(__dirname, 'data', 'anime.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        const animes = JSON.parse(data);
        const newId = (Object.keys(animes).length + 1).toString();
        animes[newId] = newAnime;

        fs.writeFile(path.join(__dirname, 'data', 'anime.json'), JSON.stringify(animes, null, 2), (err) => {
            if (err) {
                console.error('Error al escribir en el archivo:', err);
                return res.status(500).send('Error interno del servidor');
            }
            res.status(201).json({ id: newId, ...newAnime });
        });
    });
});

// Ruta para actualizar un anime
app.put('/animes/:id', (req, res) => {
    const id = req.params.id;
    const updatedAnime = req.body;
    fs.readFile(path.join(__dirname, 'data', 'anime.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        const animes = JSON.parse(data);
        if (animes[id]) {
            animes[id] = updatedAnime;

            fs.writeFile(path.join(__dirname, 'data', 'anime.json'), JSON.stringify(animes, null, 2), (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo:', err);
                    return res.status(500).send('Error interno del servidor');
                }
                res.json({ id, ...updatedAnime });
            });
        } else {
            res.status(404).send('Anime no encontrado');
        }
    });
});

// Ruta para eliminar un anime
app.delete('/animes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, 'data', 'anime.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error interno del servidor');
        }
        const animes = JSON.parse(data);
        if (animes[id]) {
            delete animes[id];

            fs.writeFile(path.join(__dirname, 'data', 'anime.json'), JSON.stringify(animes, null, 2), (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo:', err);
                    return res.status(500).send('Error interno del servidor');
                }
                res.status(204).send();
            });
        } else {
            res.status(404).send('Anime no encontrado');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
