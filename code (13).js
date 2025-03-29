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

         // Garder l'option par défaut
         loadSelect.innerHTML = '<option value="">Charger une session...</option>';

        // Trier les sessions par date (plus récente en premier) pour l'affichage
        const sortedSessionIds = Object.keys(this.sessions).sort((a, b) => {
            // Vérifier que les timestamps existent et sont des nombres avant de trier
            const timeA = typeof this.sessions[a]?.timestamp === 'number' ? this.sessions[a].timestamp : 0;
            const timeB = typeof this.sessions[b]?.timestamp === 'number' ? this.sessions[b].timestamp : 0;
            return timeB - timeA;
        });


        sortedSessionIds.forEach(sessionId => {
            const session = this.sessions[sessionId];
             // Vérifier que la session, son nom et son timestamp existent
            if (session && session.name && typeof session.timestamp === 'number') {
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
                console.warn(`SessionManager: Session invalide ou incomplète ignorée: ID ${sessionId}`, session);
                 // Optionnel: supprimer la session invalide du stockage
                 // delete this.sessions[sessionId];
                 // this.saveAllSessions();
            }
        });
         console.log(`SessionManager: Liste des sessions mise à jour avec ${sortedSessionIds.length} sessions valides.`);
    }

    getCurrentSessionData() {
         console.log("SessionManager: getCurrentSessionData - Collecte des données actuelles.");
         const data = {
            keywords: localStorage.getItem('bdKeywords') || '',
            scenario: localStorage.getItem('bdScenario') || '', // Doit être une chaîne JSON valide ou vide
            storyboard: localStorage.getItem('bdStoryboard') || '', // Doit être une chaîne JSON valide ou vide
            prompts: localStorage.getItem('bdPrompts') || '', // Doit être une chaîne JSON valide ou vide
            // currentPage: window.location.pathname.split('/').pop() || 'index.html', // Optionnel
         };
          console.log("SessionManager: Données collectées pour la sauvegarde:", data);
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

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sessionData = this.getCurrentSessionData();

         sessionData.name = sessionName.trim();
         sessionData.timestamp = Date.now(); // Timestamp numérique

        this.sessions[sessionId] = sessionData;
        this.currentSessionId = sessionId;

        localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
        this.saveAllSessions(); // Sauvegarde l'objet 'sessions' complet

        console.log(`SessionManager: Session "${sessionName}" sauvegardée avec ID: ${sessionId}`);
        alert(`Session "${sessionName}" sauvegardée avec succès !`);

        this.updateSessionsList();
        this.updateCurrentSessionInfo();
    }

    startNewSession() {
        console.log("SessionManager: startNewSession - Tentative.");
        if (confirm("Voulez-vous vraiment commencer une nouvelle session ?\nToutes les modifications non sauvegardées seront perdues.")) {
            console.log("SessionManager: Confirmation reçue pour nouvelle session.");
            try {
                // Effacer les données spécifiques au projet du localStorage
                const keysToRemove = ['bdKeywords', 'bdScenario', 'bdStoryboard', 'bdPrompts', this.currentSessionIdKey];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                 console.log("SessionManager: Données de session spécifiques effacées du localStorage.");

                this.currentSessionId = null;

                 // Recharger la page d'accueil pour un état propre
                 window.location.href = 'index.html?newsession=' + Date.now(); // Ajouter un paramètre pour forcer le rechargement sans cache

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

        if (!sessionToLoad || typeof sessionToLoad !== 'object') { // Vérifier que c'est un objet valide
            console.error(`SessionManager: Session avec ID ${sessionId} non trouvée ou invalide.`);
            alert("Erreur : Session introuvable ou invalide !");
            // Optionnel: Nettoyer la session invalide
             if(this.sessions[sessionId]) {
                delete this.sessions[sessionId];
                this.saveAllSessions();
                this.updateSessionsList();
             }
            return;
        }

        const sessionName = sessionToLoad.name || `Session du ${new Date(sessionToLoad.timestamp || Date.now()).toLocaleDateString()}`;
        if (confirm(`Voulez-vous charger la session "${sessionName}" ?\nToutes les modifications non sauvegardées seront perdues.`)) {
             console.log(`SessionManager: Confirmation reçue pour charger la session "${sessionName}".`);
            try {
                this.currentSessionId = sessionId;
                localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);

                // Restaurer les données : utiliser || '' pour éviter "undefined" ou "null" textuels
                localStorage.setItem('bdKeywords', sessionToLoad.keywords || '');
                localStorage.setItem('bdScenario', sessionToLoad.scenario || ''); // Sera une chaîne JSON ou vide
                localStorage.setItem('bdStoryboard', sessionToLoad.storyboard || ''); // Sera une chaîne JSON ou vide
                localStorage.setItem('bdPrompts', sessionToLoad.prompts || ''); // Sera une chaîne JSON ou vide
                 console.log("SessionManager: Données restaurées dans localStorage.");

                // Mettre à jour l'affichage du nom immédiatement (avant rechargement)
                this.updateCurrentSessionInfo();

                // Recharger la page pour appliquer complètement l'état chargé
                alert(`Session "${sessionName}" chargée. La page va maintenant se recharger.`);
                window.location.reload(); // Rechargement simple

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
            // Ne pas considérer comme une erreur critique si l'élément n'est pas sur toutes les pages
            // console.warn("SessionManager: Élément 'current-session-name' non trouvé.");
            return;
        }

        let currentName = "Nouvelle session"; // Défaut plus clair
        if (this.currentSessionId && this.sessions[this.currentSessionId] && this.sessions[this.currentSessionId].name) {
            currentName = this.sessions[this.currentSessionId].name;
            console.log(`SessionManager: updateCurrentSessionInfo - Session active: "${currentName}" (ID: ${this.currentSessionId})`);
        } else {
             console.log(`SessionManager: updateCurrentSessionInfo - Aucune session sauvegardée active.`);
             // Si currentSessionId existe mais pas la session correspondante, nettoyer
             if(this.currentSessionId && !this.sessions[this.currentSessionId]) {
                 console.warn(`SessionManager: ID de session actuel (${this.currentSessionId}) ne correspond à aucune session connue. Nettoyage.`);
                 localStorage.removeItem(this.currentSessionIdKey);
                 this.currentSessionId = null;
             }
        }

        sessionNameElement.textContent = currentName;
        sessionNameElement.title = this.currentSessionId ? `ID de session: ${this.currentSessionId}` : "Aucune session sauvegardée active";
    }

    loadAllSessions() {
        console.log("SessionManager: loadAllSessions - Chargement depuis localStorage.");
        try {
            const sessionsJson = localStorage.getItem(this.localStorageKey);
            if (!sessionsJson) {
                console.log("SessionManager: Aucune donnée de session trouvée dans localStorage.");
                return {};
            }
            const parsedSessions = JSON.parse(sessionsJson);
             if (typeof parsedSessions === 'object' && parsedSessions !== null && !Array.isArray(parsedSessions)) { // Doit être un objet, pas un tableau
                  console.log(`SessionManager: ${Object.keys(parsedSessions).length} sessions chargées.`);
                 return parsedSessions;
             } else {
                  console.warn("SessionManager: Données de sessions invalides (pas un objet) dans localStorage. Réinitialisation.");
                  localStorage.removeItem(this.localStorageKey);
                  return {};
             }
        } catch (error) {
            console.error("SessionManager: Erreur lors du parsing des sessions depuis localStorage:", error);
            localStorage.removeItem(this.localStorageKey); // Supprimer les données corrompues
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
}

// Créer une instance globale pour un accès facile si nécessaire
// Assurez-vous que ce script est chargé avant ceux qui pourraient l'utiliser.
if (typeof window.bdSessionManager === 'undefined') {
    window.bdSessionManager = new SessionManager();
} else {
    console.warn("SessionManager: Tentative de recréer une instance existante.");
}


console.log("bd_creator_session_manager.js chargé et instance créée/vérifiée.");