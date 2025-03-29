/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation de l'application et les interactions principales.
 * Nouvelle version avec vérification explicite de la disponibilité de generateScenarioDetaille.
 */

// --- Variables globales (si nécessaire) ---
let projectData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};

// --- Fonctions Utilitaires ---

// Fonction pour afficher le scénario (INCHANGÉE PAR RAPPORT À LA PRÉCÉDENTE VERSION)
function displayScenario(scenario, container) {
    console.log("main.js: Affichage du scénario dans le conteneur:", container);
     if (!scenario || typeof scenario !== 'object') {
        console.error("displayScenario: Scénario invalide fourni.", scenario);
        container.innerHTML = '<p class="error-message">Impossible d\'afficher le scénario (données invalides).</p>';
        return;
    }
     if (!container) {
        console.error("displayScenario: Conteneur HTML non trouvé.");
        container = document.getElementById('scenario-display-container'); // Essayer de le retrouver
         if(!container) {
            console.error("displayScenario: Conteneur #scenario-display-container introuvable même après nouvelle tentative.");
            return;
         }
    }
    container.innerHTML = ''; // Vider
    let htmlContent = '';
    // En-tête
    htmlContent += `<div class="scenario-header"><h3>${scenario.title || "Scénario Sans Titre"}</h3>`;
    if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,100)}${scenario.theme.length > 100 ? '...' : ''}</em></p>`;
    htmlContent += `</div>`;
    // Univers
    if (scenario.univers) {
        htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`;
        if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`;
        if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`;
        if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`;
        htmlContent += `</ul></div>`;
    }
    // Personnages
    if (scenario.personnages && scenario.personnages.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`;
        scenario.personnages.forEach(p => {
            htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`;
            if(p.description) htmlContent += `<br><small>${p.description}</small>`;
            htmlContent += `</li>`;
        });
        htmlContent += `</ul></div>`;
    }
    // Structure Narrative (Optionnel)
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) {
         htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`;
         scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; });
         htmlContent += `</ol></div>`;
    }
    // Chapitres (Accordéon)
    if (scenario.chapters && scenario.chapters.length > 0) {
        htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`;
        scenario.chapters.forEach((chapitre, index) => {
            htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">`;
            htmlContent += `Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`;
            htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun résumé.'}</p>`;
            if (chapitre.pages && chapitre.pages.length > 0) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`;
            htmlContent += `</div></div>`;
        });
        htmlContent += `</div></div>`;
    }
    container.innerHTML = htmlContent;
    console.log("main.js: Contenu du scénario injecté.");
}

// Fonction pour générer et afficher (INCHANGÉE PAR RAPPORT À LA PRÉCÉDENTE VERSION)
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("main.js: Appel de generateAndDisplayScenario pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') {
        console.error("ERREUR DANS generateAndDisplayScenario: window.generateScenarioDetaille n'est pas une fonction!");
        alert("Erreur interne: La fonction generateScenarioDetaille n'est pas prête.");
        // Nettoyage UI en cas d'erreur précoce
        generateButton.disabled = false;
        generateButton.textContent = "Générer un scénario";
        if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        return;
    }

    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("main.js: Scénario reçu:", scenario);
            if (!scenario) throw new Error("generateScenarioDetaille a retourné null.");

            projectData.scenario = scenario;
            try {
                localStorage.setItem('bdScenario', JSON.stringify(scenario));
                console.log("main.js: Scénario sauvegardé.");
            } catch (e) {
                console.error("main.js: Erreur sauvegarde localStorage:", e);
                alert("Attention: Scénario généré mais sauvegarde échouée.");
            }

            let scenarioContainer = document.getElementById('scenario-display-container');
            if (!scenarioContainer) {
                 console.warn("main.js: #scenario-display-container non trouvé. Création.");
                 scenarioContainer = document.createElement('div');
                 scenarioContainer.id = 'scenario-display-container';
                 scenarioContainer.className = 'scenario-container';
                 generateButton.closest('.feature')?.parentNode?.insertBefore(scenarioContainer, generateButton.closest('.feature').nextSibling);
            }

            displayScenario(scenario, scenarioContainer);

            generateButton.disabled = false;
            generateButton.textContent = "Générer un scénario";
            if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (scenarioContainer.scrollIntoView) scenarioContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error("main.js: Erreur dans promesse generateAndDisplayScenario:", error);
            alert("Erreur génération/affichage scénario. Console pour détails.");
            generateButton.disabled = false;
            generateButton.textContent = "Générer un scénario";
            if (loadingElement && loadingElement.parentNode) loadingElement.parentNode.removeChild(loadingElement);
        });
}

// --- Fonction d'Initialisation Principale ---
function initializeApp() {
    console.log("main.js: initializeApp() appelée.");

    // --- Vérifier si generateScenarioDetaille est défini ---
    // C'est la partie cruciale
    if (typeof window.generateScenarioDetaille === 'function') {
        console.log("main.js: La fonction window.generateScenarioDetaille est DÉFINIE. Initialisation de la page d'accueil.");
        initializeHomePage();
    } else {
        // Si la fonction n'est PAS définie, attendre un peu et réessayer
        console.warn("main.js: window.generateScenarioDetaille n'est PAS encore définie. Tentative de report...");
        setTimeout(initializeApp, 100); // Réessayer après 100ms
        return; // Sortir pour ne pas exécuter le reste prématurément
    }

    // --- Initialisation spécifique aux autres pages (si nécessaire) ---
    initializeOtherPages();
}

// --- Initialisation Spécifique à la Page d'Accueil ---
function initializeHomePage() {
    const keywordsInput = document.getElementById('keywords');
    const generateButton = document.getElementById('generate-scenario-btn');
    const scenarioDisplayContainer = document.getElementById('scenario-display-container');

    if (keywordsInput && generateButton && scenarioDisplayContainer) {
        console.log("main.js: Initialisation effective de la page d'accueil.");

        // Attacher l'écouteur SEULEMENT MAINTENANT que generateScenarioDetaille est confirmée
        if (!generateButton.dataset.listenerAttached) { // Éviter d'attacher plusieurs fois
             generateButton.addEventListener('click', function() {
                 console.log("main.js: Bouton 'Générer un scénario' cliqué.");
                 // ... (Code du listener comme avant) ...
                 const keywords = keywordsInput.value;
                 if (!keywords || keywords.trim() === '') {
                     alert('Veuillez entrer du texte pour inspirer votre BD.');
                     return;
                 }
                 generateButton.disabled = true;
                 generateButton.textContent = "Génération...";
                 let loadingElement = document.getElementById('loading-indicator');
                 if (!loadingElement) {
                     loadingElement = document.createElement('div');
                     loadingElement.id = 'loading-indicator';
                     loadingElement.innerHTML = '<p>Génération du scénario en cours...</p>';
                     loadingElement.style.cssText = 'margin-top: 15px; padding: 10px; background-color: #eee; border-radius: 4px; text-align: center;';
                     generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling);
                 } else {
                     loadingElement.style.display = 'block';
                 }
                 localStorage.removeItem('bdScenario');
                 localStorage.removeItem('bdStoryboard');
                 localStorage.removeItem('bdPrompts');
                 localStorage.setItem('bdKeywords', keywords);
                 generateAndDisplayScenario(keywords, generateButton, loadingElement); // Appel direct
             });
             generateButton.dataset.listenerAttached = 'true'; // Marquer comme attaché
              console.log("main.js: Écouteur d'événements attaché au bouton.");
         }


        // Afficher le scénario existant
        const existingScenarioJson = localStorage.getItem('bdScenario');
        if (existingScenarioJson) {
            console.log("main.js: Affichage du scénario existant (accueil).");
            try {
                const existingScenario = JSON.parse(existingScenarioJson);
                displayScenario(existingScenario, scenarioDisplayContainer);
                keywordsInput.value = localStorage.getItem('bdKeywords') || '';
            } catch (e) {
                console.error("main.js: Erreur parsing scénario existant (accueil):", e);
                localStorage.removeItem('bdScenario');
                scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement scénario sauvegardé.</p>';
            }
        } else {
             scenarioDisplayContainer.innerHTML = ''; // Vider si pas de scénario
        }
    }
}

// --- Initialisation Spécifique aux Autres Pages ---
function initializeOtherPages() {
    const scenarioContainerPage = document.getElementById('scenario-container');
    const keywordsDisplayPage = document.getElementById('keywords-display');
    if (scenarioContainerPage && keywordsDisplayPage) {
        console.log("main.js: Initialisation page Scénario.");
        const keywords = localStorage.getItem('bdKeywords') || '';
        keywordsDisplayPage.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : '');
        const scenarioJson = localStorage.getItem('bdScenario');
        if (scenarioJson) {
            try {
                const scenario = JSON.parse(scenarioJson);
                displayScenario(scenario, scenarioContainerPage);
            } catch (e) {
                console.error("main.js: Erreur affichage page Scénario:", e);
                scenarioContainerPage.innerHTML = '<p class="error-message">Erreur affichage scénario.</p>';
            }
        } else {
            scenarioContainerPage.innerHTML = '<p>Aucun scénario généré. Retournez à l\'accueil.</p>';
        }
    }

    // Ajouter ici la logique pour storyboard.html et prompts.html si nécessaire
    // en suivant le même modèle (vérifier l'ID du conteneur principal de la page)
    const storyboardContainerPage = document.getElementById('storyboard-container');
     if (storyboardContainerPage) {
         console.log("main.js: Initialisation page Storyboard.");
         // Charger et afficher storyboard...
         // displayStoryboard(...)
     }

     const promptsContainerPage = document.getElementById('prompts-container');
     if (promptsContainerPage) {
         console.log("main.js: Initialisation page Prompts.");
         // Charger et afficher prompts...
         // displayPrompts(...)
     }
}


// --- Point d'Entrée Principal ---
// Utiliser DOMContentLoaded pour s'assurer que le HTML est prêt,
// mais appeler initializeApp qui va vérifier/attendre que generateScenarioDetaille soit prêt.
document.addEventListener('DOMContentLoaded', initializeApp);

console.log("main.js chargé et prêt à initialiser l'application.");
});

console.log("main.js chargé.");
