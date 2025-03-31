/**
 * BD Creator - Script Principal (main.js)
 * Version finale avec logs pour déboguer l'affichage du scénario.
 */
console.log("--- Exécution de main.js (Version Finale Renommée + Logs) ---");

// Variable globale
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
    try { // Ajouter un try...catch autour de la génération HTML
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
// Assurez-vous qu'elles sont bien présentes ici (versions de la réponse précédente)
function displayStoryboardComplet(storyboardComplet, container) { /* ... Votre code ... */ }
function displayPrompts(promptsData, container) { /* ... Votre code ... */ }
function handlePromptCopy(event) { /* ... Votre code ... */ }


// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    // *** LOG CLÉ 3 ***
    console.log(">>> generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateScenarioDetaille N'EST PAS DÉFINIE !"); alert("Erreur critique."); /* Nettoyage UI */ return; }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            // *** LOG CLÉ 4 ***
            console.log(">>> generateAndDisplayScenario (.then): Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario null reçu."); } // Provoque le .catch

            bdCreatorAppData.scenario = scenario;
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); } catch (e) { console.error("Erreur sauvegarde Scénario:", e); }

            let container = document.getElementById('scenario-display-container');
            if (!container) { console.warn("Conteneur affichage scénario non trouvé! Création..."); container = document.createElement('div'); container.id = 'scenario-display-container'; container.className = 'scenario-container'; generateButton.closest('.feature')?.parentNode?.insertBefore(container, generateButton.closest('.feature').nextSibling); }

            displayScenario(scenario, container); // Appel affichage

            // Nettoyage UI succès
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (container?.scrollIntoView) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
             // *** LOG CLÉ 9 (ERREUR GENERATION/PROMESSE) ***
            console.error(">>> generateAndDisplayScenario: ERREUR CATCH:", error);
            alert("Erreur génération scénario. Voir console.");
            // Nettoyage UI erreur
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer le scénario.</p>`; }
        });
}

async function generateAndSaveStoryboardComplet(scenario) { /* ... Votre code ... */ }
async function generateAndSavePrompts(storyboardData) { /* ... Votre code ... */ }


// --- Initialisation ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() { /* ... Votre code initializeApp complet ... */ }

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     if (!generateButton.dataset.listenerAttached) {
        generateButton.addEventListener('click', function() {
            // *** LOG CLÉ 1 ***
            console.log(">>> Bouton Générer Scénario cliqué!");
            const keywords = keywordsInput.value; if (!keywords?.trim()) { alert('Veuillez entrer du texte.'); return; }
            generateButton.disabled = true; generateButton.textContent = "Génération..."; let loadingElement = document.getElementById('loading-indicator');
            if (!loadingElement) { loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); } else { loadingElement.style.display = 'block'; }
            localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); localStorage.setItem('bdKeywords', keywords);
             // *** LOG CLÉ 2 ***
            console.log(">>> Listener Clic: Appel de generateAndDisplayScenario...");
            if (typeof window.generateScenarioDetaille === 'function') { generateAndDisplayScenario(keywords, generateButton, loadingElement); }
            else { console.error("HOME: generateScenarioDetaille non trouvé!"); alert("Erreur critique."); /* Nettoyage UI */ }
        });
        generateButton.dataset.listenerAttached = 'true'; console.log("main.js: Écouteur attaché (Accueil).");
     }
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) { /* ... Votre code ... */ }
async function initializeStoryboardPage(container, chapterTitleElement) { /* ... Votre code ... */ }
async function initializePromptsPage(container, chapterNameElement) { /* ... Votre code ... */ }

console.log("main.js (Complet final - Renommé + Logs) chargé.");
