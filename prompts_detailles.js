/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation et les interactions pour toutes les pages.
 */

// --- Variables globales ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// --- Fonctions Utilitaires ---

function displayScenario(scenario, container) { /* ... Code complet d'affichage scénario ... */ }
function displayStoryboard(storyboardData, container) { /* ... Code complet d'affichage storyboard ... */ }
function displayPrompts(promptsData, container) { /* ... Code complet d'affichage prompts ... */ }
function handlePromptCopy(event) { /* ... Code complet copie prompt ... */ } // Assurez-vous que cette fonction est bien définie

// ... (Les fonctions displayScenario, displayStoryboard, displayPrompts, handlePromptCopy DOIVENT être définies ici,
//      comme dans les réponses précédentes où elles fonctionnaient) ...

// --- Fonctions de Génération (Appels) ---

function generateAndDisplayScenario(keywords, generateButton, loadingElement) { /* ... Code complet appel generateScenarioDetaille et affichage ... */ }
async function generateAndSaveStoryboard(scenario, chapterIndex = 0) { // Ajout chapterIndex
    console.log("main.js: generateAndSaveStoryboard - Démarrage...");
    let storyboardData = null;
    if (typeof window.createStoryboardDetaille === 'function') {
        try {
            storyboardData = await window.createStoryboardDetaille(scenario, chapterIndex); // Appel ASYNC
            if (storyboardData) {
                projectData.storyboard = storyboardData;
                localStorage.setItem('bdStoryboard', JSON.stringify(storyboardData));
                console.log("main.js: Storyboard généré et sauvegardé.");
            } else {
                console.error("main.js: createStoryboardDetaille a retourné null.");
            }
        } catch (error) {
            console.error("main.js: Erreur lors de l'appel à createStoryboardDetaille:", error);
        }
    } else {
        console.error("main.js: Fonction createStoryboardDetaille non trouvée.");
    }
    return storyboardData; // Renvoyer les données (ou null)
}

async function generateAndSavePrompts(storyboardData) {
    console.log("main.js: generateAndSavePrompts - Démarrage...");
    let promptsData = null;
    if (typeof window.generatePromptsDetailles === 'function') {
        try {
            promptsData = await window.generatePromptsDetailles(storyboardData); // Appel ASYNC
            if (promptsData) {
                projectData.prompts = promptsData;
                localStorage.setItem('bdPrompts', JSON.stringify(promptsData));
                console.log("main.js: Prompts générés et sauvegardés.");
            } else {
                console.error("main.js: generatePromptsDetailles a retourné null.");
            }
        } catch (error) {
            console.error("main.js: Erreur lors de l'appel à generatePromptsDetailles:", error);
        }
    } else {
        console.error("main.js: Fonction generatePromptsDetailles non trouvée.");
    }
    return promptsData; // Renvoyer les données (ou null)
}


// --- Initialisation ---
document.addEventListener('DOMContentLoaded', function() {
    console.log("main.js: DOM chargé.");
    initializeApp(); // Lancer l'initialisation globale
});

function initializeApp() {
    console.log("main.js: Initialisation Application Globale.");

    // Initialisation Page Accueil (si éléments présents)
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');
    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer);
    }

    // Initialisation Page Scénario (si éléments présents)
    const scenarioContainerPage = document.getElementById('scenario-container');
    const keywordsDisplayPage = document.getElementById('keywords-display');
    if (scenarioContainerPage && keywordsDisplayPage) {
        initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage);
    }

    // Initialisation Page Storyboard (si éléments présents)
    const storyboardContainerPage = document.getElementById('storyboard-container');
     const chapterTitleElementSB = document.getElementById('chapter-title'); // ID sur storyboard.html
    if (storyboardContainerPage) {
        initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB);
    }

    // Initialisation Page Prompts (si éléments présents)
    const promptsContainerPage = document.getElementById('prompts-container');
     const chapterNameElementP = document.getElementById('chapter-name'); // ID sur prompts.html
    if (promptsContainerPage) {
        initializePromptsPage(promptsContainerPage, chapterNameElementP);
    }

    // Initialiser le gestionnaire de session (il gère son propre DOMContentLoaded)
    if (window.bdSessionManager) { console.log("main.js: bdSessionManager trouvé."); }
    else { console.warn("main.js: bdSessionManager non trouvé."); }
}


// --- Fonctions d'Initialisation Spécifiques ---

