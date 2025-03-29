--- UPDATED FILE bd_creator_session_manager.js ---
/**
 * BD Creator - Session Manager (Completely Rewritten)
 */

// Class to manage sessions
class SessionManager {
    constructor() {
        console.log("SessionManager: Initializing...");

        // Load the current session ID from local storage
        this.currentSessionId = localStorage.getItem('currentSessionId') || null;

        // Load all sessions from local storage
        this.sessions = this.loadAllSessions();

        // Initialize the UI
        this.initUI();
    }

    // Initialize the user interface
    initUI() {
        console.log("SessionManager: Initializing UI...");

        // Add event listeners to buttons and select elements
        this.addEventListeners();

        // Update the session list in the select element
        this.updateSessionsList();

        // Update the current session information display
        this.updateCurrentSessionInfo();
    }

    // Add event listeners for buttons and select element
    addEventListeners() {
        console.log("SessionManager: Adding event listeners...");

        // Save Session Button
        const saveButton = document.getElementById('save-session-btn');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                console.log("SessionManager: Save button clicked");
                this.saveCurrentSession();
            });
        } else {
            console.error("SessionManager: Save button not found");
        }

        // New Session Button
        const newButton = document.getElementById('new-session-btn');
        if (newButton) {
            newButton.addEventListener('click', () => {
                console.log("SessionManager: New button clicked");
                this.startNewSession();
            });
        } else {
            console.error("SessionManager: New button not found");
        }

        // Load Session Select
        const loadSelect = document.getElementById('load-session-select');
        if (loadSelect) {
            loadSelect.addEventListener('change', (event) => {
                const sessionId = event.target.value;
                if (sessionId) {
                    console.log(`SessionManager: Loading session ${sessionId}`);
                    this.loadSession(sessionId);
                }
            });
        } else {
            console.error("SessionManager: Load select not found");
        }
    }

    // Update the list of sessions in the "Load Session" select element
    updateSessionsList() {
        console.log("SessionManager: Updating session list...");
        const loadSelect = document.getElementById('load-session-select');

        if (loadSelect) {
            loadSelect.innerHTML = '<option value="">Charger une session...</option>'; // Clear existing options

            for (const sessionId in this.sessions) {
                const session = this.sessions[sessionId];
                const option = document.createElement('option');
                option.value = sessionId;
                option.textContent = `${session.name} (${new Date(session.timestamp).toLocaleString()})`;
                loadSelect.appendChild(option);
            }
        } else {
            console.error("SessionManager: Load select not found");
        }
    }

    // Save the current session
    saveCurrentSession() {
        console.log("SessionManager: Saving current session...");

        const sessionName = prompt("Enter a name for this session:", `My BD - ${new Date().toLocaleDateString()}`);
        if (!sessionName) return; // User cancelled

        // Collect session data (you'll need to adapt this to your actual data)
        const sessionData = {
            name: sessionName,
            timestamp: Date.now(),
            keywords: localStorage.getItem('bdKeywords') || '', // Add other data as needed
            scenario: localStorage.getItem('bdScenario') || '',
            storyboard: localStorage.getItem('bdStoryboard') || '',
            prompts: localStorage.getItem('bdPrompts') || '',
        };

        // Generate a unique session ID
        const sessionId = `session_${Date.now()}`;

        // Set the current session ID
        this.currentSessionId = sessionId;
        localStorage.setItem('currentSessionId', sessionId);

        // Store the session data
        this.sessions[sessionId] = sessionData;
        this.saveAllSessions();

        // Update the UI
        this.updateSessionsList();
        this.updateCurrentSessionInfo(sessionName);

        alert("Session saved successfully!");
    }

    // Start a new session
    startNewSession() {
        console.log("SessionManager: Starting new session...");

        if (confirm("Are you sure you want to start a new session? Unsaved changes will be lost.")) {
            // Clear local storage (adapt this to clear only the necessary keys)
            for (const key in localStorage) {
                if (key.startsWith('bd')) {
                    localStorage.removeItem(key);
                }
            }

            // Reload the page (or navigate to the main page)
            window.location.href = "index.html";
        }
    }

    // Load a saved session
    loadSession(sessionId) {
        console.log(`SessionManager: Loading session ${sessionId}...`);

        const session = this.sessions[sessionId];
        if (!session) {
            alert("Session not found!");
            return;
        }

        if (confirm(`Load session "${session.name}"? Unsaved changes will be lost.`)) {
            // Set the current session ID
            this.currentSessionId = sessionId;
            localStorage.setItem('currentSessionId', sessionId);

            // Restore session data (adapt this to your actual data structure)
            localStorage.setItem('bdKeywords', session.keywords);
            localStorage.setItem('bdScenario', session.scenario);
            localStorage.setItem('bdStoryboard', session.storyboard);
            localStorage.setItem('bdPrompts', session.prompts);
            //Update all the local storage

            // Update the UI
            this.updateCurrentSessionInfo(session.name);

            // Reload the page (or navigate to the appropriate page)
            window.location.href = "index.html";
        }
    }

    // Update the current session information display
    updateCurrentSessionInfo(sessionName) {
        console.log("SessionManager: Updating current session info...");
        const sessionNameElement = document.getElementById('current-session-name');

        if (sessionNameElement) {
            if(sessionName){
            sessionNameElement.textContent = sessionName;
          } else {
            sessionNameElement.textContent = "Nouvelle session";
          }
        } else {
            console.error("SessionManager: Current session name element not found");
        }
    }

    // Load all sessions from local storage
    loadAllSessions() {
        console.log("SessionManager: Loading all sessions...");
        const sessionsJson = localStorage.getItem('bdCreatorSessions');
        return sessionsJson ? JSON.parse(sessionsJson) : {};
    }

    // Save all sessions to local storage
    saveAllSessions() {
        console.log("SessionManager: Saving all sessions...");
        localStorage.setItem('bdCreatorSessions', JSON.stringify(this.sessions));
    }
}

// Initialize SessionManager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing SessionManager...");
    window.bdSessionManager = new SessionManager();
});
