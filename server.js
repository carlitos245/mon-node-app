// Importer les modules nécessaires
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');

// Initialiser une application Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Ajout de la Politique de Sécurité de Contenu (CSP)
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'"
    );
    next();
});

// Limitation des requêtes (Rate Limiting)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Trop de requêtes, essayez plus tard.'
});
app.use(limiter);

// Servir les fichiers statiques depuis le dossier "public"
app.use(express.static('public'));

// Gestion des événements Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté.');

    socket.on('user connected', (data) => {
        const pseudo = data.pseudo;
        const email = data.email;

        console.log(`Utilisateur identifié : ${pseudo}, Email : ${email}`);

        // Diffuser uniquement le pseudo aux autres utilisateurs
        socket.broadcast.emit('user connected', { pseudo });
    });

    socket.on('chat message', (msg) => {
        console.log("Message reçu :", msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur a quitté le chat.');
    });
});

// Lancer le serveur
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
