/**
 * BD Creator - Session Manager
 * Gère la sauvegarde et le chargement des sessions de travail.
 */
class SessionManager {
    constructor() {
        console.log("SessionManager: Initialisation...");
        this.localStorageKey = 'bdCreatorSessions';
        this.currentSessionIdKey = 'currentSessionId';
        this.currentSessionId = localStorage.getItem(this.currentSessionIdKey) || null;
        this.sessions = this.loadAllSessions();

         document.addEventListener('DOMContentLoaded', () => {
            console.log("SessionManager: DOM chargé, initialisation de l'UI.");
            this.initUI();
         });
    }

    initUI() {
        console.log("SessionManager: initUI.");
        this.addEventListeners();
        this.updateSessionsList();
        this.updateCurrentSessionInfo();
    }

    addEventListeners() {
        console.log("SessionManager: addEventListeners.");
        const saveButton = document.getElementById('save-session-btn');
        const newButton = document.getElementById('new-session-btn');
        const loadSelect = document.getElementById('load-session-select');

        if (saveButton) saveButton.addEventListener('click', this.saveCurrentSession.bind(this));
        else console.warn("SessionManager: Bouton 'save-session-btn' non trouvé.");

        if (newButton) newButton.addEventListener('click', this.startNewSession.bind(this));
        else console.warn("SessionManager: Bouton 'new-session-btn' non trouvé.");

        if (loadSelect) {
            loadSelect.addEventListener('change', (event) => {
                const sessionId = event.target.value;
                if (sessionId) { this.loadSession(sessionId); event.target.value = ""; }
            });
        } else {
            console.warn("SessionManager: Sélecteur 'load-session-select' non trouvé.");
        }
    }

    updateSessionsList() {
        console.log("SessionManager: updateSessionsList.");
        const loadSelect = document.getElementById('load-session-select');
        if (!loadSelect) return;

         loadSelect.innerHTML = '<option value="">Charger une session...</option>';
        const sortedSessionIds = Object.keys(this.sessions).sort((a, b) =>
            (this.sessions[b]?.timestamp || 0) - (this.sessions[a]?.timestamp || 0)
        );

        sortedSessionIds.forEach(sessionId => {
            const session = this.sessions[sessionId];
            if (session && session.name && typeof session.timestamp === 'number') {
                const option = document.createElement('option');
                option.value = sessionId;
                 const dateString = new Date(session.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                option.textContent = `${session.name} (${dateString})`;
                loadSelect.appendChild(option);
            }
        });
         console.log(`SessionManager: Liste sessions MàJ (${sortedSessionIds.length} sessions).`);
    }

    getCurrentSessionData() {
         console.log("SessionManager: getCurrentSessionData.");
         return {
            keywords: localStorage.getItem('bdKeywords') || '',
            scenario: localStorage.getItem('bdScenario') || '',
            storyboard: localStorage.getItem('bdStoryboard') || '',
            prompts: localStorage.getItem('bdPrompts') || '',
         };
    }

    saveCurrentSession() {
        console.log("SessionManager: saveCurrentSession.");
        const defaultName = `Ma BD ${new Date().toLocaleDateString('fr-FR')}`;
        const sessionName = prompt("Donnez un nom à cette session :", defaultName);

        if (!sessionName || sessionName.trim() === "") { alert("Sauvegarde annulée."); return; }

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const sessionData = this.getCurrentSessionData();
         sessionData.name = sessionName.trim();
         sessionData.timestamp = Date.now();

        this.sessions[sessionId] = sessionData;
        this.currentSessionId = sessionId;

        localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
        this.saveAllSessions();
        alert(`Session "${sessionName}" sauvegardée !`);
        this.updateSessionsList();
        this.updateCurrentSessionInfo();
    }

    startNewSession() {
        console.log("SessionManager: startNewSession.");
        if (confirm("Voulez-vous vraiment commencer une nouvelle session ?")) {
            try {
                const keysToRemove = ['bdKeywords', 'bdScenario', 'bdStoryboard', 'bdPrompts', this.currentSessionIdKey];
                keysToRemove.forEach(key => localStorage.removeItem(key));
                 console.log("SessionManager: Données spécifiques effacées.");
                this.currentSessionId = null;
                 window.location.href = 'index.html?newsession=' + Date.now();
            } catch (error) { console.error("SessionManager: Erreur startNewSession:", error); alert("Erreur nouvelle session."); }
        }
    }

    loadSession(sessionId) {
        console.log(`SessionManager: loadSession ID: ${sessionId}`);
        const sessionToLoad = this.sessions[sessionId];
        if (!sessionToLoad || typeof sessionToLoad !== 'object') { alert("Erreur : Session introuvable !"); return; }

        const sessionName = sessionToLoad.name || `Session ${sessionId}`;
        if (confirm(`Charger la session "${sessionName}" ?`)) {
            try {
                this.currentSessionId = sessionId;
                localStorage.setItem(this.currentSessionIdKey, this.currentSessionId);
                localStorage.setItem('bdKeywords', sessionToLoad.keywords || '');
                localStorage.setItem('bdScenario', sessionToLoad.scenario || '');
                localStorage.setItem('bdStoryboard', sessionToLoad.storyboard || '');
                localStorage.setItem('bdPrompts', sessionToLoad.prompts || '');
                console.log("SessionManager: Données restaurées.");
                this.updateCurrentSessionInfo();
                alert(`Session "${sessionName}" chargée. Rechargement...`);
                window.location.reload();
            } catch (error) { console.error(`SessionManager: Erreur chargement session ${sessionId}:`, error); alert("Erreur chargement session."); }
        }
    }

    updateCurrentSessionInfo() {
        const sessionNameElement = document.getElementById('current-session-name');
        if (!sessionNameElement) { return; }
        let currentName = "Nouvelle session";
        if (this.currentSessionId && this.sessions[this.currentSessionId]?.name) {
            currentName = this.sessions[this.currentSessionId].name;
            console.log(`SessionManager: Session active: "${currentName}"`);
        } else {
             console.log(`SessionManager: Aucune session active.`);
             if(this.currentSessionId && !this.sessions[this.currentSessionId]) {
                 console.warn(`SessionManager: ID ${this.currentSessionId} invalide.`);
                 localStorage.removeItem(this.currentSessionIdKey); this.currentSessionId = null;
             }
        }
        sessionNameElement.textContent = currentName;
        sessionNameElement.title = this.currentSessionId ? `ID: ${this.currentSessionId}` : "Aucune session";
    }

    loadAllSessions() {
        console.log("SessionManager: loadAllSessions.");
        try {
            const sessionsJson = localStorage.getItem(this.localStorageKey);
            if (!sessionsJson) return {};
            const parsedSessions = JSON.parse(sessionsJson);
             if (typeof parsedSessions === 'object' && parsedSessions !== null && !Array.isArray(parsedSessions)) { return parsedSessions; }
             else { console.warn("SessionManager: Données sessions invalides."); localStorage.removeItem(this.localStorageKey); return {}; }
        } catch (error) { console.error("SessionManager: Erreur parsing sessions:", error); localStorage.removeItem(this.localStorageKey); return {}; }
    }

    saveAllSessions() {
        console.log("SessionManager: saveAllSessions.");
        try { localStorage.setItem(this.localStorageKey, JSON.stringify(this.sessions)); }
        catch (error) { console.error("SessionManager: Erreur sauvegarde sessions:", error); alert("Erreur sauvegarde sessions."); }
    }
}

// Instance globale
if (typeof window.bdSessionManager === 'undefined') {
    window.bdSessionManager = new SessionManager();
}
console.log("bd_creator_session_manager.js chargé.");