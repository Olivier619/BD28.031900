/**
 * BD Creator - Script Principal (main.js)
 * Version finale avec logs détaillés après clic pour débogage affichage scénario.
 */
console.log("--- Exécution de main.js (Version Finale Renommée + Logs Clic Détail) ---");

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
    // *** LOG CLÉ 5 ***
    console.log(">>> displayScenario: Début affichage.", { scenario, container });
    if (!container) { console.error("displayScenario: Conteneur introuvable!"); container=document.getElementById('scenario-display-container') || document.getElementById('scenario-container'); if (!container) return; }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide:", scenario); container.innerHTML = '<p class="error-message">Données scénario invalides.</p>'; return; }
    container.innerHTML = ''; let htmlContent = '';
    try {
        htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
        if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
        if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
        if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
        if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun.'}</p>`; if (chapitre.pages?.length) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`; if (chapitre.pages?.[0]?.cases?.[0]?.descriptionVisuelle) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
        else { htmlContent += `<div class="scenario-section"><p>Aucun chapitre généré.</p></div>`; }

         // *** LOG CLÉ 6 ***
        console.log(">>> displayScenario: HTML généré (aperçu):", htmlContent.substring(0, 300) + "...");
        container.innerHTML = htmlContent;
         // *** LOG CLÉ 7 ***
        console.log(">>> displayScenario: innerHTML appliqué avec succès.");

    } catch (error) {
         // *** LOG CLÉ 8 (ERREUR AFFICHAGE) ***
        console.error(">>> displayScenario: ERREUR pendant la génération/application du HTML:", error);
        container.innerHTML = `<p class="error-message">Erreur interne lors de l'affichage du scénario.</p>`;
    }
    console.log("displayScenario: Fin.");
}

// --- Autres fonctions utilitaires (displayStoryboardComplet, displayPrompts, handlePromptCopy) ---
// Assurez-vous qu'elles sont bien présentes ici (versions fonctionnelles précédentes)
function displayStoryboardComplet(storyboardComplet, container) { /* ... Votre code fonctionnel ... */ }
function displayPrompts(promptsData, container) { /* ... Votre code fonctionnel ... */ }
function handlePromptCopy(event) { /* ... Votre code fonctionnel ... */ }

// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    // *** LOG CLÉ 3 ***
    console.log(">>> generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateAndDisplayScenario: generateScenarioDetaille N'EST PAS DÉFINIE !"); alert("Erreur critique."); /* Nettoyage UI */ return; }

    // *** LOG AJOUTÉ ***
    console.log(">>> generateAndDisplayScenario: Sur le point d'appeler window.generateScenarioDetaille...");

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            // *** LOG CLÉ 4 ***
            console.log(">>> generateAndDisplayScenario (.then): Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario null reçu."); }

            bdCreatorAppData.scenario = scenario;
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); }
            catch (e) { console.error("Erreur sauvegarde Scénario:", e); }

            // ---------- SECTION AVEC LOGS DÉTAILLÉS ----------
            console.log(">>> .then: Recherche du conteneur #scenario-display-container..."); // LOG AJOUTÉ
            let container = document.getElementById('scenario-display-container');
            console.log(">>> .then: Résultat recherche container:", container); // LOG AJOUTÉ

            if (!container) {
                console.warn(">>> .then: Conteneur non trouvé ! Tentative de création..."); // LOG AJOUTÉ
                container = document.createElement('div');
                container.id = 'scenario-display-container';
                container.className = 'scenario-container';
                const featureDiv = generateButton.closest('.feature');
                console.log(">>> .then: Parent .feature trouvé:", featureDiv); // LOG AJOUTÉ
                if (featureDiv && featureDiv.parentNode) {
                     console.log(">>> .then: Insertion du nouveau conteneur dans le DOM..."); // LOG AJOUTÉ
                     featureDiv.parentNode.insertBefore(container, featureDiv.nextSibling);
                     container = document.getElementById('scenario-display-container'); // Re-vérifier
                     console.log(">>> .then: Résultat recherche container APRÈS insertion:", container); // LOG AJOUTÉ
                 } else {
                      console.error(">>> .then: ERREUR - Impossible de trouver le parent '.feature' pour insérer le conteneur !");
                 }
            }
             console.log(">>> .then: Conteneur final avant appel displayScenario:", container); // LOG AJOUTÉ

            if (!container) {
                 console.error(">>> .then: ERREUR FATALE - Conteneur est null, impossible d'appeler displayScenario.");
                 generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
                 return;
            }
            // ----------------------------------------------------

            console.log(">>> .then: Appel de displayScenario..."); // LOG AJOUTÉ
            displayScenario(scenario, container); // Appel affichage

            // Nettoyage UI succès
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (container?.scrollIntoView) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            // *** LOG CLÉ 9 (ERREUR GENERATION/PROMESSE) ***
            console.error(">>> generateAndDisplayScenario: ERREUR CATCH:", error);
            alert("Erreur génération/affichage Scénario. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer le scénario.</p>`; }
        });
}

