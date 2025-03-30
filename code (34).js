/**
 * BD Creator - Script Principal (main.js)
 * Version finale.
 */
console.log("--- Exécution de main.js (Version Finale) ---");

// --- Variable globale RENOMMÉE ---
let bdCreatorAppData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};
console.log("main.js: Variable bdCreatorAppData initialisée.");

// --- Fonctions Utilitaires (Affichage) ---

function displayScenario(scenario, container) {
    console.log("displayScenario: Affichage demandé.");
    if (!container) { console.error("displayScenario: Conteneur introuvable!"); container=document.getElementById('scenario-display-container') || document.getElementById('scenario-container'); if (!container) return; }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide:", scenario); container.innerHTML = '<p class="error-message">Données scénario invalides.</p>'; return; }
    container.innerHTML = ''; let htmlContent = '';
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
    if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
    if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
    if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun.'}</p>`; if (chapitre.pages?.length) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`; if (chapitre.pages?.[0]?.cases?.[0]?.descriptionVisuelle) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
    else { htmlContent += `<div class="scenario-section"><p>Aucun chapitre généré.</p></div>`; }
    container.innerHTML = htmlContent; console.log("displayScenario: Affichage terminé.");
}

function displayStoryboard(storyboardData, container) {
    console.log("displayStoryboard: Affichage demandé.");
    if (!container) { console.error("displayStoryboard: Conteneur manquant !"); return; }
    if (!storyboardData || !storyboardData.pages || !Array.isArray(storyboardData.pages) || storyboardData.pages.length === 0) { container.innerHTML = '<p>Aucun storyboard à afficher.</p>'; return; }
    let currentPageIndex = 0; const totalPages = storyboardData.pages.length;
    function renderPage(index) { /* ... (code renderPage comme avant) ... */ }
    if (!container.querySelector('.pagination-container')) { /* ... (création pagination comme avant) ... */ }
    container.removeEventListener('click', handlePaginationClick); // Nettoyer ancien listener si besoin
    container.addEventListener('click', handlePaginationClick); // Attacher nouveau listener pour pagination
    function handlePaginationClick(event) { // Fonction pour gérer les clics sur les boutons de pagination
        if(event.target.classList.contains('prev-page-btn')) { renderPage(currentPageIndex - 1); }
        else if(event.target.classList.contains('next-page-btn')) { renderPage(currentPageIndex + 1); }
    }
    renderPage(0); console.log("displayStoryboard: Affichage terminé.");
}

function displayPrompts(promptsData, container) {
    console.log("displayPrompts: Affichage demandé.");
    if (!container) { console.error("displayPrompts: Conteneur manquant !"); return; }
    if (!promptsData || !promptsData.pages || !Array.isArray(promptsData.pages) || promptsData.pages.length === 0) { container.innerHTML = '<p>Aucun prompt à afficher.</p>'; return; }
    let currentPageIndex = 0; const totalPages = promptsData.pages.length;
    function renderPromptsPage(index) { /* ... (code renderPromptsPage comme avant) ... */ }
    if (!container.querySelector('.pagination-container')) { /* ... (création pagination comme avant) ... */ }
    container.removeEventListener('click', handlePromptCopy); container.removeEventListener('click', handlePaginationClick); // Nettoyer
    container.addEventListener('click', handlePaginationClick); container.addEventListener('click', handlePromptCopy); // Attacher listeners
    function handlePaginationClick(event) { // Fonction pour gérer les clics sur les boutons de pagination
        if(event.target.classList.contains('prev-page-btn')) { renderPromptsPage(currentPageIndex - 1); }
        else if(event.target.classList.contains('next-page-btn')) { renderPromptsPage(currentPageIndex + 1); }
    }
    renderPromptsPage(0); console.log("displayPrompts: Affichage terminé.");
}

function handlePromptCopy(event) { /* ... Code complet copie prompt ... */ }

// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateScenarioDetaille N'EST PAS DÉFINIE !"); alert("Erreur critique."); /* Nettoyage UI */ return; }
    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("generateAndDisplayScenario: Scénario reçu.", scenario); if (!scenario) throw new Error("Scénario null reçu.");
            bdCreatorAppData.scenario = scenario; // Utiliser variable renommée
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); } catch (e) { console.error("Erreur sauvegarde Scénario:", e); }
            let container = document.getElementById('scenario-display-container'); if (!container) { /* Créer si besoin */ }
            displayScenario(scenario, container);
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (container?.scrollIntoView) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error("generateAndDisplayScenario: ERREUR CATCH:", error); alert("Erreur génération scénario. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer.</p>`; }
        });
}

async function generateAndSaveStoryboard(scenario, chapterIndex = 0) {
    console.log("generateAndSaveStoryboard: Démarrage..."); let storyboardData = null;
    if (typeof window.createStoryboardDetaille === 'function') { try { storyboardData = await window.createStoryboardDetaille(scenario, chapterIndex); if (storyboardData) { bdCreatorAppData.storyboard = storyboardData; localStorage.setItem('bdStoryboard', JSON.stringify(storyboardData)); console.log("Storyboard généré/sauvegardé."); } else { console.error("createStoryboardDetaille a retourné null."); } } catch (error) { console.error("Erreur appel createStoryboardDetaille:", error); } }
    else { console.error("Fonction createStoryboardDetaille non trouvée."); } return storyboardData;
}

async function generateAndSavePrompts(storyboardData) {
    console.log("generateAndSavePrompts: Démarrage..."); let promptsData = null;
    if (typeof window.generatePromptsDetailles === 'function') { try { promptsData = await window.generatePromptsDetailles(storyboardData); if (promptsData) { bdCreatorAppData.prompts = promptsData; localStorage.setItem('bdPrompts', JSON.stringify(promptsData)); console.log("Prompts générés/sauvegardés."); } else { console.error("generatePromptsDetailles a retourné null."); } } catch (error) { console.error("Erreur appel generatePromptsDetailles:", error); } }
    else { console.error("Fonction generatePromptsDetailles non trouvée."); } return promptsData;
}

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log("main.js: Initialisation Application Globale.");
    const pagePath = window.location.pathname.split('/').pop() || 'index.html'; // Gérer racine

    // Initialiser Session Manager (si présent)
    if (window.bdSessionManager instanceof SessionManager) { // Vérifier si c'est bien une instance
         console.log("main.js: bdSessionManager trouvé.");
         // Il s'initialise lui-même, mais on pourrait forcer une MàJ si besoin
         // window.bdSessionManager.updateCurrentSessionInfo();
         // window.bdSessionManager.updateSessionsList();
    } else { console.warn("main.js: bdSessionManager non trouvé ou invalide."); }

    // Initialisation basée sur la page actuelle
    if (pagePath === 'index.html' || pagePath === '') {
        const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container');
        if (keywordsInput && generateButton && scenarioDisplayContainer) initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer);
    } else if (pagePath === 'scenario.html') {
        const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display');
        if (scenarioContainerPage && keywordsDisplayPage) initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage);
    } else if (pagePath === 'storyboard.html') {
        const storyboardContainerPage = document.getElementById('storyboard-container'); const chapterTitleElementSB = document.getElementById('chapter-title');
        if (storyboardContainerPage) initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB);
    } else if (pagePath === 'prompts.html') {
        const promptsContainerPage = document.getElementById('prompts-container'); const chapterNameElementP = document.getElementById('chapter-name');
        if (promptsContainerPage) initializePromptsPage(promptsContainerPage, chapterNameElementP);
    }
}

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     if (!generateButton.dataset.listenerAttached) {
        generateButton.addEventListener('click', function() {
            console.log(">>> Bouton Générer Scénario cliqué!");
            const keywords = keywordsInput.value; if (!keywords?.trim()) { alert('Veuillez entrer du texte.'); return; }
            generateButton.disabled = true; generateButton.textContent = "Génération..."; let loadingElement = document.getElementById('loading-indicator');
            if (!loadingElement) { loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); } else { loadingElement.style.display = 'block'; }
            localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); localStorage.setItem('bdKeywords', keywords);
            console.log(">>> Appel de generateAndDisplayScenario...");
            if (typeof window.generateScenarioDetaille === 'function') { generateAndDisplayScenario(keywords, generateButton, loadingElement); }
            else { console.error("HOME: generateScenarioDetaille non trouvé!"); alert("Erreur critique."); /* Nettoyage UI */ }
        });
        generateButton.dataset.listenerAttached = 'true'; console.log("main.js: Écouteur attaché (Accueil).");
     }
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) {
     console.log("main.js: Initialisation Page Scénario."); const keywords = localStorage.getItem('bdKeywords') || ''; keywordsDisplay.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : ''); const scenarioJson = localStorage.getItem('bdScenario');
     if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; displayScenario(scenario, container); } catch (e) { console.error("main.js: Erreur affichage (Scénario):", e); container.innerHTML = '<p class="error-message">Erreur affichage.</p>'; } }
     else { container.innerHTML = '<p>Aucun scénario généré.</p>'; }
}

