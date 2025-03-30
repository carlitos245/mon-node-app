//Code pour le Front-End
// Établir une connexion avec le serveur Socket.io
// Assurez-vous que le script `/socket.io/socket.io.js` est inclus dans le fichier HTML
const socket = io();

/**
 * Fonction pour connecter un utilisateur
 * Cette fonction est appelée lorsqu'un utilisateur clique sur le bouton "Se connecter"
 */
function connectUser() {
    const pseudo = document.getElementById('pseudo').value; // Récupérer le pseudo
    const email = document.getElementById('email').value;   // Récupérer l'email

    if (pseudo && email) {
        // Masquer la section de connexion
        document.getElementById('login-section').style.display = 'none';
        // Afficher la section de chat
        document.getElementById('chat-section').style.display = 'block';

        // Envoyer le pseudo de l'utilisateur au serveur pour l'enregistrer
        socket.emit('user connected', { pseudo, email });

        // Afficher un message de bienvenue
        alert(`Bienvenue, ${pseudo} !`);
    } else {
        alert("Veuillez remplir tous les champs !");
    }
}

/**
 * Fonction pour envoyer un message
 * Cette fonction est appelée lorsqu'un utilisateur clique sur le bouton "Envoyer"
 */
function sendMessage() {
    const messageInput = document.getElementById('message-input').value; // Récupérer le message
    const messageList = document.getElementById('message-list');        // Zone pour afficher les messages

    if (messageInput) {
        // Envoyer le message au serveur
        socket.emit('chat message', messageInput);

        // Ajouter le message localement pour l'utilisateur actuel
        const newMessage = document.createElement('p');
        newMessage.textContent = `Vous : ${messageInput}`;
        messageList.appendChild(newMessage);

        // Effacer le champ de saisie après envoi
        document.getElementById('message-input').value = '';
    } else {
        alert("Vous ne pouvez pas envoyer un message vide !");
    }
}

// Écouter les messages du serveur pour les afficher dans le chat
socket.on('chat message', (msg) => {
    const messageList = document.getElementById('message-list');
    const newMessage = document.createElement('p');
    newMessage.textContent = msg; // Afficher le message reçu
    messageList.appendChild(newMessage);
});

// Écouter l'événement "user connected" pour afficher un message quand un autre utilisateur se connecte
socket.on('user connected', (data) => {
    const messageList = document.getElementById('message-list');
    const notification = document.createElement('p');
    notification.textContent = `${data.pseudo} a rejoint le chat.`;
    notification.style.color = 'green'; // Style pour différencier les notifications
    messageList.appendChild(notification);
});
