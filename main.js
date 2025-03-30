/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation et les interactions pour toutes les pages.
 * Utilise bdCreatorAppData pour éviter les conflits.
 */
console.log("--- Exécution de main.js (Version Finale Renommée) --- Timestamp:", Date.now()); // Gardons ce log unique

// --- Variable globale RENOMMÉE ---
let bdCreatorAppData = { // <--- RENOMMÉ ICI
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};
console.log("main.js: Variable bdCreatorAppData initialisée."); // Log pour confirmer

// --- Fonctions Utilitaires ---

function displayScenario(scenario, container) {
    console.log(">>> displayScenario: Appelé avec", scenario);
    if (!container) { console.error("displayScenario: Conteneur introuvable!"); container=document.getElementById('scenario-display-container'); if (!container){ console.error("displayScenario: Conteneur #scenario-display-container introuvable!"); return;} }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide:", scenario); container.innerHTML = '<p class="error-message">Données scénario invalides.</p>'; return; }
    container.innerHTML = ''; let htmlContent = '';
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
    if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
    if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
    if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">`; htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun résumé.'}</p>`; if (chapitre.pages && chapitre.pages.length > 0) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages prévues.</p>`; if (chapitre.pages && chapitre.pages[0] && chapitre.pages[0].cases && chapitre.pages[0].cases[0]) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
    else { htmlContent += `<p>Aucun chapitre généré.</p>`; }
    container.innerHTML = htmlContent; console.log(">>> displayScenario: Affichage terminé.");
}
function displayStoryboard(storyboardData, container) { /* ... Votre fonction displayStoryboard ... */ }
function displayPrompts(promptsData, container) { /* ... Votre fonction displayPrompts ... */ }
function handlePromptCopy(event) { /* ... Votre fonction handlePromptCopy ... */ }

// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log(">>> generateAndDisplayScenario: Appelé avec", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateAndDisplayScenario: generateScenarioDetaille non trouvée!"); alert("Erreur: Fonction génération scénario indisponible."); /* Nettoyage UI */ return; }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log(">>> generateAndDisplayScenario (.then): Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario reçu est null."); }

            bdCreatorAppData.scenario = scenario; // <--- RENOMMÉ ICI
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); }
            catch (e) { console.error("Erreur sauvegarde Scénario:", e); alert("Sauvegarde Scénario échouée."); }

            let scenarioContainer = document.getElementById('scenario-display-container');
            if (!scenarioContainer) { /* Création dynamique si besoin */
                 console.warn("Conteneur #scenario-display-container non trouvé, création...");
                 scenarioContainer = document.createElement('div'); scenarioContainer.id = 'scenario-display-container'; scenarioContainer.className = 'scenario-container';
                 generateButton.closest('.feature')?.parentNode?.insertBefore(scenarioContainer, generateButton.closest('.feature').nextSibling);
             }
            console.log(">>> Appel displayScenario depuis .then");
            displayScenario(scenario, scenarioContainer); // Appel affichage

            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (scenarioContainer?.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error(">>> ERREUR dans .catch() generateAndDisplayScenario:", error); alert("Erreur génération/affichage Scénario. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let scenarioContainer = document.getElementById('scenario-display-container'); if(scenarioContainer) { scenarioContainer.innerHTML = `<p class="error-message">Impossible de générer le scénario.</p>`; }
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
    // Initialisation Page Accueil
    const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container'); if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
    // Initialisation Page Scénario
    const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display'); if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
    // Initialisation Page Storyboard
    const storyboardContainerPage = document.getElementById('storyboard-container'); const chapterTitleElementSB = document.getElementById('chapter-title'); if (storyboardContainerPage) { initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB); }
    // Initialisation Page Prompts
    const promptsContainerPage = document.getElementById('prompts-container'); const chapterNameElementP = document.getElementById('chapter-name'); if (promptsContainerPage) { initializePromptsPage(promptsContainerPage, chapterNameElementP); }
    // Session Manager
    if (window.bdSessionManager) { console.log("main.js: bdSessionManager trouvé."); } else { console.warn("main.js: bdSessionManager non trouvé."); }
}

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     if (!generateButton.dataset.listenerAttached) {
        generateButton.addEventListener('click', function() {
            console.log(">>> Bouton cliqué!"); const keywords = keywordsInput.value; if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); return; }
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
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; /*<-- RENOMMÉ*/ displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) {
     console.log("main.js: Initialisation Page Scénario."); const keywords = localStorage.getItem('bdKeywords') || ''; keywordsDisplay.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : ''); const scenarioJson = localStorage.getItem('bdScenario');
     if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; /*<-- RENOMMÉ*/ displayScenario(scenario, container); } catch (e) { console.error("main.js: Erreur affichage (Scénario):", e); container.innerHTML = '<p class="error-message">Erreur affichage.</p>'; } }
     else { container.innerHTML = '<p>Aucun scénario généré.</p>'; }
}

