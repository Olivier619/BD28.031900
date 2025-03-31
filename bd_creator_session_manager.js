class SessionManager {
    constructor() {
        this.sanitizeInput = str => str.replace(/[<>]/g, c => ({ '<': '&lt;', '>': '&gt;' }[c]));
        // ... reste du constructeur ...
    }

    saveCurrentSession() {
        const sessionName = this.sanitizeInput(prompt("Nommez cette session :", `Ma BD ${new Date().toLocaleDateString('fr-FR')}`) || '');
        // ... reste de la méthode ...
    }
    // ... autres méthodes avec sanitisation ...
}
}

if (typeof window.bdSessionManager === 'undefined') { window.bdSessionManager = new SessionManager(); }
console.log("bd_creator_session_manager.js chargé.");