async function generateAndSaveStoryboardComplet(scenario) { /* ... Votre code ... */ }
async function generateAndSavePrompts(storyboardData) { /* ... Votre code ... */ }


// --- Initialisation ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log("main.js: Initialisation Application Globale.");
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    let pageName = pagePath.endsWith('.html') ? pagePath.substring(0, pagePath.length - 5) : pagePath;
    if (pageName === '') pageName = 'index';
    console.log(`main.js: Nom de page détecté: '${pageName}'`);

    if (window.bdSessionManager instanceof SessionManager) { console.log("main.js: bdSessionManager trouvé."); } else { console.warn("main.js: bdSessionManager non trouvé."); }

    if (pageName === 'index') {
        const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container');
        if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
        else { console.error("main.js: ERREUR - Éléments clés non trouvés sur index!"); }
    } else if (pageName === 'scenario') {
        const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display');
        if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
         else { console.warn("main.js: Éléments scenario.html non trouvés."); }
    } else if (pageName === 'storyboard') {
        const storyboardContainerPage = document.getElementById('storyboard-container'); const chapterTitleElementSB = document.getElementById('chapter-title');
        if (storyboardContainerPage) { initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB); }
         else { console.warn("main.js: Éléments storyboard.html non trouvés."); }
    } else if (pageName === 'prompts') {
        const promptsContainerPage = document.getElementById('prompts-container'); const chapterNameElementP = document.getElementById('chapter-name');
        if (promptsContainerPage) { initializePromptsPage(promptsContainerPage, chapterNameElementP); }
         else { console.warn("main.js: Éléments prompts.html non trouvés."); }
    }
    console.log("main.js: Fin initializeApp.");
}

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     if (!generateButton) { console.error("initializeHomePage: BOUTON GÉNÉRER INTROUVABLE !"); return; }
     if (!keywordsInput) { console.error("initializeHomePage: INPUT KEYWORDS INTROUVABLE !"); return; }

     if (!generateButton.dataset.listenerAttached) {
        console.log("main.js: Attachement de l'écouteur au bouton Générer...");
        generateButton.addEventListener('click', function handleGenerateClick() {
            // *** LOG 1 ***
            console.log(">>> Bouton Générer Scénario cliqué!");
            try {
                // *** LOG 2 ***
                const keywords = keywordsInput.value;
                console.log(">>> Listener: Keywords récupérés:", keywords);
                if (!keywords || keywords.trim() === '') { alert('Veuillez entrer du texte.'); console.log(">>> Listener: Pas de keywords, sortie."); return; }

                // *** LOG 3 ***
                console.log(">>> Listener: Désactivation UI...");
                generateButton.disabled = true; generateButton.textContent = "Génération...";
                let loadingElement = document.getElementById('loading-indicator');
                if (!loadingElement) { console.log(">>> Listener: Création loading-indicator."); loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); }
                loadingElement.style.display = 'block'; console.log(">>> Listener: Indicateur chargement prêt.");

                // *** LOG 4 ***
                console.log(">>> Listener: Nettoyage localStorage...");
                localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); localStorage.setItem('bdKeywords', keywords);
                console.log(">>> Listener: Nouveaux keywords sauvegardés.");

                // *** LOG 5 ***
                console.log(">>> Listener: Vérification window.generateScenarioDetaille...");
                if (typeof window.generateScenarioDetaille === 'function') {
                    console.log(">>> Listener: Appel generateAndDisplayScenario...");
                    generateAndDisplayScenario(keywords, generateButton, loadingElement);
                } else {
                     console.error(">>> Listener: ERREUR CRITIQUE - generateScenarioDetaille non trouvée!"); alert("Erreur critique.");
                     generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
                }
            } catch (errorInListener) {
                 // *** LOG 6 ***
                 console.error(">>> Listener: ERREUR INATTENDUE:", errorInListener); alert("Erreur inattendue. Voir console.");
                 generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; let loadingElem = document.getElementById('loading-indicator'); if (loadingElem?.parentNode) loadingElem.parentNode.removeChild(loadingElem);
            }
        });
        generateButton.dataset.listenerAttached = 'true';
        console.log("main.js: Écouteur attaché (Accueil).");
     } else { console.log("main.js: Écouteur déjà attaché (Accueil)."); }

     // Afficher scénario existant
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) { /* ... Votre code ... */ }
async function initializeStoryboardPage(container, chapterTitleElement) { /* ... Votre code ... */ }
async function initializePromptsPage(container, chapterNameElement) { /* ... Votre code ... */ }

console.log("main.js (Complet final - Renommé + Logs Clic Détail) chargé.");
