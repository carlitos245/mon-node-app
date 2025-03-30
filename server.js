//Code pour le Back-End
// Importer les modules nécessaires
const express = require('express');       // Framework pour gérer les requêtes HTTP
const http = require('http');             // Module HTTP pour créer le serveur
const { Server } = require('socket.io');  // Socket.io pour la communication en temps réel

// Initialiser une application Express
const app = express();
const server = http.createServer(app); // Créer un serveur HTTP
const io = new Server(server);         // Lier le serveur à Socket.io

// Servir les fichiers statiques (HTML, CSS, JS) depuis le dossier "public"
app.use(express.static('public'));

// Gestion des événements Socket.io
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté.');

    // Écouter l'événement "user connected" pour enregistrer un nouvel utilisateur
    socket.on('user connected', (data) => {
        console.log(`Utilisateur connecté : ${data.pseudo}, Email : ${data.email}`);
        // Diffuser l'événement à tous les autres utilisateurs
        socket.broadcast.emit('user connected', data);
    });

    // Écouter les messages de chat
    socket.on('chat message', (msg) => {
        console.log(`Message reçu : ${msg}`);
        // Diffuser le message à tous les utilisateurs
        io.emit('chat message', msg);
    });

    // Gérer la déconnexion d'un utilisateur
    socket.on('disconnect', () => {
        console.log('Un utilisateur a quitté le chat.');
    });
});

// Lancer le serveur sur le port 3000
const PORT = 3000;// Change le port à 4000
server.listen(PORT, () => {
    console.log(`Serveur en ligne sur http://localhost:${PORT}`);
});