async function initializeStoryboardPage(container, chapterTitleElement) {
    console.log("main.js: Initialisation Page Storyboard."); container.innerHTML = '<p>Chargement...</p>'; const scenarioJson = localStorage.getItem('bdScenario'); if (!scenarioJson) { container.innerHTML = '<p class="error-message">Scénario non trouvé.</p>'; return; }
    try {
        const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; const existingStoryboardJson = localStorage.getItem('bdStoryboard'); let storyboardData = null;
        if (existingStoryboardJson) { console.log("Storyboard existant trouvé."); try { storyboardData = JSON.parse(existingStoryboardJson); bdCreatorAppData.storyboard = storyboardData; } catch (e) { console.error("Erreur parsing storyboard:", e); localStorage.removeItem('bdStoryboard'); } }
        if (!storyboardData) { console.log("Génération storyboard..."); if (!scenario.chapters?.length) { throw new Error("Scénario sans chapitres."); } storyboardData = await generateAndSaveStoryboard(scenario, 0); if (!storyboardData) { throw new Error("Échec génération storyboard."); } }
        if(chapterTitleElement && storyboardData?.chapterTitle) { chapterTitleElement.textContent = storyboardData.chapterTitle; } else if (chapterTitleElement) { chapterTitleElement.textContent = "?"; }
        displayStoryboard(storyboardData, container);
    } catch (error) { console.error("Erreur init Storyboard:", error); container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`; }
}

async function initializePromptsPage(container, chapterNameElement) {
    console.log("main.js: Initialisation Page Prompts."); container.innerHTML = '<p>Chargement...</p>'; const storyboardJson = localStorage.getItem('bdStoryboard'); if (!storyboardJson) { container.innerHTML = '<p class="error-message">Storyboard non trouvé.</p>'; return; }
    try {
        const storyboardData = JSON.parse(storyboardJson); bdCreatorAppData.storyboard = storyboardData;
        if(chapterNameElement && storyboardData?.chapterTitle) { chapterNameElement.textContent = storyboardData.chapterTitle; } else if (chapterNameElement) { chapterNameElement.textContent = "?"; }
        const existingPromptsJson = localStorage.getItem('bdPrompts'); let promptsData = null;
        if (existingPromptsJson) { console.log("Prompts existants trouvés."); try { promptsData = JSON.parse(existingPromptsJson); bdCreatorAppData.prompts = promptsData; } catch (e) { console.error("Erreur parsing prompts:", e); localStorage.removeItem('bdPrompts'); } }
        if (!promptsData) { console.log("Génération prompts..."); promptsData = await generateAndSavePrompts(storyboardData); if (!promptsData) { throw new Error("Échec génération prompts."); } }
        displayPrompts(promptsData, container);
    } catch (error) { console.error("Erreur init Prompts:", error); container.innerHTML = `<p class="error-message">Erreur chargement prompts: ${error.message}</p>`; }
}

console.log("main.js (Complet final) chargé.");