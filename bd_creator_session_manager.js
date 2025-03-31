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
            console.log("SessionManager: DOM chargé, initialisation UI.");
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
        else console.warn(" Bouton 'save-session-btn' non trouvé.");
        if (newButton) newButton.addEventListener('click', this.startNewSession.bind(this));
        else console.warn(" Bouton 'new-session-btn' non trouvé.");
        if (loadSelect) { loadSelect.addEventListener('change', (event) => { const sessionId = event.target.value; if (sessionId) { this.loadSession(sessionId); event.target.value = ""; } }); }
        else { console.warn(" Sélecteur 'load-session-select' non trouvé."); }
    }

    updateSessionsList() {
        // console.log("SessionManager: updateSessionsList."); // Moins verbeux
        const loadSelect = document.getElementById('load-session-select');
        if (!loadSelect) return;
         loadSelect.innerHTML = '<option value="">Charger une session...</option>';
        const sortedSessionIds = Object.keys(this.sessions).sort((a, b) => (this.sessions[b]?.timestamp || 0) - (this.sessions[a]?.timestamp || 0));
        sortedSessionIds.forEach(sessionId => { const session = this.sessions[sessionId]; if (session && session.name && typeof session.timestamp === 'number') { const option = document.createElement('option'); option.value = sessionId; const dateString = new Date(session.timestamp).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); option.textContent = `${session.name} (${dateString})`; loadSelect.appendChild(option); } });
    }

    getCurrentSessionData() {
        // console.log("SessionManager: getCurrentSessionData."); // Moins verbeux
         return { keywords: localStorage.getItem('bdKeywords') || '', scenario: localStorage.getItem('bdScenario') || '', storyboard: localStorage.getItem('bdStoryboard') || '', prompts: localStorage.getItem('bdPrompts') || '', };
    }

    saveCurrentSession() { /* ... Votre code saveCurrentSession ... */ }
    startNewSession() { /* ... Votre code startNewSession ... */ }
loadAllSessions() {
    console.log("SessionManager: loadAllSessions.");
    let sessions = {}; // Initialiser avec un objet vide PAR DÉFAUT
    try {
        const sessionsJson = localStorage.getItem(this.localStorageKey);
        if (sessionsJson) {
            const parsedSessions = JSON.parse(sessionsJson);
             // Vérifier que c'est bien un objet et pas null ou autre chose
             if (typeof parsedSessions === 'object' && parsedSessions !== null && !Array.isArray(parsedSessions)) {
                sessions = parsedSessions; // Assigner seulement si valide
                console.log(`SessionManager: ${Object.keys(sessions).length} sessions chargées.`);
             } else {
                  console.warn("SessionManager: Données sessions invalides (pas un objet). Ignoré.");
                  // Ne pas supprimer la clé ici, juste ignorer pour cette fois
             }
        } else {
             console.log("SessionManager: Aucune session trouvée dans localStorage.");
        }
    } catch (error) {
        console.error("SessionManager: Erreur parsing sessions:", error);
        // Ne pas supprimer la clé ici non plus pour éviter perte si erreur temporaire
    }
    // *** RETOURNER TOUJOURS UN OBJET ***
    return sessions;
}
    updateCurrentSessionInfo() { /* ... Votre code updateCurrentSessionInfo ... */ }
    loadAllSessions() { /* ... Votre code loadAllSessions ... */ }
    saveAllSessions() { /* ... Votre code saveAllSessions ... */ }
}

if (typeof window.bdSessionManager === 'undefined') { window.bdSessionManager = new SessionManager(); }
console.log("bd_creator_session_manager.js chargé.");
