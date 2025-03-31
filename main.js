/**
 * BD Creator - Script Principal (main.js)
 * Version avec logs détaillés dans le listener du bouton Générer.
 */
console.log("--- Exécution de main.js (Version Finale Renommée + Logs Listener) ---");

// Variable globale
let bdCreatorAppData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};
console.log("main.js: Variable bdCreatorAppData initialisée.");

// --- Fonctions Utilitaires (Affichage) ---
function displayScenario(scenario, container) { /* ... Votre fonction displayScenario complète ... */ }
function displayStoryboardComplet(storyboardComplet, container) { /* ... Votre fonction displayStoryboardComplet ... */ }
function displayPrompts(promptsData, container) { /* ... Votre fonction displayPrompts ... */ }
function handlePromptCopy(event) { /* ... Votre fonction handlePromptCopy ... */ }
// ... (COLLEZ ICI VOS FONCTIONS displayScenario, displayStoryboardComplet, displayPrompts, handlePromptCopy fonctionnelles) ...
// IMPORTANT: Assurez-vous qu'elles sont complètes et correctes.


// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log(">>> generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error("generateAndDisplayScenario: generateScenarioDetaille N'EST PAS DÉFINIE !");
        alert("Erreur critique.");
        // Nettoyage UI en cas d'erreur précoce
        generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        return;
     }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log(">>> generateAndDisplayScenario (.then): Scénario reçu:", scenario);
            if (!scenario) { throw new Error("Scénario null reçu."); }
            bdCreatorAppData.scenario = scenario;
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); }
            catch (e) { console.error("Erreur sauvegarde Scénario:", e); }
            let container = document.getElementById('scenario-display-container');
            if (!container) { console.warn("Conteneur affichage scénario non trouvé! Création..."); container = document.createElement('div'); container.id = 'scenario-display-container'; container.className = 'scenario-container'; generateButton.closest('.feature')?.parentNode?.insertBefore(container, generateButton.closest('.feature').nextSibling); }
            displayScenario(scenario, container);
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (container?.scrollIntoView) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error(">>> generateAndDisplayScenario: ERREUR CATCH:", error); alert("Erreur génération scénario. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer.</p>`; }
        });
}

async function generateAndSaveStoryboardComplet(scenario) { /* ... Votre fonction ... */ }
async function generateAndSavePrompts(storyboardData) { /* ... Votre fonction ... */ }


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
        else { console.error("main.js: ERREUR - Éléments clés non trouvés sur index!"); } // Plus fort qu'un warning
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
     if (!generateButton) { console.error("initializeHomePage: BOUTON GÉNÉRER INTROUVABLE !"); return; } // Vérification ajoutée
     if (!keywordsInput) { console.error("initializeHomePage: INPUT KEYWORDS INTROUVABLE !"); return; }

     // Vider l'ancien listener s'il existe (sécurité)
     // Note: Pour cela, il faudrait stocker la référence à la fonction listener
     // Pour l'instant, on se fie au dataset guard.

     if (!generateButton.dataset.listenerAttached) {
        console.log("main.js: Attachement de l'écouteur au bouton Générer...");
        generateButton.addEventListener('click', function handleGenerateClick() { // Nommer la fonction pour clarté
            // *** LOG 1 : Clic détecté ***
            console.log(">>> BOUTON GÉNÉRER SCÉNARIO CLIQUÉ <<<");

            try { // Ajouter un try...catch global dans le listener
                // *** LOG 2 : Récupération keywords ***
                const keywords = keywordsInput.value;
                console.log(">>> Listener: Keywords récupérés:", keywords);
                if (!keywords || keywords.trim() === '') {
                    alert('Veuillez entrer du texte.');
                    console.log(">>> Listener: Pas de keywords, sortie.");
                    return; // Important de sortir
                }

                // *** LOG 3 : Désactivation UI ***
                console.log(">>> Listener: Désactivation bouton et affichage chargement...");
                generateButton.disabled = true; generateButton.textContent = "Génération...";
                let loadingElement = document.getElementById('loading-indicator');
                // Créer l'élément de chargement s'il n'existe pas DÉJÀ
                if (!loadingElement) {
                    console.log(">>> Listener: Création de l'élément loading-indicator.");
                    loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator';
                    loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;';
                    // Insérer APRÈS le bouton (ou son parent .feature)
                     generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling);
                }
                 loadingElement.style.display = 'block'; // Assurer qu'il est visible
                console.log(">>> Listener: Indicateur de chargement prêt.");


                // *** LOG 4 : Nettoyage localStorage ***
                console.log(">>> Listener: Nettoyage localStorage (scenario, storyboard, prompts)...");
                localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts');
                localStorage.setItem('bdKeywords', keywords);
                console.log(">>> Listener: Nouveaux keywords sauvegardés.");

                // *** LOG 5 : Vérification fonction génération ***
                console.log(">>> Listener: Vérification existence window.generateScenarioDetaille...");
                if (typeof window.generateScenarioDetaille === 'function') {
                    console.log(">>> Listener: Fonction trouvée. Appel de generateAndDisplayScenario...");
                    generateAndDisplayScenario(keywords, generateButton, loadingElement); // Appel
                } else {
                     console.error(">>> Listener: ERREUR CRITIQUE - generateScenarioDetaille non trouvée AU MOMENT DU CLIC!");
                     alert("Erreur critique: Fonction de génération indisponible.");
                     // Nettoyage UI en cas d'erreur AVANT appel
                     generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
                }
            } catch (errorInListener) {
                 // *** LOG 6 : Erreur inattendue dans le listener ***
                 console.error(">>> Listener: ERREUR INATTENDUE DANS LE HANDLER:", errorInListener);
                 alert("Une erreur inattendue est survenue. Vérifiez la console.");
                 // Nettoyage UI
                 generateButton.disabled = false; generateButton.textContent = "Générer un scénario";
                 let loadingElem = document.getElementById('loading-indicator'); // Re-vérifier
                 if (loadingElem?.parentNode) loadingElem.parentNode.removeChild(loadingElem);
            }
        });
        generateButton.dataset.listenerAttached = 'true';
        console.log("main.js: Écouteur attaché (Accueil).");
     } else {
          console.log("main.js: Écouteur déjà attaché (Accueil).");
     }

     // Afficher scénario existant
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) { /* ... Votre code ... */ }
async function initializeStoryboardPage(container, chapterTitleElement) { /* ... Votre code ... */ }
async function initializePromptsPage(container, chapterNameElement) { /* ... Votre code ... */ }

console.log("main.js (Complet final - Renommé + Logs Clic) chargé.");