async function initializeStoryboardPage(container, chapterTitleElement) {
    console.log("main.js: Initialisation Page Storyboard."); container.innerHTML = '<p>Chargement...</p>'; const scenarioJson = localStorage.getItem('bdScenario'); if (!scenarioJson) { container.innerHTML = '<p class="error-message">Scénario non trouvé.</p>'; return; }
    try {
        const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; /*<-- RENOMMÉ*/ const existingStoryboardJson = localStorage.getItem('bdStoryboard'); let storyboardData = null;
        if (existingStoryboardJson) { console.log("Storyboard existant trouvé."); try { storyboardData = JSON.parse(existingStoryboardJson); bdCreatorAppData.storyboard = storyboardData; /*<-- RENOMMÉ*/ } catch (e) { console.error("Erreur parsing storyboard:", e); localStorage.removeItem('bdStoryboard'); } }
        if (!storyboardData) { console.log("Génération storyboard..."); if (!scenario.chapters || scenario.chapters.length === 0) { throw new Error("Scénario sans chapitres."); } storyboardData = await generateAndSaveStoryboard(scenario, 0); if (!storyboardData) { throw new Error("Échec génération storyboard."); } }
        if(chapterTitleElement && storyboardData?.chapterTitle) { chapterTitleElement.textContent = storyboardData.chapterTitle; } else if (chapterTitleElement) { chapterTitleElement.textContent = "?"; }
        displayStoryboard(storyboardData, container);
    } catch (error) { console.error("Erreur init Storyboard:", error); container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`; }
}

async function initializePromptsPage(container, chapterNameElement) {
    console.log("main.js: Initialisation Page Prompts."); container.innerHTML = '<p>Chargement...</p>'; const storyboardJson = localStorage.getItem('bdStoryboard'); if (!storyboardJson) { container.innerHTML = '<p class="error-message">Storyboard non trouvé.</p>'; return; }
    try {
        const storyboardData = JSON.parse(storyboardJson); bdCreatorAppData.storyboard = storyboardData; /*<-- RENOMMÉ*/
        if(chapterNameElement && storyboardData?.chapterTitle) { chapterNameElement.textContent = storyboardData.chapterTitle; } else if (chapterNameElement) { chapterNameElement.textContent = "?"; }
        const existingPromptsJson = localStorage.getItem('bdPrompts'); let promptsData = null;
        if (existingPromptsJson) { console.log("Prompts existants trouvés."); try { promptsData = JSON.parse(existingPromptsJson); bdCreatorAppData.prompts = promptsData; /*<-- RENOMMÉ*/ } catch (e) { console.error("Erreur parsing prompts:", e); localStorage.removeItem('bdPrompts'); } }
        if (!promptsData) { console.log("Génération prompts..."); promptsData = await generateAndSavePrompts(storyboardData); if (!promptsData) { throw new Error("Échec génération prompts."); } }
        displayPrompts(promptsData, container);
    } catch (error) { console.error("Erreur init Prompts:", error); container.innerHTML = `<p class="error-message">Erreur chargement prompts: ${error.message}</p>`; }
}

console.log("main.js (Complet final - Renommé) chargé.");
