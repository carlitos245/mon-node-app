// Déclaration globale du socket
let socket;

/**
 * Fonction pour retirer les balises HTML
 * Cette fonction supprime toutes les balises HTML d'un texte (protection XSS)
 */
function stripHtmlTags(text) {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
}

/**
 * Fonction pour échapper les caractères dangereux (protection contre les attaques XSS)
 * Transforme les caractères spéciaux en entités HTML pour éviter l'exécution de scripts
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Fonction pour valider l'email
 * Vérifie que l'email entré correspond à un format correct
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Fonction pour connecter un utilisateur
 * Appelée lorsqu'un utilisateur clique sur le bouton "Se connecter"
 */
function connectUser() {
    console.log("Bouton 'Connexion' cliqué."); // Debug : confirmer l'appel

    const pseudo = document.getElementById('pseudo').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!pseudo || !email) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    if (!validateEmail(email)) {
        alert("Veuillez entrer un email valide !");
        return;
    }

    // Initialiser la connexion Socket.IO après clic
    socket = io();

    // Envoyer le pseudo et l'email au serveur
    socket.emit('user connected', { pseudo, email });
    console.log("Pseudo et email envoyés :", { pseudo, email });

    // Masquer la section de connexion et afficher la section de chat
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';

    // Écouter les notifications de connexion d'autres utilisateurs
    socket.on('user connected', (data) => {
        console.log("Événement 'user connected' reçu depuis le serveur :", data);

        const messageList = document.getElementById('message-list');
        const notification = document.createElement('p');
        notification.textContent = `${escapeHtml(data.pseudo)} a rejoint le chat.`;
        notification.style.color = 'green'; // Style de notification
        messageList.appendChild(notification);
    });

    // Écouter les messages
    socket.on('chat message', (msg) => {
        const messageList = document.getElementById('message-list');
        const newMessage = document.createElement('p');
        newMessage.textContent = msg;
        messageList.appendChild(newMessage);
    });
}

function sendMessage() {
    const messageInput = document.getElementById('message-input').value.trim();
    const messageList = document.getElementById('message-list');

    if (messageInput) {
        // Émettre le message au serveur
        socket.emit('chat message', messageInput);
        console.log("Message envoyé :", messageInput);

        // Ajouter le message localement
        const newMessage = document.createElement('p');
        newMessage.textContent = `Vous : ${escapeHtml(messageInput)}`;
        messageList.appendChild(newMessage);

        // Effacer le champ de saisie
        document.getElementById('message-input').value = '';
    } else {
        alert("Vous ne pouvez pas envoyer un message vide !");
    }
}

/**
 * Écouter les messages reçus du serveur
 */
socket?.on('chat message', (msg) => {
    console.log("Message reçu :", msg);

    const messageList = document.getElementById('message-list');
    const newMessage = document.createElement('p');
    newMessage.textContent = escapeHtml(msg);
    messageList.appendChild(newMessage);
});
