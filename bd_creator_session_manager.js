
```javascript
// --- UPDATED FILE bd_creator_session_manager.js ---
/**
 * BD Creator - Session Manager
 * Gère la sauvegarde et le chargement des sessions de travail.
 */
class SessionManager {
    constructor() {
        console.log("SessionManager: Initialisation...");
        this.localStorageKey = 'bdCreatorSessions'; // Clé pour stocker toutes les sessions
        this.currentSessionIdKey = 'currentSessionId'; // Clé pour l'ID de la session actuelle

        this.currentSessionId = localStorage.getItem(this.currentSessionIdKey) || null;
        this.sessions = this.loadAllSessions(); // Charger toutes les sessions au démarrage

        // Nettoyer les sessions invalides ou trop anciennes si nécessaire (optionnel)
        // this.cleanupSessions();

         // Mettre à jour l'UI immédiatement après le chargement du DOM
         document.addEventListener('DOMContentLoaded', () => {
            console.log("SessionManager: DOM chargé, initialisation de l'UI.");
            this.initUI();
         });
    }

    initUI() {
        console.log("SessionManager: initUI - Initialisation de l'interface utilisateur.");
        this.addEventListeners();
        this.updateSessionsList();
        this.updateCurrentSessionInfo(); // Mettre à jour le nom de la session actuelle affiché
    }

    addEventListeners() {
        console.log("SessionManager: addEventListeners - Ajout des écouteurs.");
        const saveButton = document.getElementById('save-session-btn');
        const newButton = document.getElementById('new-session-btn');
        const loadSelect = document.getElementById('load-session-select');

        // Utiliser .bind(this) pour conserver le contexte de l'instance SessionManager
        if (saveButton) {
            saveButton.addEventListener('click', this.saveCurrentSession.bind(this));
        } else {
            console.warn("SessionManager: Bouton 'save-session-btn' non trouvé.");
        }

        if (newButton) {
            newButton.addEventListener('click', this.startNewSession.bind(this));
        } else {
            console.warn("SessionManager: Bouton 'new-session-btn' non trouvé.");
        }

        if (loadSelect) {
            loadSelect.addEventListener('change', (event) => {
                const sessionId = event.target.value;
                if (sessionId) {
                     console.log(`SessionManager: Sélection pour chargement - ID: ${sessionId}`);
                    this.loadSession(sessionId);
                    event.target.value = ""; // Réinitialiser le select après sélection
                }
            });
        } else {
            console.warn("SessionManager: Sélecteur 'load-session-select' non trouvé.");
        }
    }

    updateSessionsList() {
        console.log("SessionManager: updateSessionsList - Mise à jour de la liste déroulante.");
        const loadSelect = document.getElementById('load-session-select');
        if (!loadSelect) {
             console.warn("SessionManager: Sélecteur 'load-session-select' non trouvé pour mise à jour.");
            return;
        }


        const currentList = Array.from(loadSelect.options).map(opt => opt.value);
        const sessionsToAdd = { ...this.sessions }; // Copie pour manipulation

         // Garder l'option par défaut
         loadSelect.innerHTML = '<option value="">Charger une session...</option>';

        // Trier les sessions par date (plus récente en premier) pour l'affichage
        const sortedSessionIds = Object.keys(this.sessions).sort((a, b) => {
            return (this.sessions[b].timestamp || 0) - (this.sessions[a].timestamp || 0);
        });

        sortedSessionIds.forEach(sessionId => {
            const session = this.sessions[sessionId];
            if (session && session.name && session.timestamp) { // Vérifier que la session est valide
                const option = document.createElement('option');
                option.value = sessionId;
                 // Formatage de la date plus lisible
                 const dateString = new Date(session.timestamp).toLocaleString('fr-FR', {
                     day: '2-digit', month: '2-digit', year: 'numeric',
                     hour: '2-digit', minute: '2-digit'
                 });
                option.textContent = `${session.name} (${dateString})`;
                loadSelect.appendChild(option);
            } else {
                console.warn(`SessionManager: Session invalide ou incomplète ignorée: ID ${sessionId}`);
                 // Optionnel: supprimer la session invalide du stockage
                 // delete this.sessions[sessionId];
                 // this.saveAllSessions();
            }
        });
         console.log(`SessionManager: Liste des sessions mise à jour avec ${sortedSessionIds.length} sessions.`);
    }

    getCurrentSessionData() {
         console.log("SessionManager: getCurrentSessionData - Collecte des données actuelles.");
         // Récupérer les données pertinentes de l'état actuel de l'application
         // (Probablement depuis localStorage, mais pourrait être depuis des variables globales ou l'état d'un framework)
         const data = {
            // Utiliser || '' pour éviter de stocker 'null' textuellement si l'item n'existe pas
            keywords: localStorage.getItem('bdKeywords') || '',
            scenario: localStorage.getItem('bdScenario') || '',
            storyboard: localStorage.getItem('bdStoryboard') || '',
            prompts: localStorage.getItem('bdPrompts') || '',
             // Ajouter d'autres éléments pertinents si nécessaire
             // currentPage: window.location.pathname.split('/').pop() || 'index.html',
             // scrollPosition: window.scrollY // Exemple
         };
          console.log("SessionManager: Données collectées:", data);
         return data;
    }


    saveCurrentSession() {
        console.log("SessionManager: saveCurrentSession - Tentative de sauvegarde.");
        const defaultName = `Ma BD ${new Date().toLocaleDateString('fr-FR')}`;
        const sessionName = prompt("Donnez un nom à cette session :", defaultName);

        if (!sessionName || sessionName.trim() === "") {
            console.log("SessionManager: Sauvegarde annulée par l'utilisateur ou nom invalide.");
            alert("Sauvegarde annulée. Veuillez fournir un nom valide.");
            return;
        }

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; // ID plus unique
        const sessionData = this.getCurrentSessionData();

         // Ajouter le nom et le timestamp aux données de la session elle-même
         sessionData.name = sessionName.trim();
         sessionData.timestamp = Date.now(); // Utiliser timestamp numérique pour tri facile

        this.sessions[sessionId] = sessionData;
        this.currentSessionId = sessionId;

        // Sauvegarder l'ID actuel et toutes les sessions
        localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
        this.saveAllSessions(); // Sauvegarde l'objet 'sessions' complet

        console.log(`SessionManager: Session "${sessionName}" sauvegardée avec ID: ${sessionId}`);
        alert(`Session "${sessionName}" sauvegardée avec succès !`);

        // Mettre à jour l'UI
        this.updateSessionsList();
        this.updateCurrentSessionInfo();
    }

    startNewSession() {
        console.log("SessionManager: startNewSession - Tentative de démarrage d'une nouvelle session.");
        if (confirm("Voulez-vous vraiment commencer une nouvelle session ?\nToutes les modifications non sauvegardées seront perdues.")) {
            console.log("SessionManager: Confirmation reçue pour nouvelle session.");
            try {
                // Effacer les données spécifiques au projet du localStorage
                const keysToRemove = ['bdKeywords', 'bdScenario', 'bdStoryboard', 'bdPrompts', this.currentSessionIdKey];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                 console.log("SessionManager: Données de session spécifiques effacées du localStorage.");

                // Réinitialiser l'état interne
                this.currentSessionId = null;
                // Pas besoin de vider this.sessions ici, elles restent sauvegardées

                // Option 1: Recharger la page d'accueil proprement
                 // Ajouter un paramètre pour éviter le cache si nécessaire, mais le rechargement simple est souvent suffisant
                 window.location.href = 'index.html';

                 // Option 2: Si vous avez une fonction pour réinitialiser l'état de l'UI sans recharger
                 // resetApplicationState(); // Fonction hypothétique
                 // this.updateCurrentSessionInfo();

            } catch (error) {
                console.error("SessionManager: Erreur lors du démarrage d'une nouvelle session:", error);
                alert("Une erreur est survenue lors de la création de la nouvelle session.");
            }
        } else {
            console.log("SessionManager: Démarrage de nouvelle session annulé.");
        }
    }

    loadSession(sessionId) {
        console.log(`SessionManager: loadSession - Tentative de chargement ID: ${sessionId}`);
        const sessionToLoad = this.sessions[sessionId];

        if (!sessionToLoad) {
            console.error(`SessionManager: Session avec ID ${sessionId} non trouvée.`);
            alert("Erreur : Session introuvable !");
            // Optionnel: rafraîchir la liste si la session a disparu
            // delete this.sessions[sessionId];
            // this.saveAllSessions();
            // this.updateSessionsList();
            return;
        }

        // Confirmation utilisateur
        const sessionName = sessionToLoad.name || `Session du ${new Date(sessionToLoad.timestamp).toLocaleDateString()}`;
        if (confirm(`Voulez-vous charger la session "${sessionName}" ?\nToutes les modifications non sauvegardées seront perdues.`)) {
             console.log(`SessionManager: Confirmation reçue pour charger la session "${sessionName}".`);
            try {
                // Définir comme session actuelle
                this.currentSessionId = sessionId;
                localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);

                // Restaurer les données depuis l'objet session chargé
                localStorage.setItem('bdKeywords', sessionToLoad.keywords || '');
                localStorage.setItem('bdScenario', sessionToLoad.scenario || '');
                localStorage.setItem('bdStoryboard', sessionToLoad.storyboard || '');
                localStorage.setItem('bdPrompts', sessionToLoad.prompts || '');
                 console.log("SessionManager: Données restaurées dans localStorage.");

                // Mettre à jour l'affichage du nom de la session
                this.updateCurrentSessionInfo();

                // Recharger la page pour que l'application prenne en compte les nouvelles données localStorage
                // C'est souvent la manière la plus simple d'assurer un état propre.
                alert(`Session "${sessionName}" chargée. La page va être rechargée.`);
                window.location.reload();

            } catch (error) {
                 console.error(`SessionManager: Erreur lors du chargement de la session ${sessionId}:`, error);
                 alert("Une erreur est survenue lors du chargement de la session.");
            }

        } else {
            console.log("SessionManager: Chargement de session annulé.");
        }
    }

    updateCurrentSessionInfo() {
        const sessionNameElement = document.getElementById('current-session-name');
        if (!sessionNameElement) {
            console.warn("SessionManager: Élément 'current-session-name' non trouvé pour mise à jour info.");
            return;
        }

        let currentName = "Nouvelle session (non sauvegardée)"; // Nom par défaut
        if (this.currentSessionId && this.sessions[this.currentSessionId]) {
            currentName = this.sessions[this.currentSessionId].name || `Session ${this.currentSessionId}`; // Utiliser le nom de la session chargée
             console.log(`SessionManager: updateCurrentSessionInfo - Session actuelle: "${currentName}" (ID: ${this.currentSessionId})`);
        } else {
             console.log(`SessionManager: updateCurrentSessionInfo - Aucune session actuelle chargée.`);
        }

        sessionNameElement.textContent = currentName;
        sessionNameElement.title = this.currentSessionId ? `ID: ${this.currentSessionId}` : "Aucune session active"; // Ajout d'un title pour voir l'ID
    }

    loadAllSessions() {
        console.log("SessionManager: loadAllSessions - Chargement depuis localStorage.");
        try {
            const sessionsJson = localStorage.getItem(this.localStorageKey);
            if (sessionsJson) {
                const parsedSessions = JSON.parse(sessionsJson);
                 // Validation simple : vérifier si c'est un objet
                 if (typeof parsedSessions === 'object' && parsedSessions !== null) {
                      console.log(`SessionManager: ${Object.keys(parsedSessions).length} sessions chargées.`);
                     return parsedSessions;
                 } else {
                      console.warn("SessionManager: Données de sessions invalides dans localStorage. Réinitialisation.");
                      localStorage.removeItem(this.localStorageKey); // Supprimer les données corrompues
                      return {};
                 }
            } else {
                 console.log("SessionManager: Aucune donnée de session trouvée dans localStorage.");
                return {}; // Retourner un objet vide s'il n'y a rien
            }
        } catch (error) {
            console.error("SessionManager: Erreur lors du parsing des sessions depuis localStorage:", error);
            // En cas d'erreur de parsing (données corrompues), réinitialiser
            localStorage.removeItem(this.localStorageKey);
            return {};
        }
    }

    saveAllSessions() {
        console.log("SessionManager: saveAllSessions - Sauvegarde dans localStorage.");
        try {
            const sessionsJson = JSON.stringify(this.sessions);
            localStorage.setItem(this.localStorageKey, sessionsJson);
             console.log(`SessionManager: ${Object.keys(this.sessions).length} sessions sauvegardées.`);
        } catch (error) {
            console.error("SessionManager: Erreur lors de la sérialisation des sessions pour localStorage:", error);
            alert("Erreur critique : Impossible de sauvegarder les sessions. Vérifiez l'espace disque ou la console.");
        }
    }

     // Optionnel: Fonction pour nettoyer les vieilles sessions ou invalides
     cleanupSessions() {
         console.log("SessionManager: Nettoyage des sessions...");
         const now = Date.now();
         const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours en millisecondes
         let changed = false;
         for (const sessionId in this.sessions) {
             const session = this.sessions[sessionId];
             if (!session || !session.timestamp || (now - session.timestamp > maxAge)) {
                 console.log(`SessionManager: Suppression session ancienne/invalide ID: ${sessionId}`);
                 delete this.sessions[sessionId];
                 changed = true;
             }
         }
         if (changed) {
             this.saveAllSessions();
         }
     }
}

// Créer une instance globale pour un accès facile (si nécessaire)
// Assurez-vous que ce script est chargé avant ceux qui pourraient l'utiliser.
// L'initialisation de l'UI se fait maintenant via DOMContentLoaded à l'intérieur du constructeur.
window.bdSessionManager = new SessionManager();

console.log("bd_creator_session_manager.js chargé et instance créée.");
