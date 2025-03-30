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
             console.log("SessionManager: Écouteur ajouté pour save-session-btn");
        } else {
            console.warn("SessionManager: Bouton 'save-session-btn' non trouvé.");
        }

        if (newButton) {
            newButton.addEventListener('click', this.startNewSession.bind(this));
             console.log("SessionManager: Écouteur ajouté pour new-session-btn");
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
             console.log("SessionManager: Écouteur ajouté pour load-session-select");
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

         loadSelect.innerHTML = '<option value="">Charger une session...</option>'; // Option par défaut

        // Trier les sessions par date (plus récente en premier)
        const sortedSessionIds = Object.keys(this.sessions).sort((a, b) => {
            const timeA = typeof this.sessions[a]?.timestamp === 'number' ? this.sessions[a].timestamp : 0;
            const timeB = typeof this.sessions[b]?.timestamp === 'number' ? this.sessions[b].timestamp : 0;
            return timeB - timeA;
        });

        sortedSessionIds.forEach(sessionId => {
            const session = this.sessions[sessionId];
            if (session && session.name && typeof session.timestamp === 'number') {
                const option = document.createElement('option');
                option.value = sessionId;
                 const dateString = new Date(session.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                option.textContent = `${session.name} (${dateString})`;
                loadSelect.appendChild(option);
            } else {
                console.warn(`SessionManager: Session invalide ignorée: ID ${sessionId}`, session);
            }
        });
         console.log(`SessionManager: Liste des sessions mise à jour avec ${sortedSessionIds.length} sessions valides.`);
    }

    getCurrentSessionData() {
         console.log("SessionManager: getCurrentSessionData - Collecte des données actuelles.");
         const data = {
            keywords: localStorage.getItem('bdKeywords') || '',
            scenario: localStorage.getItem('bdScenario') || '',
            storyboard: localStorage.getItem('bdStoryboard') || '',
            prompts: localStorage.getItem('bdPrompts') || '',
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
            console.log("SessionManager: Sauvegarde annulée.");
            alert("Sauvegarde annulée.");
            return;
        }

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sessionData = this.getCurrentSessionData();
         sessionData.name = sessionName.trim();
         sessionData.timestamp = Date.now();

        this.sessions[sessionId] = sessionData;
        this.currentSessionId = sessionId;

        localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
        this.saveAllSessions();

        console.log(`SessionManager: Session "${sessionName}" sauvegardée (ID: ${sessionId})`);
        alert(`Session "${sessionName}" sauvegardée !`);

        this.updateSessionsList();
        this.updateCurrentSessionInfo();
    }

    startNewSession() {
        console.log("SessionManager: startNewSession - Tentative.");
        if (confirm("Voulez-vous vraiment commencer une nouvelle session ?\nToutes les modifications non sauvegardées seront perdues.")) {
            console.log("SessionManager: Confirmation nouvelle session.");
            try {
                const keysToRemove = ['bdKeywords', 'bdScenario', 'bdStoryboard', 'bdPrompts', this.currentSessionIdKey];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                 console.log("SessionManager: Données spécifiques effacées.");
                this.currentSessionId = null;
                 window.location.href = 'index.html?newsession=' + Date.now();
            } catch (error) {
                console.error("SessionManager: Erreur startNewSession:", error);
                alert("Erreur lors de la création de la nouvelle session.");
            }
        } else {
            console.log("SessionManager: Nouvelle session annulée.");
        }
    }

    loadSession(sessionId) {
        console.log(`SessionManager: loadSession - Tentative ID: ${sessionId}`);
        const sessionToLoad = this.sessions[sessionId];

        if (!sessionToLoad || typeof sessionToLoad !== 'object') {
            console.error(`SessionManager: Session ${sessionId} non trouvée/invalide.`);
            alert("Erreur : Session introuvable !");
             if(this.sessions[sessionId]) { delete this.sessions[sessionId]; this.saveAllSessions(); this.updateSessionsList(); }
            return;
        }

        const sessionName = sessionToLoad.name || `Session ${sessionId}`;
        if (confirm(`Voulez-vous charger la session "${sessionName}" ?\nToutes les modifications non sauvegardées seront perdues.`)) {
             console.log(`SessionManager: Confirmation chargement "${sessionName}".`);
            try {
                this.currentSessionId = sessionId;
                localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
                localStorage.setItem('bdKeywords', sessionToLoad.keywords || '');
                localStorage.setItem('bdScenario', sessionToLoad.scenario || '');
                localStorage.setItem('bdStoryboard', sessionToLoad.storyboard || '');
                localStorage.setItem('bdPrompts', sessionToLoad.prompts || '');
                 console.log("SessionManager: Données restaurées.");
                this.updateCurrentSessionInfo(); // Mettre à jour nom avant rechargement
                alert(`Session "${sessionName}" chargée. Rechargement...`);
                window.location.reload();
            } catch (error) {
                 console.error(`SessionManager: Erreur chargement session ${sessionId}:`, error);
                 alert("Erreur lors du chargement de la session.");
            }
        } else {
            console.log("SessionManager: Chargement annulé.");
        }
    }

    updateCurrentSessionInfo() {
        const sessionNameElement = document.getElementById('current-session-name');
        if (!sessionNameElement) { return; } // Pas grave si pas sur toutes les pages

        let currentName = "Nouvelle session";
        if (this.currentSessionId && this.sessions[this.currentSessionId] && this.sessions[this.currentSessionId].name) {
            currentName = this.sessions[this.currentSessionId].name;
            console.log(`SessionManager: updateCurrentSessionInfo - Active: "${currentName}" (ID: ${this.currentSessionId})`);
        } else {
             console.log(`SessionManager: updateCurrentSessionInfo - Aucune session active.`);
             if(this.currentSessionId && !this.sessions[this.currentSessionId]) {
                 console.warn(`SessionManager: ID ${this.currentSessionId} invalide. Nettoyage.`);
                 localStorage.removeItem(this.currentSessionIdKey); this.currentSessionId = null;
             }
        }
        sessionNameElement.textContent = currentName;
        sessionNameElement.title = this.currentSessionId ? `ID: ${this.currentSessionId}` : "Aucune session active";
    }

    loadAllSessions() {
        console.log("SessionManager: loadAllSessions - Chargement.");
        try {
            const sessionsJson = localStorage.getItem(this.localStorageKey);
            if (!sessionsJson) { console.log("SessionManager: Aucune session trouvée."); return {}; }
            const parsedSessions = JSON.parse(sessionsJson);
             if (typeof parsedSessions === 'object' && parsedSessions !== null && !Array.isArray(parsedSessions)) {
                  console.log(`SessionManager: ${Object.keys(parsedSessions).length} sessions chargées.`);
                 return parsedSessions;
             } else {
                  console.warn("SessionManager: Données sessions invalides. Réinitialisation.");
                  localStorage.removeItem(this.localStorageKey); return {};
             }
        } catch (error) {
            console.error("SessionManager: Erreur parsing sessions:", error);
            localStorage.removeItem(this.localStorageKey); return {};
        }
    }

    saveAllSessions() {
        console.log("SessionManager: saveAllSessions - Sauvegarde.");
        try {
            const sessionsJson = JSON.stringify(this.sessions);
            localStorage.setItem(this.localStorageKey, sessionsJson);
             console.log(`SessionManager: ${Object.keys(this.sessions).length} sessions sauvegardées.`);
        } catch (error) {
            console.error("SessionManager: Erreur sérialisation sessions:", error);
            alert("Erreur sauvegarde sessions.");
        }
    }
}

// Créer une instance globale (vérifier si elle existe déjà pour éviter doublons si script chargé plusieurs fois)
if (typeof window.bdSessionManager === 'undefined') {
    window.bdSessionManager = new SessionManager();
} else {
    console.warn("SessionManager: Tentative de recréer instance existante.");
}
console.log("bd_creator_session_manager.js chargé et instance créée/vérifiée.");