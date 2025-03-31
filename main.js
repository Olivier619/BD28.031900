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
    console.log(">>> displayStoryboard: DÉBUT - Données reçues:", storyboardData, "Conteneur:", container); // Log 1

    if (!container) { console.error("displayStoryboard: ERREUR - Conteneur manquant !"); return; }
    if (!storyboardData || !storyboardData.pages || !Array.isArray(storyboardData.pages)) { // Vérification plus stricte
        console.error("displayStoryboard: ERREUR - Données storyboard invalides ou sans pages:", storyboardData);
        container.innerHTML = '<p class="error-message">Données de storyboard invalides.</p>';
        return;
    }
    if (storyboardData.pages.length === 0) {
         console.warn("displayStoryboard: Le storyboard n'a aucune page à afficher.");
         container.innerHTML = '<p>Le storyboard est vide (aucune page).</p>'; // Message clair
        return;
    }


    let currentPageIndex = 0;
    const totalPages = storyboardData.pages.length;
    console.log(`>>> displayStoryboard: Prêt à afficher ${totalPages} pages.`); // Log 2

    function renderPage(index) {
        console.log(`>>> displayStoryboard -> renderPage: Rendu demandé pour page index ${index}`); // Log 3
        if (index < 0 || index >= totalPages) {
             console.warn(`>>> displayStoryboard -> renderPage: Index ${index} hors limites.`);
             return;
        }
        currentPageIndex = index;
        const page = storyboardData.pages[index];

        if (!page) { // Vérification supplémentaire
             console.error(`>>> displayStoryboard -> renderPage: Données pour page index ${index} non trouvées !`);
             return;
        }

        let pageHtml = `<h4>Page ${page.pageNumber || (index + 1)} / ${totalPages}</h4>`;
        if (page.description) pageHtml += `<p><i>${page.description}</i></p>`;

        if (page.cases && Array.isArray(page.cases) && page.cases.length > 0) { // Vérifier que 'cases' est un tableau
            pageHtml += `<div class="panels-container">`;
            page.cases.forEach((panel, panelIndex) => {
                 if (!panel) { // Vérifier que 'panel' existe
                      console.warn(`>>> displayStoryboard -> renderPage: Panel invalide à l'index ${panelIndex}, page ${index+1}`);
                      return; // Passer au suivant
                 }
                pageHtml += `<div class="panel"><h5>Case ${panelIndex + 1}</h5>`;
                if (panel.description) pageHtml += `<p class="panel-description"><strong>Visuel:</strong> ${panel.description}</p>`;
                if (panel.dialogue) pageHtml += `<div class="dialogue"><strong>Dialogue:</strong> ${panel.dialogue}</div>`;
                if (panel.personnages?.length) pageHtml += `<div class="personnages-case"><small><i>Présents: ${panel.personnages.join(', ')}</i></small></div>`;
                pageHtml += `</div>`;
            });
            pageHtml += `</div>`;
        } else {
            pageHtml += `<p>Aucune case définie pour cette page.</p>`;
        }

        // Mettre à jour le contenu
        const pageContentDiv = container.querySelector('.storyboard-page-content');
        if (pageContentDiv) {
             console.log(`>>> displayStoryboard -> renderPage: Mise à jour HTML pour page ${index+1}`); // Log 4
             pageContentDiv.innerHTML = pageHtml; // *** C'EST ICI QUE L'AFFICHAGE SE FAIT ***
             // Mettre à jour pagination
             const indicator = container.querySelector('.page-indicator');
             const prevBtn = container.querySelector('.prev-page-btn');
             const nextBtn = container.querySelector('.next-page-btn');
             if(indicator) indicator.textContent = `Page ${index + 1} / ${totalPages}`;
             if(prevBtn) prevBtn.disabled = (index === 0);
             if(nextBtn) nextBtn.disabled = (index === totalPages - 1);
        } else {
             console.error(">>> displayStoryboard -> renderPage: Div '.storyboard-page-content' INTROUVABLE !");
             container.innerHTML = pageHtml; // Fallback dangereux si la structure a disparu
        }
        console.log(`>>> displayStoryboard -> renderPage: Rendu page ${index+1} terminé.`); // Log 5
    }

    // Créer/Vérifier la structure de pagination
    let paginationContainer = container.querySelector('.pagination-container');
    if (!paginationContainer) {
        console.log(">>> displayStoryboard: Création de la structure HTML (pagination + contenu)..."); // Log 6
        container.innerHTML = `
            <div class="pagination-container" style="margin-bottom: 15px; text-align: center;">
                <button class="prev-page-btn pagination-button" disabled>Précédent</button>
                <span class="page-indicator" style="margin: 0 15px;">Page 1 / ${totalPages}</span>
                <button class="next-page-btn pagination-button">Suivant</button>
            </div>
            <div class="storyboard-page-content">
                <!-- Contenu initial -->
                <p>Préparation de l'affichage...</p>
            </div>
        `;
         // Attacher les écouteurs APRÈS avoir créé les boutons
         paginationContainer = container.querySelector('.pagination-container'); // Récupérer la référence
         paginationContainer.querySelector('.prev-page-btn').addEventListener('click', () => renderPage(currentPageIndex - 1));
         paginationContainer.querySelector('.next-page-btn').addEventListener('click', () => renderPage(currentPageIndex + 1));
         console.log(">>> displayStoryboard: Structure HTML créée et écouteurs pagination attachés."); // Log 7
    } else {
         console.log(">>> displayStoryboard: Structure pagination existante trouvée."); // Log 8
    }


    // Afficher la première page
    console.log(">>> displayStoryboard: Appel initial de renderPage(0)..."); // Log 9
    renderPage(0);
    console.log(">>> displayStoryboard: FIN"); // Log 10
}