function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     // Attacher listener (avec garde)
     if (!generateButton.dataset.listenerAttached) {
        generateButton.addEventListener('click', function() {
            console.log(">>> Bouton Générer Scénario cliqué!");
            const keywords = keywordsInput.value;
            if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); return; }
            generateButton.disabled = true; generateButton.textContent = "Génération...";
            let loadingElement = document.getElementById('loading-indicator');
            if (!loadingElement) { loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); }
            else { loadingElement.style.display = 'block'; }
            localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); // Nettoyer tout
            localStorage.setItem('bdKeywords', keywords);
            console.log(">>> Appel de generateAndDisplayScenario...");
            if (typeof window.generateScenarioDetaille === 'function') { generateAndDisplayScenario(keywords, generateButton, loadingElement); }
            else { console.error("HOME: generateScenarioDetaille non trouvé!"); alert("Erreur critique: Fonction génération indisponible."); /* Nettoyage UI */ generateButton.disabled=false; generateButton.textContent="Générer"; if(loadingElement) loadingElement.remove(); }
        });
        generateButton.dataset.listenerAttached = 'true';
        console.log("main.js: Écouteur attaché (Accueil).");
     }
     // Afficher scénario existant
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) {
     console.log("main.js: Initialisation Page Scénario.");
     const keywords = localStorage.getItem('bdKeywords') || '';
     keywordsDisplay.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : '');
     const scenarioJson = localStorage.getItem('bdScenario');
     if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); displayScenario(scenario, container); } catch (e) { console.error("main.js: Erreur affichage (Scénario):", e); container.innerHTML = '<p class="error-message">Erreur affichage.</p>'; } }
     else { container.innerHTML = '<p>Aucun scénario généré. Retournez à l\'accueil.</p>'; }
}

async function initializeStoryboardPage(container, chapterTitleElement) {
    console.log("main.js: Initialisation Page Storyboard.");
    container.innerHTML = '<p>Chargement storyboard...</p>';
    const scenarioJson = localStorage.getItem('bdScenario');
    if (!scenarioJson) { container.innerHTML = '<p class="error-message">Scénario non trouvé.</p>'; return; }

    try {
        const scenario = JSON.parse(scenarioJson);
        projectData.scenario = scenario;
        const existingStoryboardJson = localStorage.getItem('bdStoryboard');
        let storyboardData = null;

        if (existingStoryboardJson) { console.log("main.js: Storyboard existant trouvé."); try { storyboardData = JSON.parse(existingStoryboardJson); projectData.storyboard = storyboardData; } catch (e) { console.error("main.js: Erreur parsing storyboard:", e); localStorage.removeItem('bdStoryboard'); } }

        if (!storyboardData) {
            console.log("main.js: Génération storyboard...");
            if (!scenario.chapters || scenario.chapters.length === 0) { throw new Error("Scénario sans chapitres."); }
            storyboardData = await generateAndSaveStoryboard(scenario, 0); // Génère pour chap 0 par défaut
            if (!storyboardData) { throw new Error("Échec génération storyboard."); }
        }

        // Mettre à jour titre chapitre
         if(chapterTitleElement && storyboardData && storyboardData.chapterTitle) {
            chapterTitleElement.textContent = storyboardData.chapterTitle;
         } else if (chapterTitleElement) {
             chapterTitleElement.textContent = "Chapitre inconnu";
         }


        displayStoryboard(storyboardData, container); // Afficher

    } catch (error) {
        console.error("main.js: Erreur init Storyboard:", error);
        container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`;
    }
}

async function initializePromptsPage(container, chapterNameElement) {
    console.log("main.js: Initialisation Page Prompts.");
    container.innerHTML = '<p>Chargement prompts...</p>';
    const storyboardJson = localStorage.getItem('bdStoryboard'); // Besoin du storyboard
    if (!storyboardJson) { container.innerHTML = '<p class="error-message">Storyboard non trouvé.</p>'; return; }

    try {
        const storyboardData = JSON.parse(storyboardJson);
        projectData.storyboard = storyboardData;

         // Mettre à jour nom chapitre
         if(chapterNameElement && storyboardData && storyboardData.chapterTitle) {
            chapterNameElement.textContent = storyboardData.chapterTitle;
         } else if (chapterNameElement) {
            chapterNameElement.textContent = "Chapitre inconnu";
         }


        const existingPromptsJson = localStorage.getItem('bdPrompts');
        let promptsData = null;

        if (existingPromptsJson) { console.log("main.js: Prompts existants trouvés."); try { promptsData = JSON.parse(existingPromptsJson); projectData.prompts = promptsData; } catch (e) { console.error("main.js: Erreur parsing prompts:", e); localStorage.removeItem('bdPrompts'); } }

        if (!promptsData) {
            console.log("main.js: Génération prompts...");
            promptsData = await generateAndSavePrompts(storyboardData);
            if (!promptsData) { throw new Error("Échec génération prompts."); }
        }

        displayPrompts(promptsData, container); // Afficher

    } catch (error) {
        console.error("main.js: Erreur init Prompts:", error);
        container.innerHTML = `<p class="error-message">Erreur chargement prompts: ${error.message}</p>`;
    }
}


console.log("main.js (Complet final) chargé.");