function displayPrompts(promptsData, container) {
    console.log(">>> displayPrompts: DÉBUT - Données:", promptsData, "Conteneur:", container); // Log P1

    if (!container) { console.error("displayPrompts: ERREUR - Conteneur manquant !"); return; }
    if (!promptsData || !promptsData.pages || !Array.isArray(promptsData.pages) || promptsData.pages.length === 0) {
        console.error("displayPrompts: ERREUR - Données prompts invalides ou vides:", promptsData);
        container.innerHTML = '<p class="error-message">Données de prompts invalides ou vides.</p>';
        return;
    }

    let currentPageIndex = 0;
    const totalPages = promptsData.pages.length;
    console.log(`>>> displayPrompts: Prêt à afficher ${totalPages} pages de prompts.`); // Log P2

    function renderPromptsPage(index) {
        console.log(`>>> displayPrompts -> renderPromptsPage: Rendu page index ${index}`); // Log P3
        if (index < 0 || index >= totalPages) { console.warn(`renderPromptsPage: Index ${index} hors limites.`); return; }
        currentPageIndex = index;
        const page = promptsData.pages[index];

        if (!page || !page.panels || !Array.isArray(page.panels)) {
            console.error(`renderPromptsPage: Page ${index+1} invalide ou sans panels.`);
            const contentDivError = container.querySelector('.prompts-page-content');
            if(contentDivError) contentDivError.innerHTML = `<h4>Page ${page?.pageNumber || (index + 1)}</h4><p class="error-message">Données invalides.</p>`;
            return;
        }

        let pageHtml = `<h4>Page ${page.pageNumber || (index + 1)} / ${totalPages}</h4>`;
        if (page.panels.length > 0) {
            pageHtml += `<div class="panels-container">`;
            page.panels.forEach((panel, panelIndex) => {
                 if (!panel) { console.warn(`renderPromptsPage: Panel invalide idx ${panelIndex}, page ${index+1}`); return; }
                pageHtml += `<div class="panel prompt-panel"><h5>Case ${panelIndex + 1}</h5>`;
                if (panel.prompt) {
                    pageHtml += `<div class="prompt"><textarea class="prompt-textarea" readonly>${panel.prompt}</textarea><button class="copy-button" data-prompt-index="${index}-${panelIndex}">Copier</button></div>`;
                } else { pageHtml += `<p><i>Aucun prompt.</i></p>`; }
                pageHtml += `</div>`;
            });
            pageHtml += `</div>`;
        } else { pageHtml += `<p>Aucun prompt défini pour cette page.</p>`; }

        // *** VÉRIFICATION CRUCIALE ***
        const pageContentDiv = container.querySelector('.prompts-page-content');
        console.log(">>> displayPrompts -> renderPromptsPage: pageContentDiv trouvé:", pageContentDiv); // Log P4
        console.log(">>> displayPrompts -> renderPromptsPage: HTML généré (aperçu):", pageHtml.substring(0, 200) + "..."); // Log P5

        if (pageContentDiv) {
             console.log(`>>> displayPrompts -> renderPromptsPage: Application de innerHTML sur pageContentDiv...`); // Log P6
             pageContentDiv.innerHTML = pageHtml; // <<< LIGNE CRITIQUE
             console.log(`>>> displayPrompts -> renderPromptsPage: innerHTML appliqué.`); // Log P7
             // MàJ Pagination
             const indicator = container.querySelector('.page-indicator'); const prevBtn = container.querySelector('.prev-page-btn'); const nextBtn = container.querySelector('.next-page-btn');
             if(indicator) indicator.textContent = `Page ${index + 1} / ${totalPages}`;
             if(prevBtn) prevBtn.disabled = (index === 0);
             if(nextBtn) nextBtn.disabled = (index === totalPages - 1);
        } else {
             console.error(">>> displayPrompts -> renderPromptsPage: ERREUR - Div '.prompts-page-content' INTROUVABLE !");
        }
        console.log(`>>> displayPrompts -> renderPromptsPage: Rendu page ${index+1} terminé.`); // Log P8
    }

     // Créer/Vérifier structure pagination
     let paginationContainer = container.querySelector('.pagination-container');
     if (!paginationContainer) {
        console.log(">>> displayPrompts: Création structure HTML pagination/contenu..."); // Log P9
        container.innerHTML = `
            <div class="pagination-container" style="margin-bottom: 15px; text-align: center;">
                <button class="prev-page-btn pagination-button" disabled>Précédent</button>
                <span class="page-indicator" style="margin: 0 15px;">Page 1 / ${totalPages}</span>
                <button class="next-page-btn pagination-button">Suivant</button>
            </div>
            <div class="prompts-page-content"><p>Préparation affichage...</p></div>
        `;
         paginationContainer = container.querySelector('.pagination-container'); // Ré-obtenir la référence
         // Attacher listeners pagination APRÈS création
         paginationContainer.querySelector('.prev-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex - 1));
         paginationContainer.querySelector('.next-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex + 1));
         console.log(">>> displayPrompts: Structure créée, listeners pagination OK."); // Log P10
    } else {
         console.log(">>> displayPrompts: Structure pagination existante trouvée."); // Log P11
    }

    // Gestion listener copie (délégation)
    container.removeEventListener('click', handlePromptCopy);
    container.addEventListener('click', handlePromptCopy);
     console.log(">>> displayPrompts: Listener pour copie attaché/réattaché."); // Log P12

    // Afficher la première page
    console.log(">>> displayPrompts: Appel initial renderPromptsPage(0)..."); // Log P13
    renderPromptsPage(0);
    console.log(">>> displayPrompts: FIN"); // Log P14 (Celui que vous voyez déjà)
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
    const fullPath = window.location.pathname;
    let pageName = fullPath.split('/').pop() || 'index.html'; // Gérer racine

    // *** CORRECTION : Nettoyer le nom de la page (enlever .html si présent) ***
    if (pageName.endsWith('.html')) {
        pageName = pageName.substring(0, pageName.length - 5);
    }
    // Maintenant, pageName devrait être 'index', 'scenario', 'storyboard', 'prompts' etc.

    console.log(`main.js: Nom de page détecté (nettoyé): '${pageName}' (Complet: '${fullPath}')`);

    // Initialisation Session Manager
    if (window.bdSessionManager instanceof SessionManager) { console.log("main.js: bdSessionManager trouvé."); }
    else { console.warn("main.js: bdSessionManager non trouvé."); }

    // Initialisation basée sur le nom de page nettoyé
    if (pageName === 'index' || pageName === '') { // Comparer avec 'index'
        console.log("main.js: Initialisation pour index...");
        const keywordsInput = document.getElementById('keywords');
        const generateButton = document.getElementById('generate-scenario-btn');
        const scenarioDisplayContainer = document.getElementById('scenario-display-container');
        if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
        else { console.warn("main.js: Éléments index non trouvés."); }

    } else if (pageName === 'scenario') { // Comparer avec 'scenario'
         console.log("main.js: Initialisation pour scenario...");
        const scenarioContainerPage = document.getElementById('scenario-container');
        const keywordsDisplayPage = document.getElementById('keywords-display');
        if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
        else { console.warn("main.js: Éléments scenario non trouvés."); }

    } else if (pageName === 'storyboard') { // Comparer avec 'storyboard'
         console.log("main.js: Initialisation pour storyboard...");
        const storyboardContainerPage = document.getElementById('storyboard-container');
        const chapterTitleElementSB = document.getElementById('chapter-title');
         console.log("main.js: Résultat recherche #storyboard-container:", storyboardContainerPage); // Garder ce log
        if (storyboardContainerPage) {
            console.log("main.js: Conteneur trouvé ! Appel initializeStoryboardPage...");
            initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB); // Appel correct
        } else {
             console.error("main.js: ERREUR - #storyboard-container INTROUVABLE sur storyboard !");
        }
    } else if (pageName === 'prompts') { // Comparer avec 'prompts'
         console.log("main.js: Initialisation pour prompts...");
        const promptsContainerPage = document.getElementById('prompts-container');
        const chapterNameElementP = document.getElementById('chapter-name');
        if (promptsContainerPage) { initializePromptsPage(promptsContainerPage, chapterNameElementP); }
         else { console.warn("main.js: Éléments prompts non trouvés."); }
    } else {
         console.log(`main.js: Aucune initialisation spécifique pour la page: '${pageName}'`);
    }
    console.log("main.js: Fin initializeApp.");
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

async function initializeStoryboardPage(container, chapterTitleElement) { // Ajout chapterTitleElement comme argument
    console.log(">>> initializeStoryboardPage: DÉBUT"); // Log 1
    if (!container) { console.error("initializeStoryboardPage: Conteneur introuvable!"); return; }
    container.innerHTML = '<p>Chargement du storyboard...</p>';

    const scenarioJson = localStorage.getItem('bdScenario');
    if (!scenarioJson) {
        console.error(">>> initializeStoryboardPage: Scénario non trouvé dans localStorage.");
        container.innerHTML = '<p class="error-message">Erreur: Scénario non trouvé.</p>';
        return;
    }
    console.log(">>> initializeStoryboardPage: scenarioJson trouvé:", scenarioJson.substring(0, 100) + "..."); // Log 2

    try {
        console.log(">>> initializeStoryboardPage: Tentative de parsing du scénario..."); // Log 3
        const scenario = JSON.parse(scenarioJson);
        console.log(">>> initializeStoryboardPage: Scénario parsé avec succès:", scenario); // Log 4
        bdCreatorAppData.scenario = scenario; // Utiliser variable renommée

        // Vérifier la structure minimale du scénario parsé
        if (!scenario || !scenario.chapters || !Array.isArray(scenario.chapters)) {
             console.error(">>> initializeStoryboardPage: Structure du scénario invalide après parsing.");
             throw new Error("La structure du scénario récupéré est invalide.");
        }


        const existingStoryboardJson = localStorage.getItem('bdStoryboard');
        let storyboardData = null;

        if (existingStoryboardJson) {
            console.log(">>> initializeStoryboardPage: Storyboard existant trouvé dans localStorage."); // Log 5
            try {
                storyboardData = JSON.parse(existingStoryboardJson);
                console.log(">>> initializeStoryboardPage: Storyboard existant parsé:", storyboardData); // Log 6
                bdCreatorAppData.storyboard = storyboardData;
            } catch (e) {
                console.error(">>> initializeStoryboardPage: Erreur parsing storyboard existant:", e);
                localStorage.removeItem('bdStoryboard'); // Nettoyer
            }
        }

        if (!storyboardData) {
            console.log(">>> initializeStoryboardPage: Pas de storyboard valide, appel de generateAndSaveStoryboard..."); // Log 7
            if (!scenario.chapters.length) {
                console.error(">>> initializeStoryboardPage: Le scénario n'a pas de chapitres !");
                throw new Error("Scénario sans chapitres.");
            }
            // Appel de la fonction qui appelle createStoryboardDetaille
            storyboardData = await generateAndSaveStoryboard(scenario, 0); // Génère pour chap 0
            if (!storyboardData) {
                 console.error(">>> initializeStoryboardPage: generateAndSaveStoryboard a retourné null !");
                 throw new Error("Échec de la génération du storyboard.");
            }
             console.log(">>> initializeStoryboardPage: Storyboard généré:", storyboardData); // Log 8
        }

        // Mise à jour titre chapitre (ajout vérification existence)
        if(chapterTitleElement) {
            if (storyboardData?.chapterTitle) {
                 chapterTitleElement.textContent = storyboardData.chapterTitle;
                 console.log(">>> initializeStoryboardPage: Titre chapitre mis à jour:", storyboardData.chapterTitle); // Log 9
            } else {
                 chapterTitleElement.textContent = "Chapitre ?";
                 console.warn(">>> initializeStoryboardPage: Titre chapitre non trouvé dans storyboardData."); // Log 10
            }
        } else {
             console.warn(">>> initializeStoryboardPage: Element titre chapitre non trouvé sur la page."); // Log 11
        }


        console.log(">>> initializeStoryboardPage: Appel de displayStoryboard..."); // Log 12
        displayStoryboard(storyboardData, container);
        console.log(">>> initializeStoryboardPage: FIN (après appel displayStoryboard)"); // Log 13

    } catch (error) {
        console.error(">>> initializeStoryboardPage: ERREUR CATCH:", error); // Log 14
        container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`;
    }
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
